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

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          fill="none"
        >
          <defs>
            <symbol id="x" viewBox="-9 -9 18 18">
              <line
                x1="-7"
                y1="-7"
                x2="7"
                y2="7"
                stroke="#59aaf8"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1="7"
                y1="-7"
                x2="-7"
                y2="7"
                stroke="#59aaf8"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </symbol>
            <symbol id="o" viewBox="-11 -11 22 22">
              <circle cx="0" cy="0" r="8" stroke="#f3625d" strokeWidth="2.2" />
            </symbol>
          </defs>

          <rect width="1200" height="630" fill="#0c0d13" />

          <use
            href="#x"
            x="72"
            y="78"
            width="18"
            height="18"
            opacity="0.22"
            transform="rotate(-15, 81, 87)"
          />
          <use
            href="#x"
            x="1090"
            y="72"
            width="18"
            height="18"
            opacity="0.14"
            transform="rotate(22, 1099, 81)"
          />
          <use
            href="#x"
            x="38"
            y="310"
            width="18"
            height="18"
            opacity="0.24"
            transform="rotate(8, 47, 319)"
          />
          <use
            href="#x"
            x="1130"
            y="380"
            width="18"
            height="18"
            opacity="0.18"
            transform="rotate(-10, 1139, 389)"
          />
          <use
            href="#x"
            x="185"
            y="530"
            width="18"
            height="18"
            opacity="0.15"
            transform="rotate(-28, 194, 539)"
          />
          <use
            href="#x"
            x="970"
            y="515"
            width="18"
            height="18"
            opacity="0.20"
            transform="rotate(17, 979, 524)"
          />
          <use
            href="#x"
            x="390"
            y="82"
            width="18"
            height="18"
            opacity="0.12"
            transform="rotate(11, 399, 91)"
          />
          <use
            href="#x"
            x="740"
            y="65"
            width="18"
            height="18"
            opacity="0.09"
            transform="rotate(-7, 749, 74)"
          />
          <use
            href="#x"
            x="810"
            y="565"
            width="18"
            height="18"
            opacity="0.11"
            transform="rotate(32, 819, 574)"
          />
          <use
            href="#x"
            x="290"
            y="418"
            width="18"
            height="18"
            opacity="0.10"
            transform="rotate(-20, 299, 427)"
          />
          <use
            href="#x"
            x="490"
            y="548"
            width="18"
            height="18"
            opacity="0.08"
            transform="rotate(6, 499, 557)"
          />
          <use
            href="#x"
            x="1060"
            y="178"
            width="18"
            height="18"
            opacity="0.10"
            transform="rotate(-14, 1069, 187)"
          />
          <use
            href="#x"
            x="630"
            y="560"
            width="18"
            height="18"
            opacity="0.07"
            transform="rotate(25, 639, 569)"
          />

          <use
            href="#o"
            x="909"
            y="100"
            width="22"
            height="22"
            opacity="0.18"
          />
          <use href="#o" x="58" y="270" width="22" height="22" opacity="0.22" />
          <use
            href="#o"
            x="1042"
            y="488"
            width="22"
            height="22"
            opacity="0.16"
          />
          <use
            href="#o"
            x="228"
            y="148"
            width="22"
            height="22"
            opacity="0.12"
          />
          <use
            href="#o"
            x="638"
            y="554"
            width="22"
            height="22"
            opacity="0.10"
          />
          <use
            href="#o"
            x="155"
            y="400"
            width="22"
            height="22"
            opacity="0.11"
          />
          <use
            href="#o"
            x="688"
            y="108"
            width="22"
            height="22"
            opacity="0.09"
          />
          <use
            href="#o"
            x="880"
            y="438"
            width="22"
            height="22"
            opacity="0.09"
          />
          <use
            href="#o"
            x="450"
            y="150"
            width="22"
            height="22"
            opacity="0.07"
          />

          <text
            x="600"
            y="315"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Sono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
            fontWeight="800"
            fontSize="132"
            letterSpacing="-4"
          >
            <tspan fill="#f3625d">TIC</tspan>
            <tspan fill="#7a7c82">·</tspan>
            <tspan fill="#59aaf8">TAC</tspan>
            <tspan fill="#7a7c82">·</tspan>
            <tspan fill="#f1f1f3">TOE</tspan>
          </text>

          <text
            x="600"
            y="470"
            textAnchor="middle"
            fill="#7a7c82"
            fontFamily="'Sono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
            fontWeight="400"
            fontSize="25"
            letterSpacing="6"
          >
            PLAY LOCAL · ONLINE · CHAT
          </text>
        </svg>

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
