import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import crypto from "crypto"

/*
  SETUP REQUIRED
  ─────────────────────────────────────────────────────────────────────────────
  1. Google reCAPTCHA v2
     • Create a site at https://www.google.com/recaptcha/admin
     • Add to .env.local:
         NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
         RECAPTCHA_SECRET_KEY=your_secret_key

  2. Firebase Storage rules (paste into Firebase Console → Storage → Rules):
     rules_version = '2';
     service firebase.storage {
       match /b/{bucket}/o {
         match /orders/{orderId}/{allPaths=**} {
           allow read: if false;
           allow write: if request.resource.size < 5 * 1024 * 1024
                        && (request.resource.contentType.matches('image/.*')
                            || request.resource.contentType.matches('font/.*'));
         }
       }
     }

  3. Upstash Redis — already in the project.
     Make sure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
  ─────────────────────────────────────────────────────────────────────────────
*/

// 3 order submissions per IP per hour
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "branding_order",
})

const ALLOWED_TYPES: Record<string, string[]> = {
  logos: ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"],
  fonts: ["font/ttf", "font/otf", "font/woff", "font/woff2",
    "application/font-woff", "application/font-woff2",
    "application/x-font-ttf", "application/x-font-opentype",
    "application/octet-stream"],
  inspiration: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/tiff"],
}

const MAX_SIZE: Record<string, number> = {
  logos: 2 * 1024 * 1024,       // 2 MB
  fonts: 1 * 1024 * 1024,       // 1 MB
  inspiration: 5 * 1024 * 1024, // 5 MB
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120)
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) return true // skip if not configured
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })
  const data = await res.json()
  return data.success === true
}

async function uploadToStorage(
  buffer: ArrayBuffer,
  contentType: string,
  storagePath: string
): Promise<void> {
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  if (!bucket) throw new Error("Firebase storage bucket not configured")

  const encodedPath = encodeURIComponent(storagePath)
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodedPath}`

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: buffer,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Storage upload failed [${res.status}]: ${text}`)
  }
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  const { success: allowed } = await ratelimit.limit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in an hour." },
      { status: 429 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Verify reCAPTCHA
  const captchaToken = (formData.get("captchaToken") as string) || ""
  if (process.env.RECAPTCHA_SECRET_KEY && !captchaToken) {
    return NextResponse.json({ error: "Please complete the captcha." }, { status: 400 })
  }
  if (!(await verifyRecaptcha(captchaToken))) {
    return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 })
  }

  // Validate text fields
  const clientName = ((formData.get("clientName") as string) || "").trim()
  const clientEmail = ((formData.get("clientEmail") as string) || "").trim()
  const notes = ((formData.get("notes") as string) || "").trim()
  const selectedServicesRaw = (formData.get("selectedServices") as string) || ""
  const totalHours = Number(formData.get("totalHours"))
  const grandTotal = Number(formData.get("grandTotal"))

  if (!clientName || clientName.length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 })
  }
  if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (!selectedServicesRaw) {
    return NextResponse.json({ error: "No services selected." }, { status: 400 })
  }

  let selectedServices: unknown[]
  try {
    selectedServices = JSON.parse(selectedServicesRaw)
    if (!Array.isArray(selectedServices) || selectedServices.length === 0) throw new Error()
  } catch {
    return NextResponse.json({ error: "Invalid services data." }, { status: 400 })
  }

  // Validate & upload files
  const orderId = crypto.randomUUID()
  const uploadedFiles: { type: string; path: string; originalName: string }[] = []
  let totalFileCount = 0

  for (const category of ["logos", "fonts", "inspiration"] as const) {
    const incoming = formData.getAll(category) as File[]
    const real = incoming.filter(f => f instanceof File && f.size > 0)

    if (real.length > 3) {
      return NextResponse.json({ error: `Maximum 3 ${category} files allowed.` }, { status: 400 })
    }

    totalFileCount += real.length
    if (totalFileCount > 9) {
      return NextResponse.json({ error: "Maximum 9 files total." }, { status: 400 })
    }

    for (const file of real) {
      if (file.size > MAX_SIZE[category]) {
        const mb = MAX_SIZE[category] / 1024 / 1024
        return NextResponse.json(
          { error: `"${file.name}" exceeds the ${mb} MB limit for ${category}.` },
          { status: 400 }
        )
      }
      if (!ALLOWED_TYPES[category].includes(file.type)) {
        return NextResponse.json(
          { error: `"${file.name}" has an invalid file type for ${category}.` },
          { status: 400 }
        )
      }

      const ext = (file.name.split(".").pop() || "bin").replace(/[^a-zA-Z0-9]/g, "")
      const newName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
      const storagePath = `orders/${orderId}/${category}/${newName}`

      const buffer = await file.arrayBuffer()
      await uploadToStorage(buffer, file.type, storagePath)

      uploadedFiles.push({
        type: category,
        path: storagePath,
        originalName: sanitizeFilename(file.name),
      })
    }
  }

  // Save order to Firestore
  await addDoc(collection(db, "orders"), {
    orderId,
    clientName,
    clientEmail,
    notes,
    selectedServices,
    totalHours,
    grandTotal,
    uploadedFiles,
    ip,
    status: "new",
    createdAt: serverTimestamp(),
  })

  return NextResponse.json({ success: true, orderId })
}
