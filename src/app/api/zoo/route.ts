export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

const ZOO_API_URL = 'https://api.zoo.dev/v1/design';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!process.env.ZOO_API_KEY) {
      // Mock response
      return NextResponse.json({
        ok: true,
        mock: true,
        previewUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
        stepUrl: '/mock/cad/enclosure-small.step',
        meta: { source: 'mock' }
      });
    }

    const res = await fetch(ZOO_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${process.env.ZOO_API_KEY}` 
      },
      body: JSON.stringify({ 
        prompt, 
        format: 'STEP', 
        params: { 
          units: 'mm', 
          maxDimensions: [200, 200, 200] 
        } 
      })
    });

    if (!res.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: `Zoo API error: ${res.status}` 
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ 
      ok: true, 
      ...data 
    });
  } catch (error: any) {
    console.error('Zoo API Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: String(error?.message || error) 
    }, { status: 500 });
  }
}