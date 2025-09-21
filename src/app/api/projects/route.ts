export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'name required' }, { status: 400 });
    }

    const project = await db.project.create({ 
      data: { name: name.trim() } 
    });
    
    return NextResponse.json({ 
      ok: true, 
      id: project.id, 
      name: project.name 
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create project' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    
    return NextResponse.json({ 
      ok: true, 
      projects 
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch projects' 
    }, { status: 500 });
  }
}