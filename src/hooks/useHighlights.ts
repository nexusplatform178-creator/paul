import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastPage, setLastPage] = useState(1);

  const fetchHighlights = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke('highlights-proxy', {
        body: null,
        headers: {},
      });

      // Use query params approach
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
        if (append) {
          setMatches(prev => [...prev, ...result.data]);
        } else {
          setMatches(result.data);
        }
        setLastPage(result.last_page);
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
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHighlights(nextPage, true);
    }
  }, [page, loadingMore, hasMore, fetchHighlights]);

  const refresh = useCallback(() => {
    setPage(1);
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
