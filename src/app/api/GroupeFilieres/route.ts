import { PrismaClient } from '@/generated/prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET() {
    try {
        const groupeFilieres = await prisma.groupeFilieres.findMany();
        return NextResponse.json(groupeFilieres);
    } catch (error) {
        console.error('Error fetching GroupeFilieres:', error);
        return new NextResponse('Error fetching GroupeFilieres', { status: 500 });
    }
}


//ajouter une filier avec code groupe filieres

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const { nom, idGroupe } = data;

        if (!nom || !idGroupe) {
            return new NextResponse('Missing required fields: nom or idGroupe', { status: 400 });
        }

        const newFiliere = await prisma.filieres.create({
            data: {
                Libelle: nom,
                IdGroupeFiliere: parseInt(idGroupe),
            },
        });

        return NextResponse.json(newFiliere);
    } catch (error) {
        console.error('Error creating Filiere:', error);
        return new NextResponse('Failed to create Filiere', { status: 500 });
    }
}