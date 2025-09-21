export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { runNlp } from '@/server/ai/openai';

export async function POST(req: Request) {
  try {
    const { projectId, prompt } = await req.json();
    
    if (!projectId || !prompt) {
      return NextResponse.json({ 
        ok: false, 
        error: 'projectId & prompt required' 
      }, { status: 400 });
    }
    
    const text = await runNlp(prompt);
    
    return NextResponse.json({ 
      ok: true, 
      text 
    });
  } catch (error: any) {
    console.error('NLP Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: String(error?.message || error) 
    }, { status: 500 });
  }
}