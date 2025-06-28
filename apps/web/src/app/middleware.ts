import { NextRequest } from "next/server";

export function middleware(request: NextRequest){
  try{
    const {pathname} = request.nextUrl;
    console.log(pathname);
  }catch(err){

  }
}

export const config = {
  matcher: ['/join-room/*', '/room/*'],
}