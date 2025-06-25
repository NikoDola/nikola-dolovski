import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function chatSave(initialMessages: ChatMessage[]) {
  const created = new Date();
  const docRef = await addDoc(collection(db, "chat"), {
    messages: initialMessages,
    created,
  });
  return docRef.id;
}

export async function chatUpdate(id: string, newMessages: ChatMessage[]) {
  const docRef = doc(db, "chat", id);
  await updateDoc(docRef, {
    messages: arrayUnion(...newMessages), // appends to the array
    updated: new Date(),
  });
}
