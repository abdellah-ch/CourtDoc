// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'
import { PrismaClient } from '@/generated/prisma/client'
import bcrypt from "bcryptjs";

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


export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    // Basic validation (you can improve this)
    if (
      !data.username ||
      !data.password ||
      !data.lastName ||
      !data.firstName ||
      !data.startDate ||
      !data.hireDate ||
      !data.role
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10); // 10 = salt rounds


    const newUser = await prisma.utilisateurs.create({
      data: {
        UserName: data.username,
        MotDePasse: hashedPassword,
        Nom: data.lastName,
        Prenom: data.firstName,
        Tel: data.phone || null,
        Email: data.email || null,
        DateAffectation: new Date(data.startDate),
        DateEmbauche: new Date(data.hireDate),
        IdUserFonctionne: parseInt(data.role),
        IdRole:6,
        IdCadre: data.cadre ? parseInt(data.cadre) : null,
      },
    });

    return Response.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("Error creating user", { status: 500 });
  }
}