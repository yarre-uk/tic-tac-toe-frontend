import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import appCss from '../styles.css?url';

import { useSocketConnection } from '@/hooks/use-socket-connection';
import { useAuthRefresh } from '@/modules/auth';
import { useProfile } from '@/modules/profile';

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

function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  useAuthRefresh();
  // Manages the WebSocket connection lifecycle — connects when a token is available,
  // disconnects on logout. Must run after useAuthRefresh so the token is fresh.
  useSocketConnection();
  // Fetches user profile once auth is ready and writes it to profileStore.
  // Enabled only when isAuthorized(), so it never fires for unauthenticated users.
  useProfile();

  return <>{children}</>;
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="mx-auto max-w-270 overflow-x-hidden px-4 md:px-10 lg:px-20 xl:px-0 2xl:max-w-390 2xl:px-10">
        <QueryClientProvider client={queryClient}>
          <AppShell>{children}</AppShell>
        </QueryClientProvider>

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
        <Scripts />
      </body>
    </html>
  );
}
