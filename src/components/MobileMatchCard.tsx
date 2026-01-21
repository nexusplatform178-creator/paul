import { useState } from "react";
import { useBetslip } from "@/contexts/BetslipContext";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import MatchDetailsDropdown from "./MatchDetailsDropdown";
import MatchStatsModal from "./MatchStatsModal";

interface MobileMatchCardProps {
  matchId: string;
  numericMatchId?: number;
  time: string;
  isLive?: boolean;
  liveMinute?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  odds: {
    "1x2": { "1": number; x: number; "2": number };
    handicap: { value: string; home: number; away: number };
    total: { value: string; over: number; under: number };
  };
  position?: string;
  highlightColor?: "green" | "red" | "yellow";
}

const MobileMatchCard = ({
  matchId,
  numericMatchId,
  time,
  isLive,
  liveMinute,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  odds,
  position,
  highlightColor,
}: MobileMatchCardProps) => {
  const { selections, addSelection } = useBetslip();
  const [expanded, setExpanded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { details, loading, error, fetchMatchDetails } = useMatchDetails();

  const isSelected = (selectionId: string) => 
    selections.some((s) => s.id === selectionId);

  const handleOddClick = (e: React.MouseEvent, market: string, selection: string, oddsValue: number) => {
    e.stopPropagation();
    const selectionId = `${matchId}-${market}-${selection}`;
    addSelection({
      id: selectionId,
      matchId,
      homeTeam,
      awayTeam,
      market,
      selection,
      odds: oddsValue,
    });
  };

  const handleExpand = async () => {
    if (!expanded && numericMatchId) {
      await fetchMatchDetails(numericMatchId);
    }
    setExpanded(!expanded);
  };

  const handleStatsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStats(true);
  };

  const matchDetails = numericMatchId ? details[numericMatchId] : null;

  return (
    <>
      <div className="border-b border-border bg-card">
        {/* Match Info Row - Clickable */}
        <div 
          className="flex items-center justify-between px-3 py-2 cursor-pointer active:bg-secondary/50 transition-colors"
          onClick={handleExpand}
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Time */}
            <div className="w-10 text-center">
              {isLive ? (
                <div className="flex flex-col items-center">
                  <span className="text-xxs text-live-red font-medium">{liveMinute}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-live-red animate-pulse mt-0.5"></span>
                </div>
              ) : (
                <span className="text-xxs text-muted-foreground">{time}</span>
              )}
            </div>
            
            {/* Teams & Score */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xxs text-foreground truncate flex-1">{homeTeam}</span>
                {homeScore !== undefined && (
                  <span className={`text-xs font-semibold min-w-[16px] text-right ${
                    isLive ? "text-primary" : "text-foreground"
                  }`}>
                    {homeScore}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-xxs text-foreground truncate flex-1">{awayTeam}</span>
                {awayScore !== undefined && (
                  <span className={`text-xs font-semibold min-w-[16px] text-right ${
                    isLive ? "text-primary" : "text-foreground"
                  }`}>
                    {awayScore}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 ml-2">
            {position && (
              <span className="text-xxs text-primary font-medium">{position}</span>
            )}
            {/* Stats Button */}
            {numericMatchId && (
              <button 
                onClick={handleStatsClick}
                className="w-7 h-7 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5 text-white" />
              </button>
            )}
            {/* Expand Button */}
            <button className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-accent-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-accent-foreground" />
              )}
            </button>
          </div>
        </div>
        
        {/* Odds Row */}
        <div className="flex items-stretch gap-2 px-3 pb-2">
          {/* 1X2 */}
          <div className="flex-1">
            <div className="text-[8px] text-muted-foreground mb-1 text-center uppercase tracking-wide">1 X 2</div>
            <div className="flex gap-0.5">
              <OddsButton 
                value={odds["1x2"]["1"]} 
                isSelected={isSelected(`${matchId}-1X2-1`)}
                highlight={highlightColor === "green"}
                onClick={(e) => handleOddClick(e, "1X2", "1", odds["1x2"]["1"])}
              />
              <OddsButton 
                value={odds["1x2"].x}
                isSelected={isSelected(`${matchId}-1X2-X`)}
                onClick={(e) => handleOddClick(e, "1X2", "X", odds["1x2"].x)}
              />
              <OddsButton 
                value={odds["1x2"]["2"]}
                isSelected={isSelected(`${matchId}-1X2-2`)}
                onClick={(e) => handleOddClick(e, "1X2", "2", odds["1x2"]["2"])}
              />
            </div>
          </div>
          
          {/* Asian Handicap */}
          <div className="flex-1">
            <div className="text-[8px] text-muted-foreground mb-1 text-center uppercase tracking-wide">Asian Hcap</div>
            <div className="flex gap-0.5">
              <div className="flex-shrink-0 bg-secondary/30 rounded px-1.5 py-1 text-center flex items-center justify-center">
                <span className="text-[9px] text-muted-foreground">{odds.handicap.value}</span>
              </div>
              {odds.handicap.home > 0 && (
                <>
                  <OddsButton 
                    value={odds.handicap.home}
                    isSelected={isSelected(`${matchId}-Handicap-Home`)}
                    onClick={(e) => handleOddClick(e, "Handicap", "Home", odds.handicap.home)}
                  />
                  <OddsButton 
                    value={odds.handicap.away}
                    isSelected={isSelected(`${matchId}-Handicap-Away`)}
                    onClick={(e) => handleOddClick(e, "Handicap", "Away", odds.handicap.away)}
                  />
                </>
              )}
            </div>
          </div>

          {/* Asian Total */}
          <div className="flex-1">
            <div className="text-[8px] text-muted-foreground mb-1 text-center uppercase tracking-wide">Asian Total</div>
            <div className="flex gap-0.5">
              <div className="flex-shrink-0 bg-secondary/30 rounded px-1.5 py-1 text-center flex items-center justify-center">
                <span className="text-[9px] text-muted-foreground">{odds.total.value}</span>
              </div>
              {odds.total.over > 0 && (
                <>
                  <OddsButton 
                    value={odds.total.over}
                    isSelected={isSelected(`${matchId}-Total-Over`)}
                    onClick={(e) => handleOddClick(e, "Total", "Over", odds.total.over)}
                  />
                  <OddsButton 
                    value={odds.total.under}
                    isSelected={isSelected(`${matchId}-Total-Under`)}
                    onClick={(e) => handleOddClick(e, "Total", "Under", odds.total.under)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Markets */}
        {expanded && numericMatchId && (
          <MatchDetailsDropdown
            matchId={numericMatchId}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            markets={matchDetails?.markets || []}
            loading={loading[numericMatchId] || false}
            error={error[numericMatchId]}
          />
        )}
      </div>

      {/* Stats Modal */}
      {numericMatchId && (
        <MatchStatsModal
          matchId={numericMatchId}
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
    </>
  );
};

interface OddsButtonProps {
  value: number;
  highlight?: boolean;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const OddsButton = ({ value, highlight, isSelected, onClick }: OddsButtonProps) => (
  <button 
    onClick={onClick}
    className={`flex-1 rounded px-1 py-1 text-center transition-all active:scale-95 border ${
      isSelected
        ? "bg-primary text-primary-foreground border-primary"
        : highlight 
          ? "bg-primary/20 border-primary/50" 
          : "bg-secondary hover:bg-secondary/80 border-transparent"
    }`}
  >
    <span className={`text-[10px] font-medium ${
      isSelected 
        ? "text-primary-foreground"
        : highlight 
          ? "text-primary" 
          : "text-foreground"
    }`}>
      {value > 0 ? value.toFixed(2) : "-"}
    </span>
  </button>
);

export default MobileMatchCard;
