"use client";

import { useEffect, useState } from "react";

export default function ChatGPT() {
  const [story, setStory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStory() {
      try {
        const res = await fetch("/api/gpt");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setStory(data.story);
      } catch (err) {
        console.error("Error fetching story:", err);
      }
    }

    fetchStory();
  }, []);

  return (
    <div>
      {story ? <p>{story}</p> : <p>Loading bedtime story...</p>}
    </div>
  );
}
