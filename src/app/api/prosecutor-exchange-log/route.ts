// pages/api/prosecutor-exchange-log.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const idFiliere = searchParams.get('idFiliere')
    const prosecutorId = searchParams.get('prosecutorId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    try {
        const messageries = await prisma.messageries.findMany({
            where: {
                IdFiliere: Number(idFiliere), // Include IdFiliere filter
                Etude: {
                    some: {
                        IdProsecutor: Number(prosecutorId),
                        DateEtude: {
                            gte: new Date(startDate || ""),
                            lte: new Date(endDate || "")
                        }
                    }
                }
            },
            include: {
                Etude: {
                    where: {
                        IdProsecutor: Number(prosecutorId),
                        DateEtude: {
                            gte: new Date(startDate || ""),
                            lte: new Date(endDate || "")
                        }
                    },
                    include: {
                        ProsecutorResponsables: true
                    }
                }
            },
            orderBy: {
                NumeroOrdre: 'asc'
            }
        })

        return NextResponse.json(messageries)
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        )
    }
}