import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/fixtures"
        appearance={{
          variables: {
            colorPrimary: "#2563EB",
            colorBackground: "#FFFFFF",
            colorText: "#111827",
            colorInputBackground: "#F7F8FA",
            colorInputText: "#111827",
          },
        }}
      />
    </div>
  );
}
