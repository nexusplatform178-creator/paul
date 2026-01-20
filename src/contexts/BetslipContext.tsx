import React, { createContext, useContext, useState, ReactNode } from "react";

export interface BetSelection {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  selection: string;
  odds: number;
}

interface BetslipContextType {
  selections: BetSelection[];
  addSelection: (selection: BetSelection) => void;
  removeSelection: (id: string) => void;
  clearBetslip: () => void;
  stake: number;
  setStake: (stake: number) => void;
  totalOdds: number;
  potentialWinnings: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const BetslipContext = createContext<BetslipContextType | undefined>(undefined);

export const BetslipProvider = ({ children }: { children: ReactNode }) => {
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stake, setStake] = useState(0);

  const addSelection = (selection: BetSelection) => {
    setSelections((prev) => {
      // Check if this exact selection already exists - toggle it off
      const existsExact = prev.find((s) => s.id === selection.id);
      if (existsExact) {
        return prev.filter((s) => s.id !== selection.id);
      }
      
      // Remove any other selection from the same match (only 1 odd per match allowed)
      const filteredPrev = prev.filter((s) => s.matchId !== selection.matchId);
      
      return [...filteredPrev, selection];
    });
  };

  const removeSelection = (id: string) => {
    setSelections((prev) => prev.filter((s) => s.id !== id));
  };

  const clearBetslip = () => {
    setSelections([]);
    setStake(0);
  };

  // Calculate combined odds (multiply all odds together for accumulator)
  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const potentialWinnings = stake * totalOdds;

  return (
    <BetslipContext.Provider
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
      }}
    >
      {children}
    </BetslipContext.Provider>
  );
};

export const useBetslip = () => {
  const context = useContext(BetslipContext);
  if (!context) {
    throw new Error("useBetslip must be used within a BetslipProvider");
  }
  return context;
};
