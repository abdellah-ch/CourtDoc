import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idFiliere = searchParams.get('idFiliere')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const decisionStart = searchParams.get('decisionStart')
  const decisionEnd = searchParams.get('decisionEnd')

  if (!idFiliere) {
    return NextResponse.json({ error: 'idFiliere is required' }, { status: 400 })
  }

  try {
    const where: any = {
      IdFiliere: parseInt(idFiliere),
      Statut: 'غير منجز',
      // IsDeleted: false,
      // Etude: {
      //   some: {
      //     DateDecision: { not: null } // Only include messageries with at least one etude that has DateDecision
      //   }
      // }
    }

    // Filter by AddedDate (registration date)
    if (startDate && endDate) {
      where.AddedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Filter by DateDecision (action date)
    if (decisionStart || decisionEnd) {
      where.Etude.some.DateDecision = {
        ...where.Etude.some.DateDecision, // Keep the not: null condition
        ...(decisionStart && { gte: new Date(decisionStart) }),
        ...(decisionEnd && { lte: new Date(decisionEnd) })
      }
    }

    const messageries = await prisma.messageries.findMany({
      where,
      include: {
        Etude: {
          where: {
            DateDecision: { not: null } // Only include etudes with DateDecision
          },
          orderBy: { DateDecision: 'desc' },
          take: 1,
          include: {
            ProsecutorResponsables: true,
            Sources: true
          }
        }
      },
      orderBy: { AddedDate: 'desc' }
    })

    // Filter out any messageries that ended up with no etudes after the where clause
    // const filteredMessageries = messageries.filter(m => m.Etude.length > 0)

    return NextResponse.json(messageries)
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}