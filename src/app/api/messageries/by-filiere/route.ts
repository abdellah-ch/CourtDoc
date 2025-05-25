// pages/api/messageries/by-filiere.ts
import { PrismaClient } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const idFiliereParam = searchParams.get('idFiliere');
    const idFiliere = idFiliereParam ? parseInt(idFiliereParam) : NaN;

    if (isNaN(idFiliere)) {
        return NextResponse.json({ message: "Invalid idFiliere" }, { status: 400 });
    }

    try {
        const messageries = await prisma.messageries.findMany({
            where: {
                IdFiliere: idFiliere,
                // IsDeleted: false
            },

            include: {
                TypeMessageries: {
                    select: {
                        Libelle: true
                    }
                },
                Reponses: true,
                Etude :{
                    select:{
                        ProsecutorResponsables : true
                    }
                },
                Sources: {
                    select: {
                        NomSource: true
                    }
                },
                Filieres: {
                    select: {
                        Libelle: true
                    }
                },
                CodeFilieres: {
                    select: {
                        Valeur: true
                    }
                }
            },

        });
        messageries.sort((a: any, b: any) => parseInt(b.NumeroOrdre) - parseInt(a.NumeroOrdre));

        return NextResponse.json(messageries);
    } catch (error) {
        console.error("Error fetching messageries:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}