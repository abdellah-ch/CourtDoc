import { PrismaClient } from '@/generated/prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const data = await prisma.parametre.findFirst()
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}