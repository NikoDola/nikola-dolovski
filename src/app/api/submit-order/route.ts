import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { initializeApp, getApps, cert, ServiceAccount } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

export const dynamic = "force-dynamic"

function getFirebase() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      } as ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })
  }
  return { db: getFirestore(), storage: getStorage() }
}

async function uploadFile(
  file: Buffer,
  fileName: string,
  orderId: string,
  fileType: "logo" | "inspiration"
): Promise<string> {
  const { storage } = getFirebase()
  const bucket = storage.bucket()
  const timestamp = Date.now()
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120)
  const path = `orders/${orderId}/${fileType}/${timestamp}-${sanitizedName}`
  const file_ref = bucket.file(path)

  await file_ref.save(file)
  await file_ref.makePublic()

  return `https://storage.googleapis.com/${bucket.name}/${path}`
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const { db } = getFirebase()

  try {
    const formData = await req.formData()
    const sessionId = formData.get("sessionId") as string
    const companyName = formData.get("companyName") as string
    const tagline = formData.get("tagline") as string
    const description = formData.get("description") as string
    const contactEmail = formData.get("contactEmail") as string
    const variations = JSON.parse(formData.get("variations") as string)
    const styles = JSON.parse(formData.get("styles") as string)
    const serviceType = formData.get("serviceType") as string
    const typographyType = formData.get("typographyType") as string
    const selectedFonts = JSON.parse(formData.get("selectedFonts") as string)
    const fontLinks = JSON.parse(formData.get("fontLinks") as string)
    const sameBrandFont = formData.get("sameBrandFont") === "true"
    const colorFamilies = JSON.parse(formData.get("colorFamilies") as string)
    const customColors = JSON.parse(formData.get("customColors") as string)
    const useSameColors = formData.get("useSameColors") === "true"
    const pinterestUrl = formData.get("pinterestUrl") as string
    const totalAmount = Number(formData.get("totalAmount") as string)

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // 1. Verify payment with Stripe
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId)
    } catch {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // 2. Prevent duplicate submissions
    const usedDoc = await db.collection("used_sessions").doc(sessionId).get()
    if (usedDoc.exists) {
      return NextResponse.json({ error: "Session already used" }, { status: 400 })
    }

    // 3. Create order ID
    const orderId = db.collection("orders").doc().id

    let logoUrl: string | null = null
    let inspirationUrl: string | null = null

    // 4. Upload files if provided
    const logoFile = formData.get("logoFile") as File | null
    const inspirationFile = formData.get("inspirationFile") as File | null

    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadFile(Buffer.from(await logoFile.arrayBuffer()), logoFile.name, orderId, "logo")
    }

    if (inspirationFile && inspirationFile.size > 0) {
      inspirationUrl = await uploadFile(Buffer.from(await inspirationFile.arrayBuffer()), inspirationFile.name, orderId, "inspiration")
    }

    // 5. Save order to Firestore
    await db.collection("orders").doc(orderId).set({
      orderId,
      stripeSessionId: sessionId,
      contactEmail,
      companyName,
      tagline,
      description,
      serviceType,
      variations,
      styles,
      typographyType,
      selectedFonts,
      fontLinks: fontLinks.filter((l: string) => l.trim()),
      sameBrandFont,
      colorFamilies,
      customColors,
      useSameColors,
      pinterestUrl,
      logoUrl,
      inspirationUrl,
      totalAmount,
      createdAt: new Date(),
      paymentStatus: session.payment_status,
      status: "pending",
    })

    // 6. Mark session used
    await db.collection("used_sessions").doc(sessionId).set({ usedAt: new Date(), sessionId })

    return NextResponse.json({ success: true, orderId, message: "Order submitted successfully" })
  } catch (error) {
    console.error("Order submission error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit order" },
      { status: 500 }
    )
  }
}
