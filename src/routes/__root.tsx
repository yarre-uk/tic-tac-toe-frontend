import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import appCss from '../styles.css?url';

import { isFeatureEnabled } from '@/lib';
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
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Tic Tac Toe',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
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
        <BackgroundCanvas />

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
