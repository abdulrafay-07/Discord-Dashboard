import { createFileRoute, redirect } from "@tanstack/react-router";

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
    <div>
      Hello World
    </div>
  )
};
