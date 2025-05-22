import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: any) {
    const {id} = await params
    try {
        await prisma.etude.delete({
            where: { IdEtude: parseInt(id) }
        })
        return NextResponse.json({ success: true })
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}