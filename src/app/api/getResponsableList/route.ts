import { PrismaClient } from '@/generated/prisma/client'
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET() {

    const res = await prisma.prosecutorResponsables.findMany()

    return NextResponse.json(res);
}