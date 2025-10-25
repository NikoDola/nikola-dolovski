// app/components/AddItem.tsx
import { addService } from "@/lib/actions/services"

export default function AddItem() {
  // This creates a bound action that can be passed to the form
  const submitAction = async () => {
    "use server"
    await addService()
  }

  return (
    <form action={submitAction}>
      <button type="submit">Create Collection</button>
    </form>
  )
}