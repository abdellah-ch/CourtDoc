import { PrismaClient } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const { IdUtilisateur } = req;
        const id = parseInt(IdUtilisateur)
        const data = await prisma.utilisateurs.findUnique({
            where: { IdUtilisateur: id },
            include: {
                UtilisateurGroupeFilieres: {
                    include: {
                        GroupeFilieres: {
                            include: {
                                Filieres: true
                            }
                        }
                    }
                },
            },
        })

        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        // console.error('Prisma error:', error);

        return new NextResponse(JSON.stringify(error), { status: 400 })
    }
}