import { NextResponse } from 'next/server';

import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const {
      numeroMessage,
      dateMessage,
      dateArrivee,
      sujet,
      remarques,
      statut,
      idType,
      IdTypeSource,
      idProsecutor,
      idCode,
      idSource
    } = await request.json();

    // 1. Fetch the related CodeFiliere to get the Valeur (code) and IdFiliere
    const codeFiliere = await prisma.codeFilieres.findUnique({
      where: { IdCode: parseInt(idCode) },
      include: { Filieres: true }
    });

    if (!codeFiliere) {
      return NextResponse.json(
        { error: 'CodeFiliere not found' },
        { status: 404 }
      );
    }

    const idFiliere = codeFiliere.IdFiliere;
    const codeFiliereValue = codeFiliere.Valeur;
    const currentYear = new Date(dateMessage).getFullYear();

    // 2. Calculate the next NumeroOrdre for this filiere and year
    const lastMessagerie = await prisma.messageries.findFirst({
      where: {
        IdFiliere: idFiliere,
        DateMessage: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`)
        }
      },
      orderBy: { NumeroOrdre: 'desc' },
      select: { NumeroOrdre: true }
    });

    const nextNumeroOrdre = lastMessagerie 
      ? parseInt(lastMessagerie.NumeroOrdre) + 1 
      : 1;

    // 3. Generate CodeComplet (format: numeroOrdre/codeFiliere/year)
    const codeComplet = `${nextNumeroOrdre}/${codeFiliereValue}/${currentYear}`;

    // 4. Create the new messagerie
    const newMessagerie = await prisma.messageries.create({
      data: {
        NumeroOrdre: nextNumeroOrdre.toString(),
        CodeMessagerie: numeroMessage,
        CodeComplet: codeComplet,
        DateMessage: new Date(dateMessage),
        DateArrivee: dateArrivee ? new Date(dateArrivee) : null,
        Sujet: sujet,
        Remarques: remarques,
        Statut: statut,
        IdType: parseInt(idType),
        IdProsecutor: parseInt(idProsecutor),
        IdCode: parseInt(idCode),
        IdSource: parseInt(idSource),
        IdFiliere: idFiliere,
        AddedDate: new Date(),
        IsDeleted: false
      }
    });

    return NextResponse.json(newMessagerie, { status: 201 });

  } catch (error) {
    console.error('Error creating messagerie:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}