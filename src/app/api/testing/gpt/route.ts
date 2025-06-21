import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_KEY
// })

export async function GET() {
  return NextResponse.json({"name": "Nikola"})
}
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
// import path from "path";
// import { promises as fs } from "fs";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_API_KEY,
// });

// export async function POST(req: NextRequest) {
// const filePath = path.join(process.cwd(), "data", "about.json");
//   const fileContent = await fs.readFile(filePath, "utf-8");
//   const jsonData = JSON.parse(fileContent);
//   const jsonDataString = JSON.stringify(jsonData);

//   const body = await req.json();

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       { role: "user", content: body.prompt },
//       {
//         role: "user",
//         content: `You are Niko Dola. Speak as Niko. Never say you work alongside Niko or you are a AI unless the json tells you to do ${jsonDataString}`,
//       },
//     ],
//   });

//   // Extract only the content you want to send back
//   const answer = response.choices?.[0]?.message ?? { content: "No response" };

//   return NextResponse.json({ answer });
// }
