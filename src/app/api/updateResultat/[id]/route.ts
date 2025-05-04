import { NextRequest, NextResponse } from "next/server"

import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const {resultat} = await request.json()
    const {id} = await params
    const updatedData = await prisma.messageries.update({
        where:{
            IdMessagerie:Number(id)
        },
        data:{
            resultat
        }
    })
        console.log(updatedData);
        
        return NextResponse.json(updatedData) 
}