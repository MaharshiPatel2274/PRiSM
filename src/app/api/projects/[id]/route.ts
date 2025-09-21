export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const project = await db.project.findUnique({ 
      where: { id: params.id } 
    });
    
    if (!project) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      ok: true, 
      project 
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch project' 
    }, { status: 500 });
  }
}