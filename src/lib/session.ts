import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET; // Replace with env var later

export async function createSession(data: object) {
  const token = jwt.sign(data, SECRET || "", { expiresIn: '1d' });

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  });
}
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, SECRET || "");
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    maxAge: 0,
    path: '/',
  });
}
