"use client";
import "./ContactForm.css";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    // ✅ form.current is guaranteed not null here
    emailjs
      .sendForm(
        "service_75xc7kn",
        "template_5zdgufx",
        form.current!, // <-- non-null assertion fixes TypeScript error
        { publicKey: "Qki0lVqKeYPFzsg1j" }
      )
      .then(() => {
        console.log("Message sent to Nikola!");

        return emailjs.sendForm(
          "service_75xc7kn",
          "template_k88s0mm",
          form.current!, // <-- same fix here
          { publicKey: "Qki0lVqKeYPFzsg1j" }
        );
      })
      .then(() => {
        console.log("Auto-reply sent to sender!");
      })
      .catch((error) => {
        console.log("FAILED...", error);
      });
  };

  return (
    <section className="ctfWrapper">
      <div className="ctfTextWrapper">
        <h2>Have a project in mind?</h2>
        <h5>
          I&apos;d love to hear from you! <br />
          Drop a message, and let&apos;s make something amazing together!
        </h5>
      </div>

      <form className="ctfInputWrapper" ref={form} onSubmit={sendEmail}>
        <div className="ctfNameLastnameWrapper">
          <input
            className="ctfInput"
            name="to_name"
            placeholder="Your Name"
            required
          />
          <input
            className="ctfInput"
            name="to_email"
            type="email"
            placeholder="Your Email"
            required
          />
        </div>

        <textarea
          className="ctfTextarea"
          name="message"
          placeholder="Your Message"
          required
        />
        <button className="ctfButton">Send</button>
      </form>
    </section>
  );
}
