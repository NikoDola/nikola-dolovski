import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface DataType{
  era: string
}

export async function addInspiration(data: DataType, file?: File) {
  try {
    let fileUrl = null;
    
    // If a file is provided, upload it to Firebase Storage first
    if (file) {
      // Create a storage reference
      const storageRef = ref(storage, `inspiration/${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      fileUrl = await getDownloadURL(snapshot.ref);
    }

    // Add document to Firestore
    const collRef = collection(db, "inspiration");
    const docData = {
      ...data,
      ...(fileUrl && { fileUrl }), // only add fileUrl if it exists
      createdAt: new Date() // optional: add timestamp
    };
    
    return await addDoc(collRef, docData);
  } catch (error) {
    console.error("Error adding inspiration:", error);
    throw error; // Consider re-throwing the error for handling in the calling component
  }
}