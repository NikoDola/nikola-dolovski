"use client";
import "./ContactForm.css";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

export default function ContactForm() {
  const form = useRef<HTMLFormElement | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    emailjs
      .sendForm(
        "service_75xc7kn", // replace with your service ID
        "template_5zdgufx", // replace with your template ID
        form.current,
        {
          publicKey: "Qki0lVqKeYPFzsg1j",
        }
      )
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };
  return (
    <>
      {" "}
      <section className="ctfWrapper">
        <div className="ctfTextWrapper">
          <h2>Have a project in mind?</h2>
          <h5>
            {" "}
            I&apos;d love to hear from you! <br />
            Drop a message, and let&apos;s make something amazing together!
          </h5>
        </div>
        <form className="ctfInputWrapper" ref={form} onSubmit={sendEmail}>
          <div className="ctfNameLastnameWrapper">
            <input className="ctfInput" name="name" placeholder="Your Name" />
            <input className="ctfInput" name="name" placeholder="Your Email" />
          </div>

          <textarea className="ctfTextarea" name="message" placeholder="Your Message" />
          <button className="ctfButton">Send</button>
        </form>
      </section>
    </>
  );
}

// <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
// <script type="text/javascript">
//     (function() {
//         // https://dashboard.emailjs.com/admin/account
//         emailjs.init({
//           publicKey: "YOUR_PUBLIC_KEY",
//         });
//     })();
// </script>
// <script type="text/javascript">
//     window.onload = function() {
//         document.getElementById('contact-form').addEventListener('submit', function(event) {
//             event.preventDefault();
//             // these IDs from the previous steps
//             emailjs.sendForm('contact_service', 'contact_form', this)
//                 .then(() => {
//                     console.log('SUCCESS!');
//                 }, (error) => {
//                     console.log('FAILED...', error);
//                 });
//         });
//     }
// </script>
