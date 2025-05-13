import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: any) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  try {
    // Date filter
    const dateFilter = startDate && endDate ? {
      DateArrivee: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {}

    // Basic counts
    const whereClause = {
      IdFiliere: parseInt(id),
      ...dateFilter
    }

    const totalMessages = await prisma.messageries.count({
      where: whereClause
    })

    const completedMessages = await prisma.messageries.count({
      where: {
        ...whereClause,
        Statut: 'منجز'
      }
    })

    const pendingMessages = await prisma.messageries.count({
      where: {
        ...whereClause,
        Statut: 'غير منجز'
      }
    })

    // Prosecutor statistics (updated to count unique messages)
    const prosecutors = await prisma.prosecutorResponsables.findMany({
      where: { IsDeleted: false }
    })

    const prosecutorsWithStats = await Promise.all(
      prosecutors.map(async (prosecutor) => {
        // Get unique messages studied by this prosecutor
        const uniqueMessages = await prisma.etude.findMany({
          where: {
            IdProsecutor: prosecutor.IdResponsable,
            ...dateFilter,
            Messageries: {
              IdFiliere: parseInt(id),
            }
          },
          distinct: ['IdMessagerie'],
          select: {
            Messageries: {
              select: {
                Statut: true
              }
            }
          }
        })

        const completed = uniqueMessages.filter(m => m.Messageries.Statut === 'منجز').length
        const pending = uniqueMessages.filter(m => m.Messageries.Statut === 'غير منجز').length

        return {
          prosecutorId: prosecutor.IdResponsable,
          prosecutorName: `${prosecutor.prenom} ${prosecutor.nom}`,
          completed,
          pending
        }
      })
    )

    // Statistics by subject (top 10 subjects)
    const subjectStats = await prisma.messageries.groupBy({
      by: ['Sujet'],
      where: {
        IdFiliere: parseInt(id),
        ...dateFilter
      },
      _count: {
        _all: true
      },
      orderBy: {
        _count: {
          IdMessagerie: 'desc'
        }
      },
      take: 10
    })

    // Statistics by message type
    const typeStats = await prisma.messageries.groupBy({
      by: ['IdType'],
      where: {
        IdFiliere: parseInt(id),
        ...dateFilter
      },
      _count: {
        _all: true
      }
    })

    // Get type details
    const typesWithDetails = await Promise.all(
      typeStats.map(async (stat) => {
        const type = await prisma.typeMessageries.findUnique({
          where: { IdType: stat.IdType || 0 }
        })
        return {
          typeId: stat.IdType,
          typeName: type?.Libelle || 'Unknown',
          count: stat._count._all
        }
      })
    )

    // Statistics by decision
    const decisionStats = await prisma.etude.groupBy({
      by: ['decision'],
      where: {
        Messageries: {
          IdFiliere: parseInt(id),
          ...dateFilter
        }
      },
      _count: {
        _all: true
      }
    })

    // Statistics by source
    const sourceStats = await prisma.messageries.groupBy({
      by: ['IdSource'],
      where: {
        IdFiliere: parseInt(id),
        ...dateFilter
      },
      _count: {
        _all: true
      }
    })

    // Get source details
    const sourcesWithDetails = await Promise.all(
      sourceStats.map(async (stat) => {
        const source = await prisma.sources.findUnique({
          where: { IdSource: stat.IdSource || 0 }
        })
        return {
          sourceId: stat.IdSource,
          sourceName: source?.NomSource || 'Unknown',
          count: stat._count._all
        }
      })
    )

    // Monthly statistics
    const monthlyStats = await prisma.messageries.groupBy({
      by: ['DateArrivee'],
      where: {
        IdFiliere: parseInt(id),
        ...dateFilter
      },
      _count: {
        _all: true
      }
    })

    // Format monthly data for chart
    const monthlyData = monthlyStats.reduce((acc, stat) => {
      if (!stat.DateArrivee) return acc
      const monthYear = stat.DateArrivee.toISOString().substring(0, 7) // YYYY-MM format
      acc[monthYear] = (acc[monthYear] || 0) + stat._count._all
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      totalMessages,
      completedMessages,
      pendingMessages,
      prosecutors: prosecutorsWithStats,
      subjects: subjectStats,
      types: typesWithDetails,
      decisions: decisionStats,
      sources: sourcesWithDetails,
      monthlyData
    })

  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}