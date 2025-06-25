"use client";
import Link from "next/link";
import "./Logo.css";
import { useState } from "react";
import { chatSave, chatUpdate } from "@/lib/actions/chatSave"; // adjust path

type Message = {
  role: "user" | "assistant";
  content: string;
};

type LogoProps = {
  size?: string;
  link?: string;
  chat?: boolean;
  loadingState?: boolean;
};

export default function Logo({
  size = "0",
  link = "./",
  chat = false,
  loadingState = false,
}: LogoProps) {
  const [history, setHistory] = useState<Message[]>([]);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);

  const handleUserChat = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    const newUserMessage: Message = { role: "user", content: userInput };
    const newHistory: Message[] = [...history, newUserMessage];

    try {
      // Optional: Get user IP from your API route
      const ipRes = await fetch("/api/get-ip");
      const { ip } = await ipRes.json();

      // Send chat history to your GPT API
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }),
      });

      if (res.status === 429) {
        setAiReply("You've hit the daily limit...");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply?.content || "No reply";
      const newAssistantMessage: Message = { role: "assistant", content: reply };

      // Update local chat history state
      setHistory([...newHistory, newAssistantMessage]);
      setAiReply(reply);
      setUserInput("");

      // Save or update chat in Firestore including IP address
      if (!chatId) {
        const newId = await chatSave([newUserMessage, newAssistantMessage], ip);
        setChatId(newId);
      } else {
        await chatUpdate(chatId, [newUserMessage, newAssistantMessage], ip);
      }
    } catch (error) {
      setAiReply("Oops, something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logoItemsWrapper">
      <Link className="linkInputWrapper" href={link}>
        <div style={{ width: size, height: size }} className="logoWrapper">
          <div className="hair"></div>
          <div className="glasses">
            <div
              className={`glassessMask ${
                loading || loadingState ? "loading" : ""
              }`}
            ></div>
          </div>
          <div className="beard"></div>
          <div className="lips"></div>
        </div>
      </Link>

      {chat && (
        <>
          <div className="chatWrapper"></div>
          <div className="humanAiChatWrapper">
            {aiReply ? (
              <p className="aiReply">{aiReply}</p>
            ) : (
              <p className="aiReply">Hey there! What&apos;s up</p>
            )}

            <div className="logoFormWrapper">
              <input
                type="text"
                className="input humanChat"
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
