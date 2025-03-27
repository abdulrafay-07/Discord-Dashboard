/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useLoaderData,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { ClerkProvider } from "@clerk/tanstack-start";
import { getAuth } from "@clerk/tanstack-start/server";

import { Toaster } from "react-hot-toast";

import appCss from "~/styles/app.css?url";

import { NotFound } from "~/components/not-found";
import { Sidebar } from "~/components/shared/sidebar";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";

import { getServers } from "~/lib/bot/get";

const fetchClerkAuth = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { userId } = await getAuth(getWebRequest()!)

    return {
      userId,
    }
  });

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Discord Bot Dashboard",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth();

    return {
      userId,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  loader: async ({ context }) => {
    const { userId } = context;
    const servers = await getServers();

    return { servers, userId };
  },
});

function RootComponent() {
  return (
    <ClerkProvider>
      <RootDocument>
        <Toaster />
        <Outlet />
      </RootDocument>
    </ClerkProvider>
  )
};

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { userId, servers } = Route.useLoaderData();

  return !userId ? (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  ) : (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="flex">
        <Sidebar servers={servers.data} />
        <main className="flex-1 lg:px-12 py-6 lg:py-10">
          {children}
        </main>
        <Scripts />
      </body>
    </html>
  )
};
