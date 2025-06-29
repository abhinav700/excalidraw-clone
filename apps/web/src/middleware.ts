import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
  try{  
    const {pathname} = request.nextUrl;


    if(pathname.startsWith('/join-room') || pathname.startsWith("/room")){
      const token = request.cookies.get('token');
      if(!token){
        return NextResponse.redirect(new URL('/signin', request.url));

      }
        
    }
    console.log("PATH NAME: ", pathname);
  }catch(err){

  }
}

export const config = {
  matcher: ['/join-room/:path*', '/room/:path*'],
}