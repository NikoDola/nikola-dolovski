"use client";
import Link from "next/link";
import "./Logo.css";
import { useState } from "react";

export default function Logo({
  size,
  link,
  playText = false,
}: {
  size: string;
  link: string;
  playText: boolean;
}) {
  const staticMessages = [
    "...",
    "Comming Soon",
    "The website will be awesome",
    "Website will Clean and Simple",
    "I will be showcasing my portfolio, reviews nothing to fancy",
    "Would you like to know more about me ?",
    "Sorry I cant tell you more...",
    "Be patient...",
    "Please stop.",
    "Please stop!!",
    "Ok you are being annoying.",
    "I will ignore you!",
    "Ignoring you...",
    "Again, ignoring you...",
    "...",
  ];

  const [counter, setCounter] = useState(0);
  const [history, setHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [userInput, setUserInput] = useState("");

  // Advance static messages on logo click, until user says yes
  const handleClick = () => {
    if (answer) return; // if user already said yes, ignore clicks here

    const nextCount = counter + 1;
    setCounter(nextCount);

    // After static messages end, redirect (or you can change this behavior)
    if (nextCount >= staticMessages.length + 5) {
      window.location.href = "https://www.youtube.com/watch?v=5Y-HoOFMlpI";
    }
  };

  // When user says "Yes I would like", they get chat input box and can talk to AI
  const handleUserChat = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

   const newHistory: { role: "user" | "assistant"; content: string }[] = [...history, { role: "user", content: userInput }];


    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply?.content || "No reply";

      setHistory([...newHistory, { role: "assistant", content: reply }]);
      setAiReply(reply);
      setUserInput("");
    } catch (error) {
      setAiReply("Oops, something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      className="flex flex-col gap-4 items-center justify-end"
      onClick={handleClick}
      href={link}
    >
      <div style={{ width: size, height: size }} className="logoWrapper">
        <div className="hair"></div>
        <div className="glasses">
          <div className="glassessMask"></div>
        </div>
        <div className="beard"></div>
        <div className="lips"></div>
      </div>

      {counter === 5 && !answer && (
        <div className="flex flex-col">
          <p onClick={() => setAnswer(true)}>Yes I would like.</p>
          <p onClick={() => setAnswer(false)}>No I just wanna annoy you.</p>
        </div>
      )}

      {/* Before user clicks "Yes I would like" */}
      {playText && !answer && (
        <>
          {counter < staticMessages.length && (
            <div>{staticMessages[counter]}</div>
          )}
          {counter >= staticMessages.length && (
            <div className="text-sm">
              {loading ? "Thinking..." : aiReply || "Say something again..."}
            </div>
          )}
        </>
      )}

      {/* After user clicks "Yes I would like" */}
      {playText && answer && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <input
            type="text"
            className="border px-2 py-1 text-black"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me something..."
            disabled={loading}
          />
          <button
            className="bg-black text-white px-4 py-1 text-sm"
            onClick={handleUserChat}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
          {aiReply && <p className="mt-2 text-sm">{aiReply}</p>}
        </div>
      )}
    </Link>
  );
}
