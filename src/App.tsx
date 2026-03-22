import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider, useGame } from "@/contexts/GameContext";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import WorldMap from "./pages/WorldMap";
import TrainJourney from "./pages/TrainJourney";
import StationsList from "./pages/StationsList";
import StationView from "./pages/StationView";
import GameScreen from "./pages/GameScreen";
import RewardScreen from "./pages/RewardScreen";
import ProfileScreen from "./pages/ProfileScreen";
import WelcomeScreen from "./pages/WelcomeScreen";
import BiometricGate from "./pages/BiometricGate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { loading, isLoggedIn, pendingBiometric } = useGame();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🚂</div>
          <p className="text-sm text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  // Session exists but biometric verification required
  if (pendingBiometric && !isLoggedIn) {
    return <BiometricGate />;
  }

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/welcome" replace /> : <LoginScreen />} />
      <Route path="/welcome" element={isLoggedIn ? <WelcomeScreen /> : <Navigate to="/login" replace />} />
      <Route path="/world" element={isLoggedIn ? <WorldMap /> : <Navigate to="/login" replace />} />
      <Route path="/train" element={isLoggedIn ? <TrainJourney /> : <Navigate to="/login" replace />} />
      <Route path="/stations" element={isLoggedIn ? <StationsList /> : <Navigate to="/login" replace />} />
      <Route path="/station" element={isLoggedIn ? <StationView /> : <Navigate to="/login" replace />} />
      <Route path="/game" element={isLoggedIn ? <GameScreen /> : <Navigate to="/login" replace />} />
      <Route path="/reward" element={isLoggedIn ? <RewardScreen /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isLoggedIn ? <ProfileScreen /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
