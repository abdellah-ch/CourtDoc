import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/generated/prisma/client';
const prisma = new PrismaClient()
export async function GET(
    request: NextRequest,
    { params }: any
) {
    const { searchParams } = new URL(request.url);
    const numero = searchParams.get("numero");
    const { id } = await params

    const idFiliere = Number(id);

    // Validate input
    if (!numero) {
        return NextResponse.json(
            { error: "رقم الرد مطلوب" },
            { status: 400 }
        );
    }

    if (isNaN(idFiliere)) {
        return NextResponse.json(
            { error: "معرف السلسلة غير صالح" },
            { status: 400 }
        );
    }

    try {
        const response = await prisma.reponses.findFirst({
            where: {
                NumeroReponse: numero,
                Messageries: {
                    IdFiliere: idFiliere,
                },
            },
            include: {
                Messageries: {
                    select: {
                        NumeroOrdre: true,
                        Sujet: true,
                        DateMessage: true,
                    },
                },
            },
        });

        if (!response) {
            return NextResponse.json(
                { error: "لم يتم العثور على الرد في هذه السلسلة" },
                { status: 404 }
            );
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching response:", error);
        return NextResponse.json(
            { error: "خطأ في الخادم الداخلي" },
            { status: 500 }
        );
    }
}