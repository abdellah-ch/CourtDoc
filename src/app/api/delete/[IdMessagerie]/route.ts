import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
    const { IdMessagerie } = await params;
    const id = Number(IdMessagerie);

    try {
        // First delete all related Etude records
        await prisma.etude.deleteMany({
            where: { IdMessagerie: id }
        });

        // Then delete all related Reponses records
        await prisma.reponses.deleteMany({
            where: { IdMessagerie: id }
        });


        // Then reset the Messagerie fields
        const item = await prisma.messageries.update({
            where: { IdMessagerie: id },
            data: {
                IdType: null,
                NumeroMessagerie: null,
                // NumeroOrdre is intentionally left out
                CodeBarre: null,
                CodeReference: null,
                IdSource: null,
                AutreLibelleSource: null,
                // DateArrivee: null,
                // DateMessage: null,
                Sujet: null,
                IdCode: null,
                Resultat: null,
                Statut: null,
                Remarques: null,
                IdDocument: null,
                UpdatedBy: null,
                UpdatedDate: null,
                DeletedBy: null,
                DeletedDate: null,
                prosecutor: null,
                IdSourceDestination: null,
                AutreLibelleDestination: null,
                underSupervision: null,
                participants_courrier: null,
                TypeDocument: null,
                IsDeleted: true,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error resetting messagerie:", error);
        return NextResponse.json(
            { error: "Failed to reset messagerie" },
            { status: 500 }
        );
    }
}