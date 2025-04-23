//get all filieres  ajouter code filiere

import { PrismaClient } from '@/generated/prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

//get all filieres
export async function GET() {
    try {
        const Filieres = await prisma.filieres.findMany();
        return NextResponse.json(Filieres);
    } catch (error) {
        console.error('Error fetching GroupeFilieres:', error);
        return new NextResponse('Error fetching GroupeFilieres', { status: 500 });
    }
}


//add code to filieres
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const { Valeur, IdFiliere } = data;

        if (!Valeur || !IdFiliere) {
            return new NextResponse('Missing required fields: Valeur or idFiliere', { status: 400 });
        }

        const newFiliere = await prisma.codeFilieres.create({
            data: {
                Valeur,
                IdFiliere,
            },
        });

        return NextResponse.json(newFiliere);
    } catch (error) {
        console.error('Error :', error);
        return new NextResponse('Error', { status: 500 });
    }
}