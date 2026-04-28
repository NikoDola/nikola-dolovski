import { NextRequest, NextResponse } from "next/server"
import { getAdminApp } from "@/lib/firebase/admin"
import { getAuth } from "firebase-admin/auth"

const ALLOWED_EMAIL = "nikodola@gmail.com"

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 })

    getAdminApp()
    const decoded = await getAuth().verifyIdToken(idToken)

    if (decoded.email !== ALLOWED_EMAIL) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return res
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete("admin_session")
  return res
}
