"use client"

import {  usePathname } from "next/navigation"


export default function ContactForm (){
    const path = usePathname()
    console.log(path)
    return(
        <>
        <hr className="bg-gray-800 text-gray-800 opacity-25"/>
          <section className="flex justify-around my-24 max-[1200px]:flex-col gap-8" >
    
            <div>
            <h5 className="text-4xl font-bold mb-8">Have a project in mind?</h5>
            <h5> I&apos;d love to hear from you. <br />
                Drop a message, and let&apos;s make something amazing together!</h5>
            </div>
            <form className="flex flex-col gap-4 rounded-3xl-group focus:outline-red">
                <div className="flex gap-4 max-[900px]:flex-col">
                    <input className="w-full" name="name" placeholder="Your Name" />
                    <input className=" w-full" name="name" placeholder="Your Email" />
                </div>
                
                <textarea className=" h-40" name="body" placeholder="Your Message"/>
                <button> Send</button>
            </form>
        </section>
        </>
      
    )
}