import { useEffect, useCallback } from "react";
import { ref, onValue, update, get } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { VirtualResult } from "@/hooks/useVirtualMatches";

interface BetSelection {
  matchId: string;
  market: string;
  selection: string;
  odds: number;
}

interface Bet {
  id: string;
  selections: BetSelection[];
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: "pending" | "won" | "lost";
  type: "virtual" | "sports";
  createdAt: number;
  matchIds: string[];
}

const checkBetResult = (selections: BetSelection[], results: VirtualResult[]): "won" | "lost" | "pending" => {
  let allWon = true;
  let anyLost = false;
  let allSettled = true;

  for (const selection of selections) {
    const result = results.find((r) => r.matchId === selection.matchId);
    
    if (!result) {
      allSettled = false;
      continue;
    }

    const homeScore = result.homeScore;
    const awayScore = result.awayScore;
    const totalGoals = homeScore + awayScore;
    const fullTimeScore = `${homeScore}:${awayScore}`;

    let selectionWon = false;

    // Check different market types
    if (selection.market === "Full Time Result" || selection.market === "1X2") {
      if (selection.selection === "1" && homeScore > awayScore) selectionWon = true;
      else if (selection.selection === "X" && homeScore === awayScore) selectionWon = true;
      else if (selection.selection === "2" && awayScore > homeScore) selectionWon = true;
    } else if (selection.market === "1st Half Result" || selection.market === "Half Time Result") {
      const htScores = result.halfTimeScore.split(":").map(Number);
      if (selection.selection === "1" && htScores[0] > htScores[1]) selectionWon = true;
      else if (selection.selection === "X" && htScores[0] === htScores[1]) selectionWon = true;
      else if (selection.selection === "2" && htScores[1] > htScores[0]) selectionWon = true;
    } else if (selection.market === "Total Goals" || selection.market.includes("Over/Under")) {
      const parts = selection.selection.split(" ");
      const threshold = parseFloat(parts[1]);
      if (parts[0] === "Over" && totalGoals > threshold) selectionWon = true;
      else if (parts[0] === "Under" && totalGoals < threshold) selectionWon = true;
    } else if (selection.market === "Correct Score") {
      if (selection.selection === fullTimeScore) selectionWon = true;
    } else if (selection.market === "BTTS Full Time" || selection.market === "Both Teams To Score") {
      const bothScored = homeScore > 0 && awayScore > 0;
      if (selection.selection === "Yes" && bothScored) selectionWon = true;
      else if (selection.selection === "No" && !bothScored) selectionWon = true;
    } else if (selection.market === "BTTS 1st Half") {
      const htScores = result.halfTimeScore.split(":").map(Number);
      const bothScoredHT = htScores[0] > 0 && htScores[1] > 0;
      if (selection.selection === "Yes" && bothScoredHT) selectionWon = true;
      else if (selection.selection === "No" && !bothScoredHT) selectionWon = true;
    }

    if (!selectionWon) {
      allWon = false;
      anyLost = true;
    }
  }

  if (!allSettled) return "pending";
  if (anyLost) return "lost";
  if (allWon) return "won";
  return "pending";
};

export const useBetResultChecker = (results: VirtualResult[]) => {
  const { user, updateBalance } = useAuth();

  const checkAndUpdateBets = useCallback(async () => {
    if (!user || results.length === 0) return;

    try {
      const betsRef = ref(database, `bets/${user.uid}`);
      const snapshot = await get(betsRef);

      if (!snapshot.exists()) return;

      const bets = snapshot.val();
      const updates: Record<string, any> = {};

      for (const [betId, bet] of Object.entries(bets)) {
        const betData = bet as Bet;
        
        if (betData.status !== "pending" || betData.type !== "virtual") continue;

        // Check if any match in the bet has a result
        const hasResults = betData.matchIds.some((matchId) =>
          results.some((r) => r.matchId === matchId)
        );

        if (!hasResults) continue;

        const newStatus = checkBetResult(betData.selections, results);

        if (newStatus !== "pending") {
          updates[`bets/${user.uid}/${betId}/status`] = newStatus;
          updates[`bets/${user.uid}/${betId}/settledAt`] = Date.now();

          // Credit winnings if bet won
          if (newStatus === "won") {
            await updateBalance(betData.potentialWin);
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
      }
    } catch (error) {
      console.error("Error checking bet results:", error);
    }
  }, [user, results, updateBalance]);

  useEffect(() => {
    if (results.length > 0) {
      checkAndUpdateBets();
    }
  }, [results, checkAndUpdateBets]);

  return { checkAndUpdateBets };
};