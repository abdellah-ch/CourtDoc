import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || '';


export async function POST(req: NextRequest) {

    const {IdFiliere} = await req.json()

    const res = await prisma.codeFilieres.findMany({
        where:{
            IdFiliere
        }
    })

    return NextResponse.json(res)
}