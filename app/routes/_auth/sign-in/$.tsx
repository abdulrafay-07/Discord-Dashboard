import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignIn as SignInComponent } from "@clerk/tanstack-start";

export const Route = createFileRoute("/_auth/sign-in/$")({
  beforeLoad: ({ context }) => {
    if (context.userId) {
      throw redirect({
        to: "/",
      })
    };
  },
  component: SignIn,
});

function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <SignInComponent />
    </div>
  )
};
