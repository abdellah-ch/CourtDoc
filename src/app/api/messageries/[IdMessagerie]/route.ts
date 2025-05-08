import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient()


export async function GET(req: NextRequest, { params }: { params: Promise<{ IdMessagerie: string }> }) {
    const { IdMessagerie } = await params

    // console.log("ghoiheihoihodhfioezhifhzeoihfiezh",idMessagerie);
    const messagerie = await prisma.messageries.findUnique({
        where: {
            IdMessagerie: Number(IdMessagerie) // replace with the actual ID
        },
        include: {
            CodeFilieres: true,
            Sources: true,
            Sources_Messageries_IdSourceDestinationToSources:true,
            TypeMessageries: true,
            Filieres: true,
            Etude: {
                include: {
                    ProsecutorResponsables: true
                }
            },
            Reponses: {
                include: {
                    Sources: true
                }
            },
        },
    });


    return NextResponse.json(messagerie)
}