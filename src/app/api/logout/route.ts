import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.set('session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // Expire immediately
  });

  return response;
}