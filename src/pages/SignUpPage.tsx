import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/*
        Clerk's <SignUp /> component handles account creation AND
        email/phone verification automatically — it sends a real
        verification code and confirms it before letting the person in.
        No custom verification code needs to be written.
      */}
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/fixtures"
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
