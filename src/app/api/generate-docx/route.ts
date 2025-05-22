import docxTemplates from 'docx-templates';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
    // 1. Get message data from request body
    const { message } = await request.json();

    // 2. Read the template file
    const templatePath = path.join(process.cwd(), 'public', 'template.docx');
    const template = fs.readFileSync(templatePath);

    // 3. Get the latest Etude (if exists)
    const latestEtude = message.Etude?.length > 0
        ? message.Etude.reduce((latest: any, current: any) => {
            return (!latest.DateDecision || new Date(current.DateDecision) > new Date(latest.DateDecision))
                ? current
                : latest;
        })
        : null;

    // 4. Prepare template data
    const data = {
        NumeroO: `${message.NumeroOrdre}/1/2025` || '',
        // Updated to use Etude's source instead of Messagerie's destination
        SoureceDes: latestEtude?.Sources?.NomSource ||
            latestEtude?.IdSource || '', // Fallback to ID if name not available
        dateCreat: format(message.AddedDate, "yyyy-MM-dd") || '',
        SujetMessaj: message.Sujet || '',
        NumeroM: message.NumeroMessagerie || '',
        dateM:  format(message.DateMessage, "yyyy-MM-dd")|| '',
        decision: latestEtude?.decision || ''
    };

    // 5. Generate modified DOCX
    const modifiedDoc = await docxTemplates({
        template,
        data,
        cmdDelimiter: ['{', '}'],
    });

    // 6. Return the file
    return new NextResponse(modifiedDoc, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename=message-${message.NumeroMessagerie || 'document'}.docx`,
        },
    });
}