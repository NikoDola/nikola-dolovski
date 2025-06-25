import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function chatSave(initialMessages: ChatMessage[], ip: string) {
  const created = new Date();
  const docRef = await addDoc(collection(db, "chat"), {
    messages: initialMessages,
    created,
    ip,
  });
  return docRef.id;
}

export async function chatUpdate(id: string, newMessages: ChatMessage[], ip: string) {
  const docRef = doc(db, "chat", id);
  await updateDoc(docRef, {
    messages: arrayUnion(...newMessages),
    updated: new Date(),
    ip,
  });
}
