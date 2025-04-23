//add new groupe
//input Libelle table GroupeFilieres
import {PrismaClient}  from "@/generated/prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: NextRequest){

    const data = await request.json()

    const { Libelle } = data

    if(!Libelle){
        return new NextResponse("Libelle undefined",{status:400})
    }

    const res = await prisma.groupeFilieres.create({
        data:{
            Libelle
        }
    })

    return new NextResponse("success",{status:200})
}
