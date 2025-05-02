import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: Promise<{ IdReponse: string }> }) {

    const { IdReponse } = await params;
    const id = Number(IdReponse)

    try {
        const item = await prisma.reponses.update({
            where: { IdReponse:id },
            data: { IsDeleted: true },
        });

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(error)
    }
}