import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: Promise<{ IdMessagerie: string }> }) {

    const { IdMessagerie } = await params;
    const id = Number(IdMessagerie)

    try {
        const item = await prisma.messageries.update({
            where: { IdMessagerie: id },
            data: { IsDeleted: true },
        });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json(error)
    }
}