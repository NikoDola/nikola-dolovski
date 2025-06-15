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
  const [vpn, setVpn] = useState(false)
  const staticMessages = [
    "...",
    "Comming Soon",
    "The website will be awesome",
    "Website will Clean and Simple",
    "I will be showcasing my portfolio, reviews nothing to fancy",
    "Would you like to know more about me ?",
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

const handleVpnCheck = async () => {
  try {
    const clientTime = new Date().toISOString();
    const os = navigator.platform || "unknown";

    const res = await fetch(`/api/vpn?time=${encodeURIComponent(clientTime)}&os=${encodeURIComponent(os)}`);
    const data = await res.json() ;
    console.log("VPN Check Result:", data);
    if (data?.score <4){
      setVpn(true)
    }
  } catch (error) {
    console.error("Error checking VPN:", error);
  }
};


handleVpnCheck()
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
      if (res.status === 429) {
        setAiReply("You've hit the daily limit. Try again tomorrow.");
        setLoading(false);
        return;
      }

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
    <div>

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
            {counter === 5 && !answer && (
        <div className="flex gap-4">
          <p className="button" onClick={() => setAnswer(true)}>Yes I would like.</p>
          <p className="button" onClick={() => setAnswer(false)}>No I just wanna annoy you.</p>
        </div>
      )}

      {/* After user clicks "Yes I would like" */}
      {playText && answer && (
        <div className="logoFormWrapper">
          <input
            type="text"
            className="input aiInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
          />
          <button
            className="button"
            onClick={handleUserChat}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        
        </div>
      )}
    </Link>
  { answer && !vpn &&<div className="aiChat">
      {aiReply && <p>{aiReply}</p>}
    </div>}
   
    </div>
    
  );
}
