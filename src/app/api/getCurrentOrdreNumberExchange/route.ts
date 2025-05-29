// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const counter = await prisma.exchangePrintCounters.findFirst();

        if (!counter) {
            return NextResponse.json({ error: 'Counter not found' });
        }

        return NextResponse.json(counter);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: error },
            { status: 500 },
        )
    }
}


export async function PUT() {
    try {

        const current = await prisma.exchangePrintCounters.findFirst();

        if (!current) {
            return NextResponse.json({ error: 'Counter not found' });
        }

        // Update the counter
        const updated = await prisma.exchangePrintCounters.update({
            where: { Id: current.Id },
            data: { OrdreExchangePrintCounter: current.OrdreExchangePrintCounter + 1 },
        });

        return NextResponse.json(updated);
    }

     catch (error) {
    console.log(error);

    return NextResponse.json(
        { error: error },
        { status: 500 },
    )
}
  }