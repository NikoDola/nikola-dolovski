
import Link from 'next/link'

export default async function AdminPage() { // ← Note the async keyword


  return (
        <div>
      <ul>
        <Link href={"/admin/logo-inspiration"}>Logo Inspiration</Link>
      </ul>
    </div>
  )
}