import { NextResponse } from 'next/server';
import {PrismaClient} from '@/generated/prisma/client';

const prisma = new PrismaClient()


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  

  try {
    const { DateRetour, Etude } = await request.json();
    
    const updatedEtude = await prisma.etude.update({
      where: { IdEtude: Number(params.id) },
      data: {
        DateRetour: DateRetour ? new Date(DateRetour) : null,
        Etude,
      },
      include: {
        Messageries: true
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