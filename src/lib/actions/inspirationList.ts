import { db } from "../firebase";
import { collection, getDocs} from "firebase/firestore";

export async function listlogos() {
  try {
    const colRef = collection(db, "inspiration")
    const docsRef = await getDocs(colRef)
  
    return docsRef.docs.map((item) => ({
      id: item.id,
      ...item.data()
    }))
  } catch (error) {
    console.error("Error fetching inspirations:", error);
    throw error; 
  }
}