import { PrismaClient } from '@/generated/prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function POST(request : NextRequest){
    const data = await request.json();
    const {IdFiliere} = data;
    
    const res = await  prisma.filieres.findUnique({
        where : {IdFiliere}
    })

    return NextResponse.json(res)

}