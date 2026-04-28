import { NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

export async function GET(req: NextRequest) {
  try {
    const results: any = {
      envVarsLoaded: false,
      appInitialized: false,
      firestoreConnected: false,
      storageConnected: false,
      errors: [],
    }

    const requiredVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_PRIVATE_KEY_ID",
      "FIREBASE_PRIVATE_KEY",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_CLIENT_ID",
      "FIREBASE_CLIENT_CERT_URL",
      "FIREBASE_STORAGE_BUCKET",
    ]

    const missingVars = requiredVars.filter(v => !process.env[v])
    if (missingVars.length > 0) {
      results.errors.push(`Missing env vars: ${missingVars.join(", ")}`)
      return NextResponse.json(results)
    }

    results.envVarsLoaded = true

    const firebaseConfig = {
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
    }

    if (!getApps().length) {
      initializeApp({
        credential: cert(firebaseConfig as any),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      })
    }

    results.appInitialized = true

    const db = getFirestore()
    await db.collection("test").doc("ping").set({ timestamp: new Date() })
    results.firestoreConnected = true

    const storage = getStorage()
    const bucket = storage.bucket()
    results.storageConnected = true

    return NextResponse.json({
      ...results,
      success: true,
      message: "All Firebase services connected successfully!",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
