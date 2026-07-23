import { NextRequest, NextResponse } from 'next/server';

const TARGET_BACKEND = process.env.BACKEND_URL || 'https://slick-flowers-wonder.loca.lt';

async function proxyHandler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const subPath = params.path ? params.path.join('/') : '';
  const targetUrl = `${TARGET_BACKEND}/api/v1/${subPath}${req.nextUrl.search}`;

  try {
    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.set('Bypass-Tunnel-Remainder', 'true');

    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer();

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: 'manual'
    });

    const responseData = await response.arrayBuffer();
    const resHeaders = new Headers();
    response.headers.forEach((val, key) => {
      if (key.toLowerCase() !== 'content-encoding') {
        resHeaders.set(key, val);
      }
    });

    return new NextResponse(responseData, {
      status: response.status,
      headers: resHeaders
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || 'Backend Proxy Connection Failed' },
      { status: 502 }
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
