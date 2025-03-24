import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUp as SignUpComponent } from "@clerk/tanstack-start";

export const Route = createFileRoute("/_auth/sign-up/$")({
  beforeLoad: ({ context }) => {
    if (context.userId) {
      throw redirect({
        to: "/",
      })
    };
  },
  component: SignUp,
});

function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUpComponent />
    </div>
  )
};
