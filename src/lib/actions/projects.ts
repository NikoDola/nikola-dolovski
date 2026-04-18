import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore"
import type { Project } from "@/types/project"

const COL = "portfolio_projects"

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, COL), orderBy("name"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
}

export async function saveProject(project: Project): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, ...data } = project
  await setDoc(doc(db, COL, project.slug), data)
}

export async function deleteProject(slug: string): Promise<void> {
  await deleteDoc(doc(db, COL, slug))
}
