import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient()

export async function POST(req: NextRequest, { params }: { params: Promise<{ IdMessagerie: string }> }) {


    const {IdMessagerie} = await params;
    const id = Number(IdMessagerie)
    const data = await req.json();

    console.log(data);

    try {
        if (data.source === '') {
            const response = await prisma.reponses.create({
                data: {
                    DateReponse: new Date(data.date),
                    Contenu: data.content,
                    IdMessagerie: id,
                    AutreLibelleSource: data.otherSource,

                }
            })

            return NextResponse.json(response)
        } else {
            const response = await prisma.reponses.create({
                data: {
                    DateReponse: new Date(data.date),
                    Contenu: data.content,
                    IdMessagerie: id,
                    IdSource: Number(data.source),

                }
            })

            return NextResponse.json(response)
        }
    } catch (error) {
        return NextResponse.json(error)
    }


    //create the reponse bases on source 
}