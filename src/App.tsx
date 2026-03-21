import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/contexts/GameContext";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import WorldMap from "./pages/WorldMap";
import TrainJourney from "./pages/TrainJourney";
import StationsList from "./pages/StationsList";
import StationView from "./pages/StationView";
import GameScreen from "./pages/GameScreen";
import RewardScreen from "./pages/RewardScreen";
import ProfileScreen from "./pages/ProfileScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/world" element={<WorldMap />} />
            <Route path="/train" element={<TrainJourney />} />
            <Route path="/stations" element={<StationsList />} />
            <Route path="/station" element={<StationView />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/reward" element={<RewardScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
