import "./Proposal.css"
export default function Proposals() {
  return (
    <main className="offersWrapper">

      {/* Core Brand Identity */}
      <section className="section-regular offerWrapper">
        <h2>Core Brand Identity</h2>
         <ul className="servicesWrapper">
          <li>1. Color Palette Design</li>
          <li>2. Typography</li>
          <li>3. Carning the text (font)</li>
          <li>4. Grid & Layout System</li>
          <li>5. Logo Clear Space Rules</li>
          <li>6. Logo variation (horizontal, vertical, badge)</li>
          <li>7. Creating Aspect Ratio for the logo versions</li>
          <li>8. Minimum Logo Size</li>
          <li>9. Clear Space</li>
          <li>10. Brand Colors</li>
          <li>11. Iconography</li>
          <li>12. "How Not To" usage guide</li>
        </ul>
      </section>

      {/* Logo Assets & Interactions */}
      <section className="section-regular offerWrapper">
        <h2>Logo Assets & Interactions</h2>
          <ul className="servicesWrapper">
          <li>1. Saving the logo in multiple colors (light, dark, mono, etc.)</li>
          <li>2. 3D mockups for better visual presentation</li>
          <li>3. logo animation</li>
          <li>4. JavaScript hover animation for the logo (home button)</li>
        </ul>
      </section>

      {/* Visual Assets & Patterns */}
      <section className="section-regular offerWrapper">
        <h2>Visual Assets & Patterns</h2>
          <ul className="servicesWrapper">
          <li>1. Creating a brand pattern</li>
          <li>2. App Icon Design</li>
          <li>3. App Icons (merged with above)</li>
          <li>4. Creative Stickers</li>
          <li>5. Custom QR Code Design</li>
        </ul>
      </section>

      {/* Digital & Print Material */}
      <section className="section-regular offerWrapper">
        <h2>Digital & Print Material</h2>
        <ul className="servicesWrapper">
          <li>1. Stationery Design</li>
          <li>2. Package Design (if needed)</li>
          <li>3. Print Mini Branding</li>
        </ul>
      </section>

      {/* Online & Social Presence */}
      <section className="section-regular offerWrapper">
        <h2>Online & Social Presence</h2>
        
        <ul className="servicesWrapper">
          <li>1. Creating banners (cover pages) for Facebook, LinkedIn, etc.</li>
          <li>2. Hotel Portal White-label Branding</li>
          <li>3. Brand Reel</li>
        </ul>
      </section>

      {/* Email & Web Assets */}
      <section className="section-regular offerWrapper">
        <h2>Email & Web Assets</h2>
        <ul className="servicesWrapper">
          <li>1. Creating an Email Signature</li>
          <li>2. Custom Email Templates (Responsive HTML)</li>
          <li>3. Email Icon Set</li>
          <li>4. Transactional Email Styling</li>
          <li>5. Newsletter Layout Design</li>
          <li>6. HTML/CSS Branding Documentation Page</li>
          <li>7. Loading Animation</li>
        </ul>
      </section>

    </main>
  )
}


// import "./Proposal.css"
// import Image from "next/image"
// export default function Daze(){
//   return(
//     <main>
//       <section className="section1 servicesWrapper section-regular">
//         <div className="text">
//           <h2>Adjust the colors for print and digital use</h2>
//           <p>
//             By adjusting the brand colors better, we’ll have more flexibility 
//             to play with contrast across different backgrounds, ensuring visibility, 
//             consistency, and aesthetic balance in all applications. This also includes 
//             finding the phantom {`(supporting)`} colors for both digital and print use
//             to maintain harmony and adaptability across mediums.
//           </p>
//         </div>
//         <Image className="servicesImage" src={'/proposals/daze/phanton.webp'} quality={100} width={200} height={200} alt="phanton colors"/>
//       </section>

//             <section className="section1 servicesWrapper section-regular">
//         <div className="text">
//           <h2>Color Palette Designx</h2>
//           <p>
//             By adjusting the brand colors better, we’ll have more flexibility 
//             to play with contrast across different backgrounds, ensuring visibility, 
//             consistency, and aesthetic balance in all applications. This also includes 
//             finding the phantom {`(supporting)`} colors for both digital and print use
//             to maintain harmony and adaptability across mediums.
//           </p>
//         </div>
//         <Image className="servicesImage" src={'/proposals/daze/phanton.webp'} quality={100} width={200} height={200} alt="phanton colors"/>
//       </section>

//     </main>
//   )
// }