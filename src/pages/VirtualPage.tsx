import { useState } from "react";
import { Play, Monitor, ChevronRight, Clock, TrendingUp, Volume2, RefreshCw, Loader2 } from "lucide-react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import VirtualBetslip from "@/components/VirtualBetslip";
import MobileVirtualBetslip from "@/components/MobileVirtualBetslip";
import { useVirtualMatches, VirtualMatch, VirtualResult } from "@/hooks/useVirtualMatches";
import { useVirtualBetslip, VirtualBetSelection } from "@/contexts/VirtualBetslipContext";

interface OddsCellProps {
  label: string;
  odds: number;
  matchId: string;
  market: string;
  match: VirtualMatch;
  selections: VirtualBetSelection[];
  onAddSelection: (selection: VirtualBetSelection) => void;
}

const OddsCell = ({ label, odds, matchId, market, match, selections, onAddSelection }: OddsCellProps) => {
  const isSelected = selections.some(
    s => s.matchId === matchId && s.market === market && s.selection === label
  );

  const handleClick = () => {
    onAddSelection({
      id: `${matchId}-${market}-${label}`,
      matchId: matchId,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      market,
      selection: label,
      odds,
      matchTime: match.time,
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
        isSelected
          ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
          : "bg-secondary hover:bg-secondary/80 text-foreground"
      }`}
    >
      <span className="text-muted-foreground mr-1">{label}</span>
      <span className={isSelected ? "" : "text-primary"}>{odds?.toFixed(2) || "0.00"}</span>
    </button>
  );
};

interface MatchCardProps {
  match: VirtualMatch;
  selections: VirtualBetSelection[];
  onAddSelection: (selection: VirtualBetSelection) => void;
}

const MatchCard = ({ match, selections, onAddSelection }: MatchCardProps) => {
  // Get last 3 results for this match if available
  const lastResults = match.lastResults || [];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground font-bold text-xs px-2 py-1 rounded-lg">
            {match.id}
          </span>
          <span className="text-foreground font-medium text-xs">
            {match.homeTeam} vs {match.awayTeam}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Last 3 Results */}
          {lastResults.length > 0 && (
            <div className="flex gap-0.5">
              {lastResults.slice(0, 3).map((result, idx) => (
                <span
                  key={idx}
                  className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${
                    result === 'W' ? 'bg-green-500 text-white' :
                    result === 'L' ? 'bg-red-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}
                >
                  {result}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-accent font-bold">
            <Clock className="w-3 h-3" />
            <span>{match.time}</span>
          </div>
        </div>
      </div>

      {/* Betting Markets */}
      <div className="p-3 space-y-3">
        {/* Full Time Result */}
        {match.fullTimeResult && Object.keys(match.fullTimeResult).length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">FULL TIME RESULT</div>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(match.fullTimeResult).map(([key, odds]) => (
                <OddsCell 
                  key={key} 
                  label={key} 
                  odds={odds} 
                  matchId={match.matchId} 
                  market="Full Time Result" 
                  match={match} 
                  selections={selections} 
                  onAddSelection={onAddSelection} 
                />
              ))}
            </div>
          </div>
        )}

        {/* 1st Half Result */}
        {match.firstHalfResult && Object.keys(match.firstHalfResult).length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">1ST HALF RESULT</div>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(match.firstHalfResult).map(([key, odds]) => (
                <OddsCell 
                  key={key} 
                  label={key} 
                  odds={odds} 
                  matchId={match.matchId} 
                  market="1st Half Result" 
                  match={match} 
                  selections={selections} 
                  onAddSelection={onAddSelection} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Total Goals */}
        {match.totalGoals && Object.keys(match.totalGoals).length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">TOTAL GOALS</div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(match.totalGoals).map(([key, odds]) => (
                <OddsCell 
                  key={key} 
                  label={key} 
                  odds={odds} 
                  matchId={match.matchId} 
                  market="Total Goals" 
                  match={match} 
                  selections={selections} 
                  onAddSelection={onAddSelection} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Correct Score */}
        {match.correctScore && match.correctScore.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">CORRECT SCORE</div>
            <div className="grid grid-cols-3 gap-1.5">
              {match.correctScore.map((item) => (
                <OddsCell 
                  key={item.score} 
                  label={item.score} 
                  odds={item.odds} 
                  matchId={match.matchId} 
                  market="Correct Score" 
                  match={match} 
                  selections={selections} 
                  onAddSelection={onAddSelection} 
                />
              ))}
            </div>
          </div>
        )}

        {/* BTTS */}
        {match.btts && Object.keys(match.btts).length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">BOTH TEAMS TO SCORE</div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(match.btts).map(([key, odds]) => (
                <OddsCell 
                  key={key} 
                  label={key} 
                  odds={odds} 
                  matchId={match.matchId} 
                  market="BTTS" 
                  match={match} 
                  selections={selections} 
                  onAddSelection={onAddSelection} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ResultCardProps {
  result: VirtualResult;
}

const ResultCard = ({ result }: ResultCardProps) => (
  <div className="bg-secondary px-3 py-2 rounded-xl text-xs flex items-center gap-2 min-w-fit">
    <span className="text-muted-foreground font-medium">{result.matchId}:</span>
    <span className="text-foreground">{result.homeTeam}</span>
    <span className="bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-lg">
      {result.fullTimeScore}
    </span>
    <span className="text-foreground">{result.awayTeam}</span>
  </div>
);

const VirtualPage = () => {
  const [activeTab, setActiveTab] = useState<"stream" | "tracklist">("stream");
  const { matches, lastResults, loading, error, countdown, refresh } = useVirtualMatches();
  const { selections, addSelection, removeSelection, clearBetslip } = useVirtualBetslip();

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-purple-900/50 to-secondary border-b border-purple-500/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-muted-foreground">Next match:</span>
            <span className="text-purple-400 font-bold">{formatCountdown(countdown)}</span>
          </div>
          <button 
            onClick={refresh}
            className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-400" />
          <span className="text-foreground font-bold">VIRTUAL SOCCER</span>
        </div>
        <div className="text-xs text-muted-foreground hidden md:block">
          New match <span className="text-purple-400 font-medium">every 5 minutes!</span>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-destructive text-xs">
          {error}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - Matches Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && matches.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => (
                  <MatchCard 
                    key={match.matchId} 
                    match={match} 
                    selections={selections}
                    onAddSelection={addSelection}
                  />
                ))}
              </div>

              {/* Last Results */}
              <div className="mt-6 bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-foreground">RESULTS</span>
                  </div>
                  <button className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {lastResults.map((result) => (
                    <ResultCard key={result.matchId} result={result} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Stream & Betslip */}
        <div className="hidden lg:flex w-80 border-l border-purple-500/20 flex-col bg-card">
          {/* Stream/Tracklist Tabs */}
          <div className="flex border-b border-purple-500/20">
            <button
              onClick={() => setActiveTab("stream")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "stream"
                  ? "bg-purple-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              STREAM
            </button>
            <button
              onClick={() => setActiveTab("tracklist")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "tracklist"
                  ? "bg-purple-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TRACKLIST
            </button>
          </div>

          {/* Stream View */}
          {activeTab === "stream" && (
            <div className="p-3 space-y-3">
              {/* Video placeholder */}
              <div className="aspect-video bg-background rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-900/30" />
                <div className="text-center z-10">
                  <Monitor className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Live Stream</p>
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 bg-purple-500/20 rounded-lg">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                </button>
              </div>

              {/* Next Match Info */}
              {matches[0] && (
                <div className="bg-gradient-to-r from-purple-900/30 to-secondary rounded-xl p-3 border border-purple-500/20">
                  <div className="text-xs text-muted-foreground mb-1">Next match: #{matches[0].id}</div>
                  <div className="text-sm font-medium text-foreground mb-2">
                    {matches[0].homeTeam} vs {matches[0].awayTeam}
                  </div>
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
                    <Clock className="w-4 h-4" />
                    {formatCountdown(countdown)}
                  </div>
                </div>
              )}

              {/* Predictions */}
              <div className="bg-secondary/50 rounded-xl p-3 space-y-2 border border-purple-500/10">
                <div className="text-xs font-medium text-foreground mb-2">Predictions</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Home</span>
                  <div className="flex-1 mx-2 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: "45%" }} />
                  </div>
                  <span className="text-foreground">45%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Draw</span>
                  <div className="flex-1 mx-2 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500" style={{ width: "28%" }} />
                  </div>
                  <span className="text-foreground">28%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Away</span>
                  <div className="flex-1 mx-2 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-purple-300" style={{ width: "27%" }} />
                  </div>
                  <span className="text-foreground">27%</span>
                </div>
              </div>

              <button className="w-full bg-purple-500/20 text-purple-400 text-xs font-medium py-2 rounded-xl hover:bg-purple-500/30 transition-colors border border-purple-500/20">
                EXPAND STREAM
              </button>
            </div>
          )}

          {/* Tracklist View */}
          {activeTab === "tracklist" && (
            <div className="p-3">
              <div className="text-center text-muted-foreground text-xs py-8">
                Tracklist coming soon
              </div>
            </div>
          )}

          {/* Virtual Betslip - Under Stream */}
          <VirtualBetslip 
            selections={selections}
            onRemoveSelection={removeSelection}
            onClearBetslip={clearBetslip}
          />
        </div>
      </div>

      {/* Mobile Virtual Betslip Sheet */}
      <MobileVirtualBetslip />

      <div className="h-16 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default VirtualPage;
