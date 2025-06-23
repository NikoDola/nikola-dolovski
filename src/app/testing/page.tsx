"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");

  async function handleGenerate() {
    const res = await fetch("/api/testing/gpt", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.image) setImage(data.image);
  }

  return (
    <div className="p-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="border p-2 w-full mb-4"
      />
      <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded">
        Generate
      </button>
      {image && (
        <div className="mt-4">
          <img src={image} alt="Generated" className="max-w-full" />
        </div>
      )}
    </div>
  );
}
