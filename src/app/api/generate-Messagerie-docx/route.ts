import docxTemplates from 'docx-templates';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const { message } = await request.json();

    // 2. Read the template file
    const templatePath = path.join(process.cwd(), 'public', 'templateDossierMessagerie.docx');
    const template = fs.readFileSync(templatePath);
    console.log(message);

    if (message.IdType === 2 ) {
        var Type = "الإصدار"
        var isAr = false;
    } else {
        var Type = "التوصل"
        var isAr = true;
    }
    
    const filiereLibele = (await prisma.filieres.findFirst({
        where: {
            IdFiliere: message.IdFiliere
        },
        select: {
            Libelle: true
        }
    }))?.Libelle;

    const data = {
        FiliereNom:filiereLibele || "",
        NumeroO: `2025/1/${message.NumeroOrdre}`,
        Type: Type,
        DateA: isAr ? format(message.DateArrivee, "yyyy-MM-dd") : format(message.DateMessage, "yyyy-MM-dd"),
        Source: message.Sources?.NomSource || message?.AutreLibelleSource || message.Sources_Messageries_IdSourceDestinationToSources?.NomSource || message.AutreLibelleDestination,
        TypeM: message.TypeMessageries.Libelle,
        Sujet: message.Sujet || "",
        DateEtude: format(message.Etude[0]?.DateEtude, "yyyy-MM-dd") || '',
        ProcurorFirstEtude: message.Etude[0].ProsecutorResponsables.nom + " " + message.Etude[0].ProsecutorResponsables.prenom,
    }

    const modifiedDoc = await docxTemplates({
        template,
        data,
        cmdDelimiter: ['{', '}'],
    });

    return new NextResponse(modifiedDoc, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename=${message.NumeroOrdre}.docx`,
        },
    });
}