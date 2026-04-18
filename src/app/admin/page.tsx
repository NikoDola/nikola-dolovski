
import Link from 'next/link'

export default async function AdminPage() { // ← Note the async keyword


  return (
    <div>
      <ul>
        <li><Link href={"/admin/logo-inspiration"}>Logo Inspiration</Link></li>
        <li><Link href={"/admin/social"}>Social Media</Link></li>
      </ul>
    </div>
  )
}