import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { ref, push, set, get, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface VirtualBetSelection {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  selection: string;
  odds: number;
  matchTime?: string;
}

export interface VirtualBet {
  id?: string;
  selections: VirtualBetSelection[];
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: "pending" | "won" | "lost";
  type: "virtual";
  createdAt: number;
  settledAt?: number;
  matchIds: string[];
}

interface VirtualBetslipContextType {
  selections: VirtualBetSelection[];
  addSelection: (selection: VirtualBetSelection) => void;
  removeSelection: (id: string) => void;
  clearBetslip: () => void;
  stake: number;
  setStake: (stake: number) => void;
  totalOdds: number;
  potentialWinnings: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  placeBet: () => Promise<boolean>;
  isPlacingBet: boolean;
}

const VirtualBetslipContext = createContext<VirtualBetslipContextType | undefined>(undefined);

export const VirtualBetslipProvider = ({ children }: { children: ReactNode }) => {
  const { user, userProfile, updateBalance } = useAuth();
  const [selections, setSelections] = useState<VirtualBetSelection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stake, setStake] = useState(0);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const addSelection = useCallback((selection: VirtualBetSelection) => {
    setSelections((prev) => {
      const existsExact = prev.find((s) => s.id === selection.id);
      if (existsExact) {
        return prev.filter((s) => s.id !== selection.id);
      }
      
      // Remove any other selection from the same match (only 1 odd per match allowed)
      const filteredPrev = prev.filter((s) => s.matchId !== selection.matchId);
      
      return [...filteredPrev, selection];
    });
  }, []);

  const removeSelection = useCallback((id: string) => {
    setSelections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearBetslip = useCallback(() => {
    setSelections([]);
    setStake(0);
  }, []);

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const potentialWinnings = stake * totalOdds;

  const placeBet = useCallback(async (): Promise<boolean> => {
    if (!user || !userProfile) {
      toast({
        title: "Login Required",
        description: "Please login to place bets",
        variant: "destructive",
      });
      return false;
    }

    if (selections.length === 0) {
      toast({
        title: "No Selections",
        description: "Please add selections to your betslip",
        variant: "destructive",
      });
      return false;
    }

    if (stake <= 0) {
      toast({
        title: "Invalid Stake",
        description: "Please enter a valid stake amount",
        variant: "destructive",
      });
      return false;
    }

    if (stake > userProfile.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance. Please deposit more funds.",
        variant: "destructive",
      });
      return false;
    }

    setIsPlacingBet(true);

    try {
      // Create bet object
      const bet: VirtualBet = {
        selections: selections.map(s => ({
          id: s.id,
          matchId: s.matchId,
          homeTeam: s.homeTeam,
          awayTeam: s.awayTeam,
          market: s.market,
          selection: s.selection,
          odds: s.odds,
          matchTime: s.matchTime,
        })),
        stake,
        totalOdds,
        potentialWin: potentialWinnings,
        status: "pending",
        type: "virtual",
        createdAt: Date.now(),
        matchIds: selections.map(s => s.matchId),
      };

      // Save bet to Firebase
      const betsRef = ref(database, `bets/${user.uid}`);
      const newBetRef = push(betsRef);
      await set(newBetRef, bet);

      // Deduct stake from balance
      await updateBalance(-stake);

      toast({
        title: "Bet Placed Successfully!",
        description: `Stake: UGX ${stake.toLocaleString()} | Potential Win: UGX ${potentialWinnings.toLocaleString()}`,
      });

      clearBetslip();
      setIsOpen(false);
      return true;
    } catch (error) {
      console.error("Error placing bet:", error);
      toast({
        title: "Failed to Place Bet",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsPlacingBet(false);
    }
  }, [user, userProfile, selections, stake, totalOdds, potentialWinnings, updateBalance, clearBetslip]);

  return (
    <VirtualBetslipContext.Provider
      value={{
        selections,
        addSelection,
        removeSelection,
        clearBetslip,
        stake,
        setStake,
        totalOdds,
        potentialWinnings,
        isOpen,
        setIsOpen,
        placeBet,
        isPlacingBet,
      }}
    >
      {children}
    </VirtualBetslipContext.Provider>
  );
};

export const useVirtualBetslip = () => {
  const context = useContext(VirtualBetslipContext);
  if (!context) {
    throw new Error("useVirtualBetslip must be used within a VirtualBetslipProvider");
  }
  return context;
};