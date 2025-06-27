import Link from "next/link"
export default function Admin(){
  return(
    <div>
      <ul>
        <Link href={"/admin/logo-inspiration/add-new"}>Add New</Link>
         <Link href={"/admin/logo-inspiration/list-all"}>List All</Link>
      </ul>
    </div>
  )
}