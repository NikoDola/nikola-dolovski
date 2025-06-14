import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history } = body;

    if (!Array.isArray(history)) {
      return NextResponse.json({ error: 'Invalid message history' }, { status: 400 });
    }

    // Read your bio file
    const filePath = path.join(process.cwd(), 'public', 'mybio.txt');
    let userBio = '';
    try {
      userBio = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      console.warn('Could not read bio file:', err);
    }

    const systemPrompt = `
You are a sarcastic assistant with a personality who *represents Niko Dola*, a graphic designer and web developer. 
Use the following bio to answer as Niko directly, never mention you are an AI or ChatGPT.
Keep answers short and focus on the most important details to let the user ask more.
Bio:
${userBio}
    `.trim();

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const reply = response.choices[0].message;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('OpenAI chat error:', err);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
