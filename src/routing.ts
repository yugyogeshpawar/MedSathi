import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'hi'],
  defaultLocale: 'en',
  localeDetection: true // Automatically detects via `accept-language` and overrides with `NEXT_LOCALE` cookie
});

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
