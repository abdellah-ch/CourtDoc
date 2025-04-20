// app/api/users/route.ts
import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'
import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

//get all the users 
export async function GET() {
  try {
    const users = await prisma.utilisateurs.findMany({
      include: {
        Roles: true,
        Cadre: true,
        UserFonctionne: true
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: error },
      { status: 500 },
    )
  }
}






export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newUser = await prisma.utilisateurs.create({
      data: body
    })
    return NextResponse.json(newUser)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}