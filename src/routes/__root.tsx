import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import appCss from '../styles.css?url';

import { isFeatureEnabled, prefersReducedMotion } from '@/lib';
import {
  BackgroundCanvas,
  useAuthRefresh,
  useProfile,
  useSocketConnection,
} from '@/modules';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#0c0d13' },

      { title: 'Tic Tac Toe' },
      { name: 'apple-mobile-web-app-title', content: 'Tic Tac Toe' },
      {
        name: 'description',
        content:
          'Multiplayer Tic Tac Toe — play in real time against friends or strangers.',
      },

      /* Open Graph — LinkedIn, Discord, Slack, WhatsApp, Facebook */
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://ttt.yarre.uk' },
      { property: 'og:title', content: 'Tic Tac Toe' },
      {
        property: 'og:description',
        content:
          'Multiplayer Tic Tac Toe — play in real time against friends or strangers.',
      },
      { property: 'og:image', content: 'https://ttt.yarre.uk/og-image.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },

      /* Twitter / X */
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Tic Tac Toe' },
      {
        name: 'twitter:description',
        content:
          'Multiplayer Tic Tac Toe — play in real time against friends or strangers.',
      },
      {
        name: 'twitter:image',
        content: 'https://ttt.yarre.uk/og-image.png',
      },
    ],
    links: [
      { rel: 'canonical', href: 'https://ttt.yarre.uk' },
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-96x96.png',
        sizes: '96x96',
      },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  shellComponent: RootDocument,
  ssr: false,
});

function AuthHooks() {
  useAuthRefresh();
  useSocketConnection();
  useProfile();

  return null;
}

function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      {isFeatureEnabled('IS_AUTH_ENABLED') && <AuthHooks />}
      {children}
    </QueryClientProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="relative min-h-screen overflow-x-hidden">
        {!prefersReducedMotion() && <BackgroundCanvas />}

        <div className="mx-auto max-w-270 px-4 md:px-10 lg:px-20 xl:px-0 2xl:max-w-390 2xl:px-10">
          <AppShell>{children}</AppShell>

          {isFeatureEnabled('IS_DEV_TOOLS_ENABLED') && (
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          )}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
