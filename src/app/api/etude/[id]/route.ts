import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: any
) {
  try {
    const { DateRetour, decision, DateDecision,IdSource } = await request.json();
    const {id} = await params
    const updatedEtude = await prisma.etude.update({
      where: { IdEtude: Number(id) },
      data: {
        DateRetour: DateRetour ? new Date(DateRetour) : null,
        DateDecision: DateDecision ? new Date(DateDecision) : null,
        Etude: false, // Always false when returning
        decision,
        IdSource: IdSource ? Number(IdSource) : null
      },
      include: {
        Messageries: true,
        ProsecutorResponsables: true
      }
    });

    return NextResponse.json(updatedEtude);
  } catch (error) {
    console.error('Error updating study record:', error);
    return NextResponse.json(
      { error: 'Failed to update study record' },
      { status: 500 }
    );
  }
}