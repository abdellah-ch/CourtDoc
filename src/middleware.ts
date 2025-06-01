import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { hasFiliereAccess } from './lib/accessControl';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {

  const token = req.cookies.get('session')?.value;
  const isLogingPage = req.nextUrl.pathname === "/login"


  if (!token && !isLogingPage) {
    // console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if(!token && isLogingPage){
    return NextResponse.next()
  }


  try {
    if(token){
    
      const { payload } = await jwtVerify(token, SECRET);
      // console.log(payload);
      
      const userId = Number(payload.id); 


      if(isLogingPage){
        const redirectUrl = payload.role === "Admin" ? "/admin" : "/dashboard"
        return NextResponse.redirect(new URL(redirectUrl,req.url))
      }

      if (req.nextUrl.pathname === "/") {
        const redirectUrl = payload.role === "Admin" ? '/admin' : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }

      // Check for dashboard/[id] access
      if (req.nextUrl.pathname.startsWith('/dashboard/') && req.nextUrl.pathname !== '/dashboard' && req.nextUrl.pathname !== '/dashboard/accessdenied') {
        const filiereId = Number(req.nextUrl.pathname.split('/')[2]);

        if (isNaN(filiereId)) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Call the API to check access
        const accessCheck = await fetch(new URL('/api/check-access', req.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, filiereId }),
        });

        if (!accessCheck.ok) {
          return NextResponse.redirect(new URL('/dashboard/accessdenied', req.url));
        }

        const { hasAccess } = await accessCheck.json();

        if (!hasAccess) {
          return NextResponse.redirect(new URL('/dashboard/accessdenied', req.url));
        }
      }


      if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== "Admin") {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      return NextResponse.next();

    // if (payload.role != "Admin") {
    //   if (req.url.includes("/login")) {
    //     return NextResponse.redirect(new URL('/dashboard', req.url));
    //   }
    //   if (req.url.includes('/admin')) {
    //     return NextResponse.redirect(new URL('/dashboard', req.url));
    //   }
    // } else {
      
    //   if (req.url.includes("/login")) {
    //     return NextResponse.redirect(new URL('/admin', req.url));
    //   }
    // }

    // return NextResponse.next();

  }
  } catch (err) {
    console.error('JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', "/","/login"], // Protect these routes
};