import Link from "next/link"
import "./Logo.css"


export default function Logo({size, link}: {size:string, link:string}){

  return(
    <Link href={link}>
     <div style={{width:size, height:size}} className="logoWrapper">
      
      <div className="hair"> </div>
       <div className="glasses">
        <div className="glassessMask"></div>
       </div>
       <div className="beard"></div>
       <div className="lips"></div>
    </div>
    </Link>
   
  )
}