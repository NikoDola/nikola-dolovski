import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

interface InspirationData {
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
}

export const InspirationService = {
  async create(data: InspirationData) {
    try {
      // Validate required fields
      if (!data.era) throw new Error("Era is required");
      if (!data.designerName) throw new Error("Designer name is required");

      // Create document in Firestore
      const docRef = await addDoc(collection(db, "inspiration"), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { id: docRef.id };

    } catch (error) {
      console.error("Inspiration creation error:", error);
      throw error instanceof Error ? error : new Error("Failed to create inspiration");
    }
  }
};