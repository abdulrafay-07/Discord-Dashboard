import { createFileRoute, redirect, useMatch } from "@tanstack/react-router";

export const Route = createFileRoute("/servers/$serverId/")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/",
      });
    };
  },
  component: Home,
});

function Home() {
  const match = useMatch({ from: "/servers/$serverId/" });

  const { serverId } = match.params;

  return (
    <div className="w-full">
      homepage
    </div>
  )
};
