import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function PATCH(
    request: Request,
    { params }: any
) {
    const { id } = await params;
    const { statut } = await request.json();

    try {
        const updatedMessagerie = await prisma.messageries.update({
            where: { IdMessagerie: parseInt(id) },
            data: { Statut: statut },
        });

        return NextResponse.json(updatedMessagerie);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update Messagerie status' },
            { status: 500 }
        );
    }
}