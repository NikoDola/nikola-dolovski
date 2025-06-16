"use client";
import Link from "next/link";
import "./Logo.css";
import { useState} from "react";

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
    "Ok you are being annoying.",
       "Be patient...",
    "Please stop.",
    "Please stop!!",
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

  const handleClick = () => {
    if (answer) return; // if user already said yes, ignore clicks here

    const nextCount = counter + 1;
    setCounter(nextCount);

    if (nextCount >= staticMessages.length + 5) {
      window.location.href = "https://www.youtube.com/watch?v=5Y-HoOFMlpI";
    }
  };
  
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
        setAiReply("You've hit the daily limit with this chat. Try again tomorrow. Or contact nikodola@gmail.com throw email");
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
      {playText && !answer ? (
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
      ):   <div className="aiChat">
      {aiReply && 
        <div>
          <p>{aiReply}</p>
        
      </div> }
    </div>}
            {counter === 5 && !answer && (
        <div className="mt-4 w-full">
          <p className="button mt-4 text-center" onClick={() => setAnswer(true)}>Yes I would like.</p>
          <p className="button mt-4 text-center" onClick={() => setAnswer(false)}>No I just wanna annoy you.</p>
        </div>
      )}

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
          <button  onClick={()=> setAnswer(false)} className="button ml-4">X</button>
        </div>
        
      )}
    </Link>

   
    </div>
    
  );
}
