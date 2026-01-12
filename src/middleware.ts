import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 设备类型判断和跳转逻辑
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

    if (request.nextUrl.pathname === '/') {
        if (isMobile) {
            return NextResponse.redirect(new URL('/h5', request.url));
        } else {
            return NextResponse.redirect(new URL('/pc', request.url));
        }
    }

    return NextResponse.next();
}
