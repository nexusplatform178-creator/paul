import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BetslipProvider } from "@/contexts/BetslipContext";
import { VirtualBetslipProvider } from "@/contexts/VirtualBetslipContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import VirtualPage from "./pages/VirtualPage";
import MyBetsPage from "./pages/MyBetsPage";
import DepositPage from "./pages/DepositPage";
import WithdrawPage from "./pages/WithdrawPage";
import BetHistoryPage from "./pages/BetHistoryPage";
import FavouritesPage from "./pages/FavouritesPage";
import BonusesPage from "./pages/BonusesPage";
import NotificationsPage from "./pages/NotificationsPage";
import SecurityPage from "./pages/SecurityPage";
import SettingsPage from "./pages/SettingsPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BetslipProvider>
          <VirtualBetslipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/virtual" element={<VirtualPage />} />
                <Route path="/my-bets" element={<MyBetsPage />} />
                <Route path="/deposit" element={<DepositPage />} />
                <Route path="/withdraw" element={<WithdrawPage />} />
                <Route path="/history" element={<BetHistoryPage />} />
                <Route path="/favourites" element={<FavouritesPage />} />
                <Route path="/bonuses" element={<BonusesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={<HelpSupportPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </VirtualBetslipProvider>
        </BetslipProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;