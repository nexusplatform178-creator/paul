import { useCallback, useEffect, useRef } from "react";
import MobileLeagueHeader from "./MobileLeagueHeader";
import MobileMatchCard from "./MobileMatchCard";
import { TrophyIcon } from "./icons/SportIcons";
import { useHighlights, HighlightMatch } from "@/hooks/useHighlights";
import { Loader2, RefreshCw } from "lucide-react";

// Group matches by tournament
const groupMatchesByTournament = (matches: HighlightMatch[]) => {
  const groups: Record<string, { tournament: string; country: string; matches: HighlightMatch[] }> = {};
  
  matches.forEach(match => {
    const key = `${match.tournament_id}-${match.tournament}`;
    if (!groups[key]) {
      groups[key] = {
        tournament: match.tournament,
        country: match.country,
        matches: [],
      };
    }
    groups[key].matches.push(match);
  });
  
  return Object.values(groups);
};

const MobileOddsTable = () => {
  const { matches, loading, loadingMore, hasMore, loadMore, refresh, error } = useHighlights();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 200 && hasMore && !loadingMore) {
      loadMore();
    }
  }, [hasMore, loadingMore, loadMore]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const groupedMatches = groupMatchesByTournament(matches);

  if (loading && matches.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center md:hidden">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 md:hidden">
        <p className="text-muted-foreground text-sm">Failed to load matches</p>
        <button onClick={refresh} className="text-primary hover:underline text-sm">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto md:hidden w-full scrollbar-thin pb-2"
    >
      {/* Refresh button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur px-3 py-2 flex items-center justify-between border-b border-border">
        <span className="text-xs text-muted-foreground">{matches.length} matches</span>
        <button 
          onClick={refresh}
          className="flex items-center gap-1 text-xs text-primary"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {groupedMatches.map((group, i) => (
        <div key={`${group.tournament}-${i}`}>
          <MobileLeagueHeader 
            flag={<TrophyIcon className="w-5 h-5 text-accent" />}
            country={group.country}
            league={group.tournament}
          />
          {group.matches.map((match) => {
            const outcomes = match.highlight_market?.outcomes || [];
            const outcome1 = outcomes.find(o => o.alias === "1");
            const outcomeX = outcomes.find(o => o.alias === "X");
            const outcome2 = outcomes.find(o => o.alias === "2");

            const isLive = match.fixture_status?.status_name === "Live" || 
                           (match.fixture_status?.status !== 0 && match.fixture_status?.event_time);
            
            const matchDate = new Date(match.date);
            const isToday = new Date().toDateString() === matchDate.toDateString();
            
            const formatTime = () => {
              if (isLive) return match.fixture_status?.event_time || "LIVE";
              const hours = matchDate.getHours().toString().padStart(2, '0');
              const minutes = matchDate.getMinutes().toString().padStart(2, '0');
              return `${hours}:${minutes}`;
            };

            return (
              <MobileMatchCard 
                key={match.match_id}
                matchId={`match-${match.match_id}`}
                time={formatTime()}
                isLive={!!isLive}
                liveMinute={isLive ? match.fixture_status?.event_time : undefined}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                homeScore={isLive ? parseInt(match.fixture_status?.home_score || "0") : undefined}
                awayScore={isLive ? parseInt(match.fixture_status?.away_score || "0") : undefined}
                position={`+${match.fixture_status?.markets || 0}`}
                odds={{
                  "1x2": {
                    "1": outcome1?.odds || 0,
                    x: outcomeX?.odds || 0,
                    "2": outcome2?.odds || 0,
                  },
                  handicap: { value: "-", home: 0, away: 0 },
                  total: { value: "-", over: 0, under: 0 },
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Loading more */}
      {loadingMore && (
        <div className="py-4 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}

      {/* Load more button */}
      {hasMore && !loadingMore && (
        <div className="py-4 flex justify-center">
          <button 
            onClick={loadMore}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
          >
            Load more matches
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileOddsTable;
