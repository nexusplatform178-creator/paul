import { Loader2 } from "lucide-react";
import { useBetslip } from "@/contexts/BetslipContext";
import { Market } from "@/hooks/useMatchDetails";

interface MatchDetailsDropdownProps {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  markets: Market[];
  loading: boolean;
  error?: string;
}

const MatchDetailsDropdown = ({ 
  matchId, 
  homeTeam, 
  awayTeam, 
  markets, 
  loading, 
  error 
}: MatchDetailsDropdownProps) => {
  const { selections, addSelection } = useBetslip();
  const matchIdStr = `match-${matchId}`;

  const isSelected = (selectionId: string) => 
    selections.some((s) => s.id === selectionId);

  const handleOddClick = (marketName: string, outcomeName: string, odds: number) => {
    const selectionId = `${matchIdStr}-${marketName}-${outcomeName}`;
    addSelection({
      id: selectionId,
      matchId: matchIdStr,
      homeTeam,
      awayTeam,
      market: marketName,
      selection: outcomeName,
      odds,
    });
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-muted-foreground text-xs">
        Failed to load markets
      </div>
    );
  }

  if (!markets || markets.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-xs">
        No markets available
      </div>
    );
  }

  // Group markets by category
  const groupedMarkets: Record<string, Market[]> = {};
  markets.forEach(market => {
    const category = market.market_name.split(' ')[0] || 'Other';
    if (!groupedMarkets[category]) {
      groupedMarkets[category] = [];
    }
    groupedMarkets[category].push(market);
  });

  return (
    <div className="bg-secondary/30 border-t border-border max-h-[400px] overflow-y-auto">
      <div className="grid gap-2 p-3">
        {markets.slice(0, 20).map((market, idx) => (
          <div key={`${market.market_id}-${idx}`} className="bg-card rounded-lg p-2">
            <div className="text-[10px] text-muted-foreground mb-2 font-medium uppercase">
              {market.market_name}
              {market.specifier && (
                <span className="ml-1 text-primary">({market.specifier})</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {market.outcomes.map((outcome) => {
                const selectionId = `${matchIdStr}-${market.market_name}-${outcome.outcome_name}`;
                const selected = isSelected(selectionId);
                
                return (
                  <button
                    key={outcome.outcome_id}
                    onClick={() => handleOddClick(market.market_name, outcome.outcome_name, outcome.odds)}
                    disabled={outcome.active !== 1}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all border ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : outcome.active === 1
                          ? "bg-secondary hover:bg-secondary/80 border-transparent"
                          : "bg-muted text-muted-foreground border-transparent opacity-50"
                    }`}
                  >
                    <span className="text-muted-foreground">{outcome.outcome_name}</span>
                    <span className={`font-semibold ${selected ? "text-primary-foreground" : "text-foreground"}`}>
                      {outcome.odds.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        {markets.length > 20 && (
          <div className="text-center text-xs text-muted-foreground py-2">
            +{markets.length - 20} more markets
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsDropdown;
