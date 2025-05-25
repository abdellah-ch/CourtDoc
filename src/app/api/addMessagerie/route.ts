import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';
const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const {
      CodeReference,
      NumeroMessagerie,
      CodeBarre,
      dateMessage,
      dateArrivee,
      sujet,
      remarques,
      statut,
      idType,
      idCode,
      idSource,
      idSourceDestination,
      AutreLibelleDestination,
      AutreLibelleSource,
      TypeDocument,
      underSupervision,
      participants_courrier
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
      ? lastMessagerie.NumeroOrdre + 1 : 1;

    // 3. Generate CodeComplet (format: year/codeFiliere/numeroOrdre)
    const codeComplet = `${nextNumeroOrdre.toString().padStart(3, '0')}/${codeFiliereValue}/${currentYear}`
    // 4. Determine NumeroMessagerie based on idType
    const finalNumeroMessagerie = (parseInt(idType) === 1 || parseInt(idType) === 3)
      ? NumeroMessagerie
      : codeComplet;

    // 5. Create the new messagerie with all fields
    const newMessagerie = await prisma.messageries.create({
      data: {
        NumeroOrdre: parseInt(nextNumeroOrdre.toString()),
        CodeBarre: CodeBarre,
        NumeroMessagerie: finalNumeroMessagerie,
        CodeReference: CodeReference,
        DateMessage: new Date(dateMessage),
        DateArrivee: dateArrivee ? new Date(dateArrivee) : null,
        Sujet: sujet,
        Remarques: remarques,
        Statut: statut,
        IdType: parseInt(idType),
        IdCode: parseInt(idCode),
        IdSource: idSource ? parseInt(idSource) : null,
        IdSourceDestination: idSourceDestination ? parseInt(idSourceDestination) : null,
        AutreLibelleDestination,
        AutreLibelleSource: AutreLibelleSource,
        IdFiliere: idFiliere,
        AddedDate: new Date(),
        IsDeleted: false,
        underSupervision,
        TypeDocument,
        participants_courrier
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