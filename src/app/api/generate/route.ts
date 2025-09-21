export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DUMMY_CAD, DUMMY_CIRCUITS } from '@/server/mock/assets';
import { pickCad, pickCkt } from '@/server/mock/pick';
import { generateRiskAnalysis, generateTestingMethods, generateUserManual } from '@/server/ai/openai';

export async function POST(req: Request) {
  try {
    const { projectId, prompt } = await req.json();
    
    if (!projectId || !prompt) {
      return NextResponse.json({ 
        ok: false, 
        error: 'projectId & prompt required' 
      }, { status: 400 });
    }

    // Pick dummy assets
    const cad = DUMMY_CAD[pickCad()];
    const circuit = DUMMY_CIRCUITS[pickCkt()];

    // Generate AI content
    const [risks, testing, userManual] = await Promise.all([
      generateRiskAnalysis(prompt),
      generateTestingMethods(prompt),
      generateUserManual(prompt)
    ]);

    // Update project with generated data
    await db.project.update({
      where: { id: projectId },
      data: {
        specJson: { 
          cad, 
          circuit, 
          risks: risks.risks || [],
          testing: testing.testing || [],
          userManual: userManual.sections || [],
          prompt 
        },
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      ok: true, 
      cad, 
      circuit,
      risks: risks.risks || [],
      testing: testing.testing || [],
      userManual: userManual.sections || []
    });
  } catch (error: any) {
    console.error('Generate Error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: String(error?.message || error) 
    }, { status: 500 });
  }
}