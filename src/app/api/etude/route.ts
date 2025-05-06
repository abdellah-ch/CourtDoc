import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

// Create new study record
export async function POST(request: Request) {
  try {
    const { IdMessagerie, DateEtude, IdProsecutor } = await request.json();

    const newEtude = await prisma.etude.create({
      data: {
        IdMessagerie,
        DateEtude: new Date(DateEtude),
        Etude: true, // Always true when creating new study
        IdProsecutor: IdProsecutor ? Number(IdProsecutor) : null
      },
      include: {
        Messageries: true,
        ProsecutorResponsables: true
      }
    });

    return NextResponse.json(newEtude);
  } catch (error) {
    console.error('Error creating study record:', error);
    return NextResponse.json(
      { error: 'Failed to create study record' },
      { status: 500 }
    );
  }
}