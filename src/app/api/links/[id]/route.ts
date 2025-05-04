import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';


const prisma = new PrismaClient()
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const links = await prisma.messagerieLinks.findMany({
            where: {
                OR: [
                    { IdMessagerieSource: Number(params.id) },
                    { IdMessagerieCible: Number(params.id) }
                ]
            },
            include: {
                Messageries_MessagerieLinks_IdMessagerieSourceToMessageries: true,
                Messageries_MessagerieLinks_IdMessagerieCibleToMessageries: true
            }
        });

        // Format the response to include full message data
        const formattedLinks = links.map((link: any) => ({
            ...link,
            sourceMessage: link.Messageries_MessagerieLinks_IdMessagerieSourceToMessageries,
            targetMessage: link.Messageries_MessagerieLinks_IdMessagerieCibleToMessageries
        }));

        return NextResponse.json(formattedLinks);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch linked messages' },
            { status: 500 }
        );
    }
}