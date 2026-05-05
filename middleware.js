export const config = {
  matcher: '/((?!_vercel|favicon\\.ico).*)',
};

export default function middleware(request) {
  if (process.env.PRIVATE_AUTH !== 'true') {
    return;
  }

  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(':');
      if (sep > 0) {
        const user = decoded.slice(0, sep);
        const pass = decoded.slice(sep + 1);
        if (user === 'chris' && pass === process.env.PRIVATE_PASS) {
          return;
        }
      }
    } catch {}
  }
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="ai-builder-private", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}
