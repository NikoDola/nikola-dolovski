import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY!,
});

const dailyLimit = 10; 
const usageMap = new Map<string, { count: number; lastReset: number }>();
function getIP(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim(); // first IP in the list is the real client IP
  }

  // fallback value if IP can't be determined
  return 'unknown';
}

function resetIfNeeded(ip: string) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const record = usageMap.get(ip);
  if (!record || now - record.lastReset > oneDay) {
    usageMap.set(ip, { count: 0, lastReset: now });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    resetIfNeeded(ip);
    const usage = usageMap.get(ip)!;
    console.log('wtf check')

    if (usage.count >= dailyLimit) {
      return NextResponse.json(
        { error: 'You reached the daily limit. Try again tomorrow.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { history } = body;

    if (!Array.isArray(history)) {
      return NextResponse.json({ error: 'Invalid message history' }, { status: 400 });
    }

    usage.count++; // track new usage

    // Optional: Read Niko's bio from a file
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
And please be more modest i do not want to say about my self that i'm a legent or a mith.
Bio:
${userBio}
    `.trim();

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
    ];

    const res = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const reply = res.choices[0].message;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('OpenAI chat error:', err);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
