"use client"

import { useRouter, usePathname } from "next/navigation"


export default function (){
    const path = usePathname()
    console.log(path)
    return(
        <section className="flex justify-around my-24" >
            <div>
                <h5 className="text-4xl font-bold mb-8">Have a project in mind?</h5>
                <h5> I’d love to hear from you. <br/>
                    Drop a message, and let's make something amazing together!</h5>
            </div>
            <form className="flex flex-col gap-4 rounded-3xl-group">
                <div className="flex gap-4">
                    <input name="name" placeholder="Your Name" className="p-2"/>
                    <input name="name" placeholder="Your Email" className="p-2"/>
                </div>
              
                <textarea name="body" placeholder="Your Message" className="p-2"/>
                <button> Send</button>
            </form>
        </section>
    )
}