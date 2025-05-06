import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: any
) {
  try {
    const { DateRetour, decision } = await request.json();

    const updatedEtude = await prisma.etude.update({
      where: { IdEtude: Number(params.id) },
      data: {
        DateRetour: DateRetour ? new Date(DateRetour) : null,
        Etude: false, // Always false when returning
        decision
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