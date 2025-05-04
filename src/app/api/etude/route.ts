import { NextResponse } from 'next/server';
import {PrismaClient} from '@/generated/prisma/client';

const prisma = new PrismaClient()
// Create new study record
export async function POST(request: Request) {
  try {
    const { IdMessagerie, DateEtude, Etude } = await request.json();
    
    const newEtude = await prisma.etude.create({
      data: {
        IdMessagerie,
        DateEtude: new Date(DateEtude),
        Etude,
      },
      include: {
        Messageries: true
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

// Update study record
