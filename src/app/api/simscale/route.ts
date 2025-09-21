export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { projectId, simulationId } = await req.json();
    
    if (!process.env.SIMSCALE_API_KEY) {
      // Mock response
      return NextResponse.json({
        ok: true,
        mock: true,
        status: 'completed',
        keyMetrics: { 
          maxStress: 42.1, 
          strain: 0.0031, 
          maxTempC: 61.4,
          safetyFactor: 2.3
        },
        previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
      });
    }

    const url = `https://api.simscale.com/v0/projects/${projectId}/simulations/${simulationId}/results`;
    const res = await fetch(url, { 
      headers: { 
        Authorization: `Bearer ${process.env.SIMSCALE_API_KEY}`, 
        'Content-Type': 'application/json' 
      }
    });

    if (!res.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: `SimScale API error: ${res.status}` 
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ 
      ok: true, 
      ...data 
    });
  } catch (error: any) {
    console.error('SimScale API Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: String(error?.message || error) 
    }, { status: 500 });
  }
}