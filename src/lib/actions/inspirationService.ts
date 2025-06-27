import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


interface InspirationData {
  obviousAbstract: string;
  era: string;
  years?: string[];
  formStyle?: string;
  colorStyle?: string;
  age?: string;
  materialism?: string;
  negativeSpace?: string;
  logoType?: string[];
  designElements?: string[];
  colorCount?: string;
  designerName: string;
  quality?: string;
  timeStamp?: Date;
  tags: string[];
  outlineStyle?: string;
  gender?: string;
  complexity?: string;
  logoSubject?: string;
  creative?: string;
}

interface CreationResult {
  id: string;
  imageUrl?: string;
  filePath?: string;
}

export const addLogoInspiration = {
  async create(data: InspirationData, file?: File | Blob): Promise<CreationResult> {
    try {
      // Validate required fields
      if (!data.era) throw new Error("Era is required");
      if (!data.designerName) throw new Error("Designer name is required");
      if (!file) throw new Error("Image file is required");

      const storageInstance = getStorage();
      let imageUrl: string | null = null;
      let filePath: string | null = null;

      // Process file upload
      const ext = file instanceof File && file.name.includes(".")
        ? file.name.split(".").pop()
        : "webp";

      const fileName = `inspiration/${Date.now()}_${crypto.randomUUID()}.${ext}`;
      const fileRef = ref(storageInstance, fileName);

      // Upload file and get URL
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
      filePath = fileName;

      // Prepare Firestore document data
      const docData = {
        ...data,
        filePath,
        imageUrl, // Store both path and accessible URL
        createdAt: new Date(),
        updatedAt: new Date(),
        // Ensure all fields are properly typed
        timeStamp: data.timeStamp || new Date()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "inspiration"), docData);

      return {
        id: docRef.id,
        imageUrl: imageUrl || undefined,
        filePath: filePath || undefined
      };

    } catch (error) {
      console.error("Inspiration creation error:", error);
      throw error instanceof Error 
        ? error 
        : new Error("Failed to create inspiration");
    }
  }
};