import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Sidebar } from "~/components/shared/sidebar";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/sign-in/$",
      })
    };
  },
  component: Home,
});

function Home() {
  return (  
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:pl-12">
        <Outlet />
      </main>
    </div>
  )
};
