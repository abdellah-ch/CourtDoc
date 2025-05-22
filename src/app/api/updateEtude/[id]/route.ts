import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient()

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params;
        const body = await req.json();

        const updatedEtude = await prisma.etude.update({
            where: { IdEtude: parseInt(id) },
            data: {
                DateEtude: body.DateEtude ? new Date(body.DateEtude) : undefined,
                DateRetour: body.DateRetour ? new Date(body.DateRetour) : undefined,
                DateDecision: body.DateDecision ? new Date(body.DateDecision) : undefined,
                decision: body.decision,
                IdProsecutor: body.IdProsecutor ? parseInt(body.IdProsecutor) : undefined,
                IdSource: body.IdSource ? parseInt(body.IdSource) : undefined
            }
        });

        return NextResponse.json(updatedEtude);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

}
