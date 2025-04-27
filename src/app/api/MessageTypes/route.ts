import { PrismaClient } from '@/generated/prisma/client'
import {  NextResponse } from 'next/server';


const prisma = new PrismaClient()

export async function GET() {
    try {
        const typeMessages = await prisma.typeMessageries.findMany();
        return NextResponse.json(typeMessages);
    } catch (error) {
        console.error('Error fetching GroupeFilieres:', error);
        return new NextResponse('Error fetching GroupeFilieres', { status: 500 });
    }
}