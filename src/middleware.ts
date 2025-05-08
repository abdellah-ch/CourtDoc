import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {

  console.log(req.url);


  const token = req.cookies.get('session')?.value;

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the JWT using `jose`
    const { payload } = await jwtVerify(token, SECRET);
    console.log('Token verified:', payload);

    if (req.nextUrl.pathname === "/") {
      if (payload.role != "Admin") {
        console.log('User is not admin, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } else {
        console.log('User is admin, allowing access to admin route');

        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }



    //regular user
    if (payload.role != "Admin") {
      if (req.url.includes("/login")) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      if (req.url.includes('/admin')) {
        console.log('User is not admin, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } else {
      console.log('User is admin, allowing access to admin route');
      if (req.url.includes("/login")) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
    //regular user

    // Allow the request to proceed
    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', "/","/login"], // Protect these routes
};