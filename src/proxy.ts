import createMiddleware from 'next-intl/middleware';
import {routing} from './routing';

import { NextRequest } from 'next/server';

// next-intl's createMiddleware handles exactly what you requested out-of-the-box:
// 1. Checks `NEXT_LOCALE` cookie first (respects manual switches).
// 2. Checks browser language via `request.headers.get("accept-language")`.
// 3. Defaults to `/en` if the requested language is neither `en` nor `hi`.
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames.
  // This explicitly ignores static files (_next/static, public, etc.) and API routes to avoid infinite redirects.
  matcher: ['/', '/(hi|en)/:path*']
};
