import { PrismaClient } from '@/generated/prisma';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || '';

export async function POST(req: NextRequest) {
  const { UserName, Password } = await req.json();

  // Find user in the database
  const user = await prisma.utilisateurs.findFirst({
    where: { Nom: UserName, MotDePasse: Password },
  });

  if (!user) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.IdUtilisateur, role: user.IdRole },
    SECRET,
    { expiresIn: '1d' }
  );

  // Set cookie
  const response = NextResponse.json({ message: 'Login successful',role : user.IdRole });
  response.cookies.set('session', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
 
  return response;
}
