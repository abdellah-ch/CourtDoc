import { NextResponse } from 'next/server'

import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const typeId = searchParams.get('typeId')

    try {
        const sources = await prisma.sources.findMany({
            where: {
                ...(typeId && { IdTypeSource: parseInt(typeId) })
            },
            include: {
                TypeSource: true
            }
        })

        return NextResponse.json(sources)
    } catch (error) {
        console.error('Error fetching sources:', error)
        return NextResponse.json(
            { error: 'Failed to fetch sources' },
            { status: 500 }
        )
    }
}