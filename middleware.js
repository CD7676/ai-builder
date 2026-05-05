export const config = {
  matcher: '/((?!_vercel|favicon\\.ico).*)',
};

const PRIVATE_PATHS = ['/time-audit', '/time-audit.html'];

const PUBLIC_REWRITES = {
  '/ai-builder-plan.html': '/ai-builder-plan-public.html',
};

function isPrivatePath(pathname) {
  return PRIVATE_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export default function middleware(request) {
  const pathname = new URL(request.url).pathname;

  if (process.env.PRIVATE_AUTH !== 'true') {
    if (isPrivatePath(pathname)) {
      return new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const rewriteTo = PUBLIC_REWRITES[pathname];
    if (rewriteTo) {
      const target = new URL(rewriteTo, request.url);
      return new Response(null, {
        headers: { 'x-middleware-rewrite': target.toString() },
      });
    }
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
