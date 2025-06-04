"use client"


import { useEffect} from "react"

export default function Portfolio(){
  // const [portfolioItem] = useState(['Branding', 'Webdesign', 'Iconography','illustrations', 'Other'])


  useEffect(() => {
    let lastHello = 0;
  
    function animate(timestamp: number) {
      const elapsed = timestamp - lastHello;
  
      if (elapsed >= 10000) { 
        console.log("hello");
        lastHello = timestamp;
      }
  
      requestAnimationFrame(animate);
    }
  
    requestAnimationFrame(animate);
  }, []);
  

  return(
    <div className="bg-black h-[100vh] w-full">
      <p>{}</p>
    </div>
  )
}

// "use client"
// import "@/components/Portfolio.css"
// import { useEffect, useRef, useState } from "react"

// export default function Portfolio() {
//   const [portfolioItem] = useState(['Branding', 'Webdesign', 'Iconography','illustrations', 'Other'])
//   const [selected, setSelected] = useState(0)
//   const startTimeRef = useRef(0)

//   useEffect(() => {
//     const seconds = 10000

//     function animate(timestamp: number) {
//       if (!startTimeRef.current) {
//         startTimeRef.current = timestamp
//       }

//       const elapsed = timestamp - startTimeRef.current

//       if (elapsed >= seconds) {
//         setSelected(prev => {
//           const next = (prev + 1) % portfolioItem.length
//           console.log("Updated selected:", next)
//           return next
//         })
//         startTimeRef.current = timestamp
        
//       }

//       requestAnimationFrame(animate)
//     }

//     const id = requestAnimationFrame(animate)
//     return () => cancelAnimationFrame(id)
//   }, [portfolioItem.length])

//   const handleClick = (index: number) => {
//     setSelected(index)
//     startTimeRef.current = 0 
//   }

//   return (
//     <div >
//       <div className="w-full h-[100vh] bg-black"></div>
//         <ul className="flex gap-10 mx-auto justify-between py-2 px-8 left-[50%] translate-x-[-50%]  rounded-xl w-min absolute bottom-[5%] items-center">
//         {portfolioItem.map((item, index) => ( 
//           <div key={index} className="flex gap-10 ">
//             <li
//               onClick={() => handleClick(index)}
//               className={`cursor-pointer text-white text-center rounded-xl p-4 text-xs ${selected === index ? 'outline outline-1 outline-red-400 p-4' : ''}`}

//             >
//               {item}
//             </li>
           
//           </div>
//         ))}
//       </ul>
//     </div>
//   )
// }
