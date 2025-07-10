import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CanvasPage from "@/components/pages/CanvasPage";
import OnboardingWelcome from "@/components/pages/OnboardingWelcome";
import OnboardingSetup from "@/components/pages/OnboardingSetup";

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if onboarding has been completed
    const completed = localStorage.getItem('onboardingComplete');
    setOnboardingComplete(completed === 'true');
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setOnboardingComplete(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/" 
          element={
            onboardingComplete ? (
              <CanvasPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            onboardingComplete ? (
              <Navigate to="/" replace />
            ) : (
              <OnboardingWelcome onComplete={handleOnboardingComplete} />
            )
          } 
        />
        <Route 
          path="/onboarding/setup" 
          element={
            onboardingComplete ? (
              <Navigate to="/" replace />
            ) : (
              <OnboardingSetup onComplete={handleOnboardingComplete} />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default App;