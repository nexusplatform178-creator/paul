import { useState, useCallback } from 'react';

export interface MarketOutcome {
  alias: string;
  outcome_name: string;
  outcome_id: string;
  odds: number;
  active: number;
  probability: number;
}

export interface Market {
  market_name: string;
  market_id: number;
  specifier: string;
  status_name: string;
  status: number;
  outcomes: MarketOutcome[];
  handicap: boolean;
}

export interface MatchDetails {
  match_id: number;
  name: string;
  home_team: string;
  away_team: string;
  date: string;
  tournament: string;
  country: string;
  markets: Market[];
}

export const useMatchDetails = () => {
  const [details, setDetails] = useState<Record<number, MatchDetails>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<Record<number, string>>({});

  const fetchMatchDetails = useCallback(async (matchId: number) => {
    if (details[matchId] || loading[matchId]) {
      return details[matchId];
    }

    setLoading(prev => ({ ...prev, [matchId]: true }));
    setError(prev => ({ ...prev, [matchId]: '' }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-details-proxy?match_id=${matchId}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch match details');
      }

      const result = await response.json();
      setDetails(prev => ({ ...prev, [matchId]: result }));
      return result;
    } catch (err) {
      console.error('Error fetching match details:', err);
      setError(prev => ({ 
        ...prev, 
        [matchId]: err instanceof Error ? err.message : 'Failed to fetch' 
      }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [matchId]: false }));
    }
  }, [details, loading]);

  return {
    details,
    loading,
    error,
    fetchMatchDetails,
  };
};
