import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.STABILITY_API_KEY!;
const engineId = "stable-diffusion-xl-1024-v1-0";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await axios.post(
      `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const imageBase64 = response.data.artifacts[0].base64;
    return NextResponse.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
