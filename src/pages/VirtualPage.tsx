import { useState } from "react";
import { Play, Monitor, ChevronRight, Clock, TrendingUp, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import VirtualBetslip, { VirtualBetSelection } from "@/components/VirtualBetslip";

// Virtual match data
const virtualMatches = [
  {
    id: 172,
    homeTeam: "V-Atl.Madrid",
    awayTeam: "V-Villarreal",
    time: "01:49",
    fullTimeResult: { "1": 1.85, "X": 3.15, "2": 4.05 },
    firstHalfResult: { "1": 2.60, "X": 2.08, "2": 4.28 },
    totalGoals: {
      "Under 1.5": 2.65, "Over 1.5": 1.75,
      "Under 2.5": 1.80, "Over 2.5": 1.90,
      "Under 3.5": 1.25, "Over 3.5": 3.55,
      "Under 4.5": 1.10, "Over 4.5": 6.80,
    },
    correctScore: [
      { score: "1:0", odds: 6.30 }, { score: "0:0", odds: 13.00 }, { score: "0:1", odds: 13.00 },
      { score: "2:0", odds: 8.00 }, { score: "1:1", odds: 5.90 }, { score: "0:2", odds: 22.00 },
      { score: "2:1", odds: 8.00 }, { score: "2:2", odds: 14.00 }, { score: "1:2", odds: 14.00 },
    ],
    btts: { "Yes": 1.85, "No": 1.30 },
    bttsFirstHalf: { "Yes": 4.90, "No": 1.16 },
  },
  {
    id: 173,
    homeTeam: "V-Newcastle",
    awayTeam: "V-Arsenal",
    time: "01:49",
    fullTimeResult: { "1": 1.92, "X": 3.40, "2": 3.60 },
    firstHalfResult: { "1": 1.50, "X": 3.30, "2": 4.28 },
    totalGoals: {
      "Under 1.5": 3.50, "Over 1.5": 1.25,
      "Under 2.5": 1.75, "Over 2.5": 1.95,
      "Under 3.5": 1.35, "Over 3.5": 2.88,
      "Under 4.5": 1.08, "Over 4.5": 6.25,
    },
    correctScore: [
      { score: "1:0", odds: 8.50 }, { score: "0:0", odds: 12.00 }, { score: "0:1", odds: 12.00 },
      { score: "2:0", odds: 9.50 }, { score: "1:1", odds: 6.30 }, { score: "0:2", odds: 18.00 },
      { score: "2:1", odds: 9.00 }, { score: "2:2", odds: 10.00 }, { score: "1:2", odds: 10.00 },
    ],
    btts: { "Yes": 1.90, "No": 1.30 },
    bttsFirstHalf: { "Yes": 4.90, "No": 1.16 },
  },
  {
    id: 174,
    homeTeam: "V-Lyon",
    awayTeam: "V-Marseille",
    time: "01:49",
    fullTimeResult: { "1": 2.10, "X": 3.20, "2": 3.25 },
    firstHalfResult: { "1": 2.20, "X": 2.65, "2": 3.80 },
    totalGoals: {
      "Under 1.5": 3.20, "Over 1.5": 1.30,
      "Under 2.5": 1.50, "Over 2.5": 2.35,
      "Under 3.5": 1.20, "Over 3.5": 4.00,
      "Under 4.5": 1.05, "Over 4.5": 7.50,
    },
    correctScore: [
      { score: "1:0", odds: 7.20 }, { score: "0:0", odds: 10.00 }, { score: "0:1", odds: 10.00 },
      { score: "2:0", odds: 10.50 }, { score: "1:1", odds: 5.50 }, { score: "0:2", odds: 15.00 },
      { score: "2:1", odds: 9.50 }, { score: "2:2", odds: 12.00 }, { score: "1:2", odds: 12.00 },
    ],
    btts: { "Yes": 1.75, "No": 1.40 },
    bttsFirstHalf: { "Yes": 5.00, "No": 1.14 },
  },
];

const lastResults = [
  { id: 170, home: "V-Chelsea", away: "V-Man.City", score: "0:1" },
  { id: 169, home: "V-Barcelona", away: "V-Atl.Madrid", score: "1:2" },
  { id: 168, home: "V-Milan", away: "V-Inter", score: "1:4" },
];

interface OddsCellProps {
  label: string;
  odds: number;
  matchId: number;
  market: string;
  match: typeof virtualMatches[0];
  selections: VirtualBetSelection[];
  onAddSelection: (selection: VirtualBetSelection) => void;
  onRemoveSelection: (id: string) => void;
}

const OddsCell = ({ label, odds, matchId, market, match, selections, onAddSelection, onRemoveSelection }: OddsCellProps) => {
  const isSelected = selections.some(
    s => s.matchId === String(matchId) && s.market === market && s.selection === label
  );

  const handleClick = () => {
    if (isSelected) {
      const selection = selections.find(
        s => s.matchId === String(matchId) && s.market === market && s.selection === label
      );
      if (selection) onRemoveSelection(selection.id);
    } else {
      onAddSelection({
        id: `${matchId}-${market}-${label}`,
        matchId: String(matchId),
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        market,
        selection: label,
        odds,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary hover:bg-secondary/80 text-foreground"
      }`}
    >
      <span className="text-muted-foreground mr-1">{label}</span>
      <span className={isSelected ? "" : "text-primary"}>{odds.toFixed(2)}</span>
    </button>
  );
};

interface MatchCardProps {
  match: typeof virtualMatches[0];
  selections: VirtualBetSelection[];
  onAddSelection: (selection: VirtualBetSelection) => void;
  onRemoveSelection: (id: string) => void;
}

const MatchCard = ({ match, selections, onAddSelection, onRemoveSelection }: MatchCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Match Header */}
      <div className="bg-primary/10 border-b border-border px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-sm">{match.id}</span>
          <span className="text-foreground font-medium text-xs">
            {match.homeTeam} vs {match.awayTeam}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{match.time}</span>
        </div>
      </div>

      {/* Betting Markets */}
      <div className="p-3 space-y-3">
        {/* Full Time Result */}
        <div>
          <div className="text-xs text-muted-foreground mb-1.5 font-medium">FULL TIME RESULT</div>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(match.fullTimeResult).map(([key, odds]) => (
              <OddsCell key={key} label={key} odds={odds} matchId={match.id} market="Full Time Result" match={match} selections={selections} onAddSelection={onAddSelection} onRemoveSelection={onRemoveSelection} />
            ))}
          </div>
        </div>

        {/* 1st Half Result */}
        <div>
          <div className="text-xs text-muted-foreground mb-1.5 font-medium">1ST HALF RESULT</div>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(match.firstHalfResult).map(([key, odds]) => (
              <OddsCell key={key} label={key} odds={odds} matchId={match.id} market="1st Half Result" match={match} selections={selections} onAddSelection={onAddSelection} onRemoveSelection={onRemoveSelection} />
            ))}
          </div>
        </div>

        {/* Total Goals */}
        <div>
          <div className="text-xs text-muted-foreground mb-1.5 font-medium">TOTAL GOALS</div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(match.totalGoals).map(([key, odds]) => (
              <OddsCell key={key} label={key} odds={odds} matchId={match.id} market="Total Goals" match={match} selections={selections} onAddSelection={onAddSelection} onRemoveSelection={onRemoveSelection} />
            ))}
          </div>
        </div>

        {/* Correct Score */}
        <div>
          <div className="text-xs text-muted-foreground mb-1.5 font-medium">CORRECT SCORE</div>
          <div className="grid grid-cols-3 gap-1.5">
            {match.correctScore.map((item) => (
              <OddsCell key={item.score} label={item.score} odds={item.odds} matchId={match.id} market="Correct Score" match={match} selections={selections} onAddSelection={onAddSelection} onRemoveSelection={onRemoveSelection} />
            ))}
          </div>
          <button className="text-xs text-primary mt-1.5 hover:underline">Any other result</button>
        </div>

        {/* BTTS */}
        <div>
          <div className="text-xs text-muted-foreground mb-1.5 font-medium">BOTH TEAMS TO SCORE: FULL TIME</div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(match.btts).map(([key, odds]) => (
              <OddsCell key={key} label={key} odds={odds} matchId={match.id} market="BTTS Full Time" match={match} selections={selections} onAddSelection={onAddSelection} onRemoveSelection={onRemoveSelection} />
            ))}
          </div>
        </div>

        {/* BTTS 1st Half */}
        <div>
          <div className="text-xs text-muted-foreground mb-1.5 font-medium">BOTH TEAMS TO SCORE: 1ST HALF</div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(match.bttsFirstHalf).map(([key, odds]) => (
              <OddsCell key={key} label={key} odds={odds} matchId={match.id} market="BTTS 1st Half" match={match} selections={selections} onAddSelection={onAddSelection} onRemoveSelection={onRemoveSelection} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const VirtualPage = () => {
  const [activeTab, setActiveTab] = useState<"stream" | "tracklist">("stream");
  const [virtualSelections, setVirtualSelections] = useState<VirtualBetSelection[]>([]);

  const addVirtualSelection = (selection: VirtualBetSelection) => {
    setVirtualSelections((prev) => {
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

  const removeVirtualSelection = (id: string) => {
    setVirtualSelections((prev) => prev.filter((s) => s.id !== id));
  };

  const clearVirtualBetslip = () => {
    setVirtualSelections([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      {/* Top Bar */}
      <div className="bg-secondary border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Time to kickoff:</span>
            <span className="text-accent font-bold">01:48</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          <span className="text-foreground font-bold">VIRTUAL SOCCER</span>
        </div>
        <div className="text-xs text-muted-foreground">
          New match <span className="text-primary font-medium">every 5 minutes!</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - Matches Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {virtualMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                selections={virtualSelections}
                onAddSelection={addVirtualSelection}
                onRemoveSelection={removeVirtualSelection}
              />
            ))}
          </div>

          {/* Last Results */}
          <div className="mt-6 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">LAST 3 RESULTS</span>
              </div>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {lastResults.map((result) => (
                <div 
                  key={result.id}
                  className="bg-secondary px-3 py-1.5 rounded text-xs"
                >
                  <span className="text-muted-foreground">{result.id}: </span>
                  <span className="text-foreground">{result.home} vs {result.away}</span>
                  <span className="text-primary font-medium ml-2">{result.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Stream & Betslip */}
        <div className="hidden lg:flex w-80 border-l border-border flex-col bg-card">
          {/* Stream/Tracklist Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("stream")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "stream"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              STREAM
            </button>
            <button
              onClick={() => setActiveTab("tracklist")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "tracklist"
                  ? "bg-primary text-primary-foreground"
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
              <div className="aspect-video bg-background rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                <div className="text-center z-10">
                  <Monitor className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Live Stream</p>
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 bg-secondary rounded">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Next Match Info */}
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Next match: #{virtualMatches[0].id}</div>
                <div className="text-sm font-medium text-foreground mb-2">
                  {virtualMatches[0].homeTeam} - {virtualMatches[0].awayTeam}
                </div>
                <div className="flex items-center gap-2 text-accent font-bold text-lg">
                  <Clock className="w-4 h-4" />
                  01:49
                </div>
              </div>

              {/* Predictions */}
              <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-foreground mb-2">Predictions</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Home</span>
                  <div className="flex-1 mx-2 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "45%" }} />
                  </div>
                  <span className="text-foreground">45%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Draw</span>
                  <div className="flex-1 mx-2 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground" style={{ width: "28%" }} />
                  </div>
                  <span className="text-foreground">28%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Away</span>
                  <div className="flex-1 mx-2 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "27%" }} />
                  </div>
                  <span className="text-foreground">27%</span>
                </div>
              </div>

              {/* Last Meetings */}
              <div className="text-xs">
                <div className="text-muted-foreground mb-1">Last meetings:</div>
                <div className="text-foreground">average 4.4 goals per match</div>
              </div>

              <button className="w-full bg-primary/20 text-primary text-xs font-medium py-2 rounded hover:bg-primary/30 transition-colors">
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

          {/* Virtual Betslip */}
          <VirtualBetslip 
            selections={virtualSelections}
            onRemoveSelection={removeVirtualSelection}
            onClearBetslip={clearVirtualBetslip}
          />
        </div>
      </div>

      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default VirtualPage;
