"use client";
import Link from "next/link";
import "./Logo.css";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Logo({
  size,
  link,
  chat = false,
}: {
  size: string;
  link: string;
  chat: boolean;
}) {
  const [history, setHistory] = useState<Message[]>([]);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleUserChat = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const newHistory: Message[] = [
      ...history,
      { role: "user", content: userInput },
    ];

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }),
      });

      if (res.status === 429) {
        setAiReply(
          "You've hit the daily limit with this chat. Try again tomorrow or contact nikodola@gmail.com"
        );
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
    <div className="w-full">
      <Link className="linkInputWrapper" href={link}>
        <div style={{ width: size, height: size }} className="logoWrapper">
          <div className="hair"></div>
          <div className="glasses">
            <div className={`glassessMask ${loading ? "loading" : ""}`}></div>
          </div>
          <div className="beard"></div>
          <div className="lips"></div>
        </div>
      </Link>

      {chat && (
        <>
          <div className="chatWrapper">

          </div>
          <div className="humanAiChatWrapper">
            {aiReply ? (
              <p className="aiReply">{aiReply}</p>
            ) : (
              <p className="aiReply">Hey there! What&apos;s up</p>
            )}

            <div className="logoFormWrapper">
              <input
                type="text"
                className="input humanInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && handleUserChat()}
              />
              <button
                className="button humanSendButton"
                onClick={handleUserChat}
                disabled={loading}
              >
                {loading ? "Sending..." : "⏎"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
