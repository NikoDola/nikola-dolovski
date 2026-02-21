"use client";
import "./ContactForm.css";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setLoading(true);
    setStatusMessage(null);
    setStatusType(null);

    emailjs
      .sendForm(
        "service_75xc7kn",
        "template_5zdgufx",
        form.current!,
        { publicKey: "Qki0lVqKeYPFzsg1j" }
      )
      .then(() => {
        console.log("Message sent to Nikola!");
        return emailjs.sendForm(
          "service_75xc7kn",
          "template_k88s0mm",
          form.current!,
          { publicKey: "Qki0lVqKeYPFzsg1j" }
        );
      })
      .then(() => {
        console.log("Auto-reply sent to sender!");
        setStatusMessage("✅ Message sent successfully!");
        setStatusType("success");
        form.current?.reset();
      })
      .catch((error) => {
        console.log("FAILED...", error);
        setStatusMessage("❌ Failed to send message. Please try again later.");
        setStatusType("error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section className="ctfWrapper">
      <div className="ctfTextWrapper">
        <h1 className="ctfHeadline">HAVE A <br /> PROJECT  IN MIND<span className="questionmark">?</span></h1>
        <h5 className="ctfBody">
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

        <button
          className="ctfButton"
          type="submit"
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>

        {statusMessage && (
          <p
            style={{
              marginTop: "10px",
              color: statusType === "success" ? "green" : "red",
              fontWeight: 500,
            }}
          >
            {statusMessage}
          </p>
        )}
      </form>
    </section>
  );
}
