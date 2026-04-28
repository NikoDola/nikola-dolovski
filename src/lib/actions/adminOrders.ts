"use server"
import { getAdminApp } from "@/lib/firebase/admin"
import { getFirestore } from "firebase-admin/firestore"

export async function deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    getAdminApp()
    const db = getFirestore()
    await db.collection("orders").doc(orderId).delete()
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete order" }
  }
}
