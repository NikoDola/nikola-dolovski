// lib/actions/services.ts
"use server"

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addService() {
  try {
    const collRef = collection(db, 'calculator');
    await addDoc(collRef, { 
      testField: "Hello world",
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Firestore error:", error);
    return { success: false };
  }
}