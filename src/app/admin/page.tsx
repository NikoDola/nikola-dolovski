import Link from "next/link"
export default function Admin(){
  return(
    <div>
      <ul>
        <Link href={"/admin/logo-inspiration"}>Logo Inspiration</Link>
      </ul>
    </div>
  )
}