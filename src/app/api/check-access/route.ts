// src/app/api/check-access/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const { userId, filiereId } = await req.json();

    try {
        // Check direct filiere access
        const directAccess = await prisma.utilisateurFiliere.findFirst({
            where: {
                IdUtilisateur: userId,
                IdFiliere: filiereId,
            },
        });

        if (directAccess) {
            return NextResponse.json({ hasAccess: true });
        }

        // Check group filiere access
        const groupAccess = await prisma.utilisateurGroupeFilieres.findFirst({
            where: {
                IdUtilisateur: userId,
                GroupeFilieres: {
                    Filieres: {
                        some: {
                            IdFiliere: filiereId,
                        },
                    },
                },
            },
        });

        return NextResponse.json({ hasAccess: !!groupAccess });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to check access' },
            { status: 500 }
        );
    }
}