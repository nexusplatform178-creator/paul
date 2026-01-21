import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp, RefreshCw, Loader2, BarChart3 } from "lucide-react";
import { useBetslip } from "@/contexts/BetslipContext";
import { useHighlights, HighlightMatch } from "@/hooks/useHighlights";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import { useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import MatchDetailsDropdown from "./MatchDetailsDropdown";
import MatchStatsModal from "./MatchStatsModal";

interface OddsButtonProps {
  value: number | string;
  highlight?: "green" | "red" | "yellow";
  isSelected?: boolean;
  onClick?: () => void;
}

const OddsButton = ({ value, highlight, isSelected, onClick }: OddsButtonProps) => {
  const numValue = typeof value === 'number' && value > 0 ? value.toFixed(2) : "-";
  
  return (
    <button 
      onClick={onClick}
      className={`min-w-[48px] rounded px-2 py-1 text-center transition-all hover:scale-105 border ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : highlight === "green"
            ? "bg-primary/20 border-primary/50" 
            : highlight === "yellow"
              ? "bg-accent/20 border-accent/50"
              : highlight === "red"
                ? "bg-destructive/20 border-destructive/50"
                : "bg-secondary hover:bg-secondary/80 border-transparent"
      }`}
    >
      <span className={`text-xxs font-medium ${
        isSelected 
          ? "text-primary-foreground"
          : highlight === "green"
            ? "text-primary" 
            : highlight === "yellow"
              ? "text-accent"
              : highlight === "red"
                ? "text-destructive"
                : "text-foreground"
      }`}>
        {numValue}
      </span>
    </button>
  );
};

const OddsCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-1 py-1 text-center">
    {children}
  </td>
);

interface MatchRowProps {
  match: HighlightMatch;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  onShowStats: (match: HighlightMatch) => void;
}

const MatchRow = ({ match, expandedId, onToggleExpand, onShowStats }: MatchRowProps) => {
  const { selections, addSelection } = useBetslip();
  const { details, loading, error, fetchMatchDetails } = useMatchDetails();
  const matchId = `match-${match.match_id}`;
  const isExpanded = expandedId === match.match_id;

  const isSelected = (selectionId: string) => 
    selections.some((s) => s.id === selectionId);

  const handleOddClick = (e: React.MouseEvent, market: string, selection: string, oddsValue: number) => {
    e.stopPropagation();
    const selectionId = `${matchId}-${market}-${selection}`;
    addSelection({
      id: selectionId,
      matchId,
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      market,
      selection,
      odds: oddsValue,
    });
  };

  const handleRowClick = async () => {
    if (!isExpanded) {
      await fetchMatchDetails(match.match_id);
    }
    onToggleExpand(match.match_id);
  };

  const outcomes = match.highlight_market?.outcomes || [];
  const outcome1 = outcomes.find(o => o.alias === "1");
  const outcomeX = outcomes.find(o => o.alias === "X");
  const outcome2 = outcomes.find(o => o.alias === "2");

  const isLive = match.fixture_status?.status_name === "Live" || 
                 (match.fixture_status?.status !== 0 && match.fixture_status?.event_time);
  
  const matchDate = new Date(match.date);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  const timeDisplay = isLive 
    ? match.fixture_status?.event_time || "LIVE" 
    : isToday 
      ? format(matchDate, "HH:mm")
      : format(matchDate, "dd MMM");

  const matchDetails = details[match.match_id];

  return (
    <>
      <tr 
        className="border-b border-border hover:bg-row-hover transition-colors cursor-pointer"
        onClick={handleRowClick}
      >
        <td className="w-6 px-1">
          <Star className="w-3 h-3 text-muted-foreground" />
        </td>
        <td className="px-2 py-1 text-xxs w-16">
          {isLive ? (
            <span className="live-badge">{timeDisplay}</span>
          ) : (
            <span className="text-muted-foreground">{timeDisplay}</span>
          )}
          {!isToday && !isLive && (
            <div className="text-muted-foreground text-xxs">{format(matchDate, "HH:mm")}</div>
          )}
        </td>
        <td className="px-1 py-1 w-6">
          <span className="text-xxs">⚽</span>
        </td>
        <td className="px-2 py-1 min-w-[140px]">
          <div className="flex flex-col text-xxs">
            <span className="text-foreground">{match.home_team}</span>
            <span className="text-foreground">{match.away_team}</span>
          </div>
        </td>
        <td className="px-2 py-1 w-8 text-xxs">
          {isLive && match.fixture_status && (
            <div className="flex flex-col">
              <span className="text-primary">{match.fixture_status.home_score}</span>
              <span className="text-primary">{match.fixture_status.away_score}</span>
            </div>
          )}
        </td>
        <td className="px-2 py-1 w-20 text-xxs">
          <div className="flex items-center gap-1">
            <span className="text-odds-green">+{match.fixture_status?.markets || 0}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowStats(match);
              }}
              className="p-1 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
              title="View Statistics"
            >
              <BarChart3 className="w-3 h-3 text-white" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </td>
        <td className="w-px bg-border"></td>
        
        {/* 1X2 */}
        <OddsCell>
          {outcome1 && (
            <OddsButton 
              value={outcome1.odds} 
              isSelected={isSelected(`${matchId}-1X2-1`)}
              onClick={() => handleOddClick({} as React.MouseEvent, "1X2", "1", outcome1.odds)}
            />
          )}
        </OddsCell>
        <OddsCell>
          {outcomeX && (
            <OddsButton 
              value={outcomeX.odds}
              isSelected={isSelected(`${matchId}-1X2-X`)}
              onClick={() => handleOddClick({} as React.MouseEvent, "1X2", "X", outcomeX.odds)}
            />
          )}
        </OddsCell>
        <OddsCell>
          {outcome2 && (
            <OddsButton 
              value={outcome2.odds}
              isSelected={isSelected(`${matchId}-1X2-2`)}
              onClick={() => handleOddClick({} as React.MouseEvent, "1X2", "2", outcome2.odds)}
            />
          )}
        </OddsCell>
        
        <td className="w-px bg-border"></td>
        
        {/* Asian Handicap placeholder */}
        <td className="px-1 py-1 text-center">
          <span className="text-xxs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">-</span>
        </td>
        <OddsCell>
          <OddsButton value="-" />
        </OddsCell>
        <OddsCell>
          <OddsButton value="-" />
        </OddsCell>
        
        <td className="w-px bg-border"></td>
        
        {/* Asian Total placeholder */}
        <td className="px-1 py-1 text-center">
          <span className="text-xxs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">-</span>
        </td>
        <OddsCell>
          <OddsButton value="-" />
        </OddsCell>
        <OddsCell>
          <OddsButton value="-" />
        </OddsCell>
      </tr>
      
      {/* Expanded Details Row */}
      {isExpanded && (
        <tr>
          <td colSpan={20} className="p-0">
            <MatchDetailsDropdown
              matchId={match.match_id}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              markets={matchDetails?.markets || []}
              loading={loading[match.match_id] || false}
              error={error[match.match_id]}
            />
          </td>
        </tr>
      )}
    </>
  );
};

const TableHeader = () => (
  <tr className="bg-table-header text-xxs text-muted-foreground">
    <th className="px-1 py-1 text-left"></th>
    <th className="px-2 py-1 text-left"></th>
    <th className="px-1 py-1"></th>
    <th className="px-2 py-1 text-left"></th>
    <th className="px-2 py-1"></th>
    <th className="px-2 py-1 text-left"></th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-1 text-center" colSpan={3}>1 X 2</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-1 text-center" colSpan={3}>ASIAN HANDICAP</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-1 text-center" colSpan={3}>ASIAN TOTAL</th>
  </tr>
);

const LeagueHeader = ({ league, country, showRefresh = true }: { league: string; country: string; showRefresh?: boolean }) => (
  <tr className="bg-secondary/30">
    <td colSpan={20} className="px-2 py-1">
      <div className="flex items-center gap-2">
        <Star className="w-3 h-3 text-muted-foreground" />
        <span className="text-xxs text-muted-foreground">{country}</span>
        <span className="text-xxs text-foreground font-medium">{league}</span>
        {showRefresh && <RefreshCw className="w-2.5 h-2.5 text-muted-foreground ml-auto" />}
      </div>
    </td>
  </tr>
);

const SubTableHeader = () => (
  <tr className="text-xxs text-muted-foreground border-b border-border">
    <th className="px-1 py-0.5"></th>
    <th className="px-2 py-0.5"></th>
    <th className="px-1 py-0.5"></th>
    <th className="px-2 py-0.5"></th>
    <th className="px-2 py-0.5"></th>
    <th className="px-2 py-0.5"><RefreshCw className="w-2.5 h-2.5 inline" /> <ChevronDown className="w-2.5 h-2.5 inline" /></th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-0.5 text-center">1</th>
    <th className="px-2 py-0.5 text-center">X</th>
    <th className="px-2 py-0.5 text-center">2</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-0.5 text-center">Hcap</th>
    <th className="px-2 py-0.5 text-center">1</th>
    <th className="px-2 py-0.5 text-center">2</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-0.5 text-center">Total</th>
    <th className="px-2 py-0.5 text-center">O</th>
    <th className="px-2 py-0.5 text-center">U</th>
  </tr>
);

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

const OddsTable = () => {
  const { matches, loading, loadingMore, hasMore, loadMore, refresh, error } = useHighlights();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statsMatch, setStatsMatch] = useState<HighlightMatch | null>(null);

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

  const handleToggleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  if (loading && matches.length === 0) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load matches</p>
        <button onClick={refresh} className="text-primary hover:underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <div ref={scrollRef} className="hidden md:block flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <TableHeader />
          </thead>
          <tbody>
            {/* Highlights Section */}
            <tr className="bg-secondary/50">
              <td colSpan={20} className="px-2 py-1">
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xxs font-medium text-foreground">HIGHLIGHTS</span>
                  <span className="text-xxs text-muted-foreground">{matches.length}</span>
                  <button onClick={refresh} className="ml-auto">
                    <RefreshCw className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors" />
                  </button>
                </div>
              </td>
            </tr>
            
            {groupedMatches.map((group, idx) => (
              <React.Fragment key={`${group.tournament}-${idx}`}>
                <LeagueHeader league={group.tournament} country={group.country} />
                <SubTableHeader />
                {group.matches.map((match) => (
                  <MatchRow 
                    key={match.match_id} 
                    match={match}
                    expandedId={expandedId}
                    onToggleExpand={handleToggleExpand}
                    onShowStats={setStatsMatch}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Loading more indicator */}
            {loadingMore && (
              <tr>
                <td colSpan={20} className="py-4 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
                </td>
              </tr>
            )}

            {/* Load more trigger */}
            {hasMore && !loadingMore && (
              <tr>
                <td colSpan={20} className="py-2 text-center">
                  <button 
                    onClick={loadMore}
                    className="text-xxs text-primary hover:underline"
                  >
                    Load more matches
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Modal */}
      {statsMatch && (
        <MatchStatsModal
          matchId={statsMatch.match_id}
          isOpen={!!statsMatch}
          onClose={() => setStatsMatch(null)}
          homeTeam={statsMatch.home_team}
          awayTeam={statsMatch.away_team}
        />
      )}
    </>
  );
};

export default OddsTable;
