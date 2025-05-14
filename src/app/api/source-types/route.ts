import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()
export async function GET() {
    try {
        const types = await prisma.typeSource.findMany({
        })
        return NextResponse.json(types)
    } catch (error) {
        console.error('Error fetching source types:', error)
        return NextResponse.json(
            { error: 'Failed to fetch source types' },
            { status: 500 }
        )
    }
}