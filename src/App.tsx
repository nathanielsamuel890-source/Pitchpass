import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import FixturesPage from "./pages/FixturesPage"; 
import MyTicketsPage from "./pages/MyTicketsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import { CurrencyProvider } from "./context/CurrencyContext";
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sage">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-page">
      <CurrencyProvider>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/fixtures" replace />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/fixtures" element={<FixturesPage />} />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
        </CurrencyProvider>
    </div>
  );
}
