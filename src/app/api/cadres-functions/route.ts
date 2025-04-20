//get UserFonctionne - cadres
// app/api/data/route.ts (App Router)
// app/api/users/route.ts
import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'
import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()


export async function GET() {
  try {
    const cadres = await prisma.cadre.findMany()
    const functions = await prisma.userFonctionne.findMany()

    return NextResponse.json({ cadres, functions })
  } catch (error) {
    console.error(error)
    return new NextResponse('Error fetching data', { status: 500 })
  }
}