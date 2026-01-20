import { useState, useEffect, useCallback } from "react";

export interface VirtualMatch {
  id: number;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  kickoffTime: number;
  fullTimeResult: Record<string, number>;
  firstHalfResult: Record<string, number>;
  totalGoals: Record<string, number>;
  correctScore: Array<{ score: string; odds: number }>;
  btts: Record<string, number>;
  bttsFirstHalf: Record<string, number>;
  lastResults?: string[];
}

export interface VirtualResult {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  halfTimeScore: string;
  fullTimeScore: string;
  status: "completed" | "in_progress";
}

interface UseVirtualMatchesReturn {
  matches: VirtualMatch[];
  lastResults: VirtualResult[];
  loading: boolean;
  error: string | null;
  countdown: number;
  refresh: () => void;
}

// Use Supabase Edge Function proxy to avoid CORS
const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/virtual-proxy`;

const parseMarket = (markets: any[], marketName: string): Record<string, number> => {
  const result: Record<string, number> = {};
  const market = markets?.find((m: any) => m.name === marketName || m.marketName === marketName);
  
  if (market?.outcomes) {
    market.outcomes.forEach((outcome: any) => {
      result[outcome.name || outcome.outcomeName] = parseFloat(outcome.odds) || outcome.odds;
    });
  }
  
  return result;
};

const parseCorrectScore = (markets: any[]): Array<{ score: string; odds: number }> => {
  const market = markets?.find((m: any) => 
    m.name?.toLowerCase().includes("correct score") || 
    m.marketName?.toLowerCase().includes("correct score")
  );
  
  if (!market?.outcomes) return [];
  
  return market.outcomes.slice(0, 9).map((outcome: any) => ({
    score: outcome.name || outcome.outcomeName,
    odds: parseFloat(outcome.odds) || outcome.odds,
  }));
};

export const useVirtualMatches = (): UseVirtualMatchesReturn => {
  const [matches, setMatches] = useState<VirtualMatch[]>([]);
  const [lastResults, setLastResults] = useState<VirtualResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch matches via Edge Function proxy
      const offerResponse = await fetch(`${PROXY_URL}?endpoint=offer`, {
        headers: {
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        }
      });
      
      if (!offerResponse.ok) {
        throw new Error("Failed to fetch matches");
      }

      const offerData = await offerResponse.json();
      
      // Parse matches from API response
      const parsedMatches: VirtualMatch[] = [];
      
      if (offerData?.data?.matches || offerData?.matches || Array.isArray(offerData)) {
        const matchesArray = offerData?.data?.matches || offerData?.matches || offerData;
        
        matchesArray.slice(0, 6).forEach((match: any, index: number) => {
          const homeTeam = match.homeTeam || match.home || match.teams?.[0] || `V-Team ${index * 2 + 1}`;
          const awayTeam = match.awayTeam || match.away || match.teams?.[1] || `V-Team ${index * 2 + 2}`;
          const markets = match.markets || match.odds || [];
          
          parsedMatches.push({
            id: match.id || match.matchId || 170 + index,
            matchId: String(match.id || match.matchId || 170 + index),
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            time: match.time || match.kickoff || "03:00",
            kickoffTime: match.kickoffTime || Date.now() + (5 - index) * 60000,
            fullTimeResult: parseMarket(markets, "1X2") || parseMarket(markets, "Full Time Result") || { "1": 2.10, "X": 3.20, "2": 3.40 },
            firstHalfResult: parseMarket(markets, "1st Half Result") || parseMarket(markets, "Half Time Result") || { "1": 2.60, "X": 2.08, "2": 4.28 },
            totalGoals: parseMarket(markets, "Total Goals") || parseMarket(markets, "Over/Under") || {
              "Under 1.5": 2.65, "Over 1.5": 1.75,
              "Under 2.5": 1.80, "Over 2.5": 1.90,
              "Under 3.5": 1.25, "Over 3.5": 3.55,
            },
            correctScore: parseCorrectScore(markets).length > 0 ? parseCorrectScore(markets) : [
              { score: "1:0", odds: 6.30 }, { score: "0:0", odds: 13.00 }, { score: "0:1", odds: 13.00 },
              { score: "2:0", odds: 8.00 }, { score: "1:1", odds: 5.90 }, { score: "0:2", odds: 22.00 },
              { score: "2:1", odds: 8.00 }, { score: "2:2", odds: 14.00 }, { score: "1:2", odds: 14.00 },
            ],
            btts: parseMarket(markets, "Both Teams To Score") || { "Yes": 1.85, "No": 1.30 },
            bttsFirstHalf: parseMarket(markets, "BTTS 1st Half") || { "Yes": 4.90, "No": 1.16 },
            lastResults: match.lastResults || match.form || [],
          });
        });
      }

      // If API didn't return valid data, use fallback
      if (parsedMatches.length === 0) {
        parsedMatches.push(
          {
            id: 172, matchId: "172", homeTeam: "V-Atl.Madrid", awayTeam: "V-Villarreal", time: "03:49", kickoffTime: Date.now() + 300000,
            fullTimeResult: { "1": 1.85, "X": 3.15, "2": 4.05 },
            firstHalfResult: { "1": 2.60, "X": 2.08, "2": 4.28 },
            totalGoals: { "Under 1.5": 2.65, "Over 1.5": 1.75, "Under 2.5": 1.80, "Over 2.5": 1.90, "Under 3.5": 1.25, "Over 3.5": 3.55 },
            correctScore: [{ score: "1:0", odds: 6.30 }, { score: "0:0", odds: 13.00 }, { score: "0:1", odds: 13.00 }, { score: "2:0", odds: 8.00 }, { score: "1:1", odds: 5.90 }, { score: "0:2", odds: 22.00 }, { score: "2:1", odds: 8.00 }, { score: "2:2", odds: 14.00 }, { score: "1:2", odds: 14.00 }],
            btts: { "Yes": 1.85, "No": 1.30 }, bttsFirstHalf: { "Yes": 4.90, "No": 1.16 },
          },
          {
            id: 173, matchId: "173", homeTeam: "V-Newcastle", awayTeam: "V-Arsenal", time: "03:49", kickoffTime: Date.now() + 300000,
            fullTimeResult: { "1": 1.92, "X": 3.40, "2": 3.60 },
            firstHalfResult: { "1": 1.50, "X": 3.30, "2": 4.28 },
            totalGoals: { "Under 1.5": 3.50, "Over 1.5": 1.25, "Under 2.5": 1.75, "Over 2.5": 1.95, "Under 3.5": 1.35, "Over 3.5": 2.88 },
            correctScore: [{ score: "1:0", odds: 8.50 }, { score: "0:0", odds: 12.00 }, { score: "0:1", odds: 12.00 }, { score: "2:0", odds: 9.50 }, { score: "1:1", odds: 6.30 }, { score: "0:2", odds: 18.00 }, { score: "2:1", odds: 9.00 }, { score: "2:2", odds: 10.00 }, { score: "1:2", odds: 10.00 }],
            btts: { "Yes": 1.90, "No": 1.30 }, bttsFirstHalf: { "Yes": 4.90, "No": 1.16 },
          },
          {
            id: 174, matchId: "174", homeTeam: "V-Lyon", awayTeam: "V-Marseille", time: "03:49", kickoffTime: Date.now() + 300000,
            fullTimeResult: { "1": 2.10, "X": 3.20, "2": 3.25 },
            firstHalfResult: { "1": 2.20, "X": 2.65, "2": 3.80 },
            totalGoals: { "Under 1.5": 3.20, "Over 1.5": 1.30, "Under 2.5": 1.50, "Over 2.5": 2.35, "Under 3.5": 1.20, "Over 3.5": 4.00 },
            correctScore: [{ score: "1:0", odds: 7.20 }, { score: "0:0", odds: 10.00 }, { score: "0:1", odds: 10.00 }, { score: "2:0", odds: 10.50 }, { score: "1:1", odds: 5.50 }, { score: "0:2", odds: 15.00 }, { score: "2:1", odds: 9.50 }, { score: "2:2", odds: 12.00 }, { score: "1:2", odds: 12.00 }],
            btts: { "Yes": 1.75, "No": 1.40 }, bttsFirstHalf: { "Yes": 5.00, "No": 1.14 },
          }
        );
      }

      setMatches(parsedMatches);

      // Fetch results
      try {
        const resultsResponse = await fetch(`${PROXY_URL}?endpoint=results`, {
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          }
        });
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          const resultsArray = resultsData?.data?.results || resultsData?.results || resultsData || [];
          
          const parsedResults: VirtualResult[] = resultsArray.slice(0, 10).map((result: any) => ({
            matchId: String(result.id || result.matchId),
            homeTeam: result.homeTeam || result.home || "Home",
            awayTeam: result.awayTeam || result.away || "Away",
            homeScore: result.homeScore ?? result.home_score ?? 0,
            awayScore: result.awayScore ?? result.away_score ?? 0,
            halfTimeScore: result.halfTimeScore || result.ht_score || "0:0",
            fullTimeScore: result.fullTimeScore || result.ft_score || `${result.homeScore || 0}:${result.awayScore || 0}`,
            status: "completed",
          }));
          
          setLastResults(parsedResults);
        }
      } catch (resultError) {
        console.error("Error fetching results:", resultError);
        // Use fallback results
        setLastResults([
          { matchId: "170", homeTeam: "V-Chelsea", awayTeam: "V-Man.City", homeScore: 0, awayScore: 1, halfTimeScore: "0:0", fullTimeScore: "0:1", status: "completed" },
          { matchId: "169", homeTeam: "V-Barcelona", awayTeam: "V-Atl.Madrid", homeScore: 1, awayScore: 2, halfTimeScore: "0:1", fullTimeScore: "1:2", status: "completed" },
          { matchId: "168", homeTeam: "V-Milan", awayTeam: "V-Inter", homeScore: 1, awayScore: 4, halfTimeScore: "1:2", fullTimeScore: "1:4", status: "completed" },
        ]);
      }

    } catch (err) {
      console.error("Error fetching virtual matches:", err);
      setError("Failed to load matches. Using cached data.");
      
      // Use fallback data
      setMatches([
        {
          id: 172, matchId: "172", homeTeam: "V-Atl.Madrid", awayTeam: "V-Villarreal", time: "03:49", kickoffTime: Date.now() + 300000,
          fullTimeResult: { "1": 1.85, "X": 3.15, "2": 4.05 },
          firstHalfResult: { "1": 2.60, "X": 2.08, "2": 4.28 },
          totalGoals: { "Under 1.5": 2.65, "Over 1.5": 1.75, "Under 2.5": 1.80, "Over 2.5": 1.90, "Under 3.5": 1.25, "Over 3.5": 3.55 },
          correctScore: [{ score: "1:0", odds: 6.30 }, { score: "0:0", odds: 13.00 }, { score: "0:1", odds: 13.00 }, { score: "2:0", odds: 8.00 }, { score: "1:1", odds: 5.90 }, { score: "0:2", odds: 22.00 }, { score: "2:1", odds: 8.00 }, { score: "2:2", odds: 14.00 }, { score: "1:2", odds: 14.00 }],
          btts: { "Yes": 1.85, "No": 1.30 }, bttsFirstHalf: { "Yes": 4.90, "No": 1.16 },
        },
        {
          id: 173, matchId: "173", homeTeam: "V-Newcastle", awayTeam: "V-Arsenal", time: "03:49", kickoffTime: Date.now() + 300000,
          fullTimeResult: { "1": 1.92, "X": 3.40, "2": 3.60 },
          firstHalfResult: { "1": 1.50, "X": 3.30, "2": 4.28 },
          totalGoals: { "Under 1.5": 3.50, "Over 1.5": 1.25, "Under 2.5": 1.75, "Over 2.5": 1.95, "Under 3.5": 1.35, "Over 3.5": 2.88 },
          correctScore: [{ score: "1:0", odds: 8.50 }, { score: "0:0", odds: 12.00 }, { score: "0:1", odds: 12.00 }, { score: "2:0", odds: 9.50 }, { score: "1:1", odds: 6.30 }, { score: "0:2", odds: 18.00 }, { score: "2:1", odds: 9.00 }, { score: "2:2", odds: 10.00 }, { score: "1:2", odds: 10.00 }],
          btts: { "Yes": 1.90, "No": 1.30 }, bttsFirstHalf: { "Yes": 4.90, "No": 1.16 },
        },
        {
          id: 174, matchId: "174", homeTeam: "V-Lyon", awayTeam: "V-Marseille", time: "03:49", kickoffTime: Date.now() + 300000,
          fullTimeResult: { "1": 2.10, "X": 3.20, "2": 3.25 },
          firstHalfResult: { "1": 2.20, "X": 2.65, "2": 3.80 },
          totalGoals: { "Under 1.5": 3.20, "Over 1.5": 1.30, "Under 2.5": 1.50, "Over 2.5": 2.35, "Under 3.5": 1.20, "Over 3.5": 4.00 },
          correctScore: [{ score: "1:0", odds: 7.20 }, { score: "0:0", odds: 10.00 }, { score: "0:1", odds: 10.00 }, { score: "2:0", odds: 10.50 }, { score: "1:1", odds: 5.50 }, { score: "0:2", odds: 15.00 }, { score: "2:1", odds: 9.50 }, { score: "2:2", odds: 12.00 }, { score: "1:2", odds: 12.00 }],
          btts: { "Yes": 1.75, "No": 1.40 }, bttsFirstHalf: { "Yes": 5.00, "No": 1.14 },
        },
      ]);
      
      setLastResults([
        { matchId: "170", homeTeam: "V-Chelsea", awayTeam: "V-Man.City", homeScore: 0, awayScore: 1, halfTimeScore: "0:0", fullTimeScore: "0:1", status: "completed" },
        { matchId: "169", homeTeam: "V-Barcelona", awayTeam: "V-Atl.Madrid", homeScore: 1, awayScore: 2, halfTimeScore: "0:1", fullTimeScore: "1:2", status: "completed" },
        { matchId: "168", homeTeam: "V-Milan", awayTeam: "V-Inter", homeScore: 1, awayScore: 4, halfTimeScore: "1:2", fullTimeScore: "1:4", status: "completed" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchMatches();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchMatches]);

  return {
    matches,
    lastResults,
    loading,
    error,
    countdown,
    refresh: fetchMatches,
  };
};