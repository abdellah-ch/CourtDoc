import { NextResponse } from 'next/server';
import {PrismaClient} from '@/generated/prisma/client';

const prisma = new PrismaClient()
// Create new link
export async function POST(request: Request) {
  

  try {
    const { IdMessagerieSource, IdMessagerieCible } = await request.json();
    
    // Check if link already exists
    const existingLink = await prisma.messagerieLinks.findFirst({
      where: {
        IdMessagerieSource,
        IdMessagerieCible
      }
    });

    if (existingLink) {
      return NextResponse.json(
        { error: 'المراسلة مضمة بالفعل' },
        { status: 400 }
      );
    }

    const newLink = await prisma.messagerieLinks.create({
      data: {
        IdMessagerieSource,
        IdMessagerieCible,
      },
      include: {
        Messageries_MessagerieLinks_IdMessagerieSourceToMessageries: true,
        Messageries_MessagerieLinks_IdMessagerieCibleToMessageries: true
      }
    });

    return NextResponse.json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

// Delete link
export async function DELETE(request: Request) {
  

  try {
    const { IdMessagerieSource, IdMessagerieCible } = await request.json();
    
    const deletedLink = await prisma.messagerieLinks.deleteMany({
      where: {
        IdMessagerieSource,
        IdMessagerieCible
      }
    });

    if (deletedLink.count === 0) {
      return NextResponse.json(
        { error: 'الرابط غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}