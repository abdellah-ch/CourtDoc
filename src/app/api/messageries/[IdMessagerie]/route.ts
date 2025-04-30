import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { sources } from "next/dist/compiled/webpack/webpack";

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
            ProsecutorResponsables: true,
            Sources: true,
            TypeMessageries: true,
            Filieres: true,
            Etude: true,
            Reponses: {
                include:{
                    Sources:true
                } 
            },
            Resultats: true,
        },
    });


    return NextResponse.json(messagerie)
}