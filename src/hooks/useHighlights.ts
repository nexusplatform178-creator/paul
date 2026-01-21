import { useState, useEffect, useCallback, useRef } from 'react';

export interface HighlightOutcome {
  alias: string;
  outcome_name: string;
  outcome_id: string;
  odds: number;
  active: number;
}

export interface HighlightMarket {
  market_name: string;
  market_id: number;
  specifier: string;
  status_name: string;
  status: number;
  outcomes: HighlightOutcome[];
}

export interface FixtureStatus {
  event_id: number;
  status: number;
  status_name: string;
  home_score: string;
  away_score: string;
  match_status: string;
  event_time: string;
  markets: number;
}

export interface HighlightMatch {
  match_id: number;
  name: string;
  home_team: string;
  away_team: string;
  date: string;
  tournament: string;
  tournament_id: number;
  country: string;
  category_id: number;
  sport_id: number;
  highlight_market: HighlightMarket;
  fixture_status: FixtureStatus;
}

export interface HighlightsResponse {
  total: number;
  remaining_records: number;
  last_page: number;
  from: number;
  to: number;
  data: HighlightMatch[];
}

export const useHighlights = () => {
  const [matches, setMatches] = useState<HighlightMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadedIdsRef = useRef<Set<number>>(new Set());

  const fetchHighlights = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        loadedIdsRef.current.clear();
      }
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/highlights-proxy?page=${pageNum}&per_page=10`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch highlights');
      }

      const result: HighlightsResponse = await response.json();
      
      if (result.data) {
        // Filter out duplicates
        const newMatches = result.data.filter(match => {
          if (loadedIdsRef.current.has(match.match_id)) {
            return false;
          }
          loadedIdsRef.current.add(match.match_id);
          return true;
        });

        if (append) {
          setMatches(prev => [...prev, ...newMatches]);
        } else {
          setMatches(newMatches);
        }
        setHasMore(pageNum < result.last_page);
      }
    } catch (err) {
      console.error('Error fetching highlights:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchHighlights(1, false);
  }, [fetchHighlights]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      pageRef.current += 1;
      fetchHighlights(pageRef.current, true);
    }
  }, [loadingMore, hasMore, fetchHighlights]);

  const refresh = useCallback(() => {
    pageRef.current = 1;
    setMatches([]);
    fetchHighlights(1, false);
  }, [fetchHighlights]);

  return {
    matches,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
