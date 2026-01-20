import { X, Trash2 } from "lucide-react";
import { useState } from "react";

export interface VirtualBetSelection {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  selection: string;
  odds: number;
}

interface VirtualBetslipProps {
  selections: VirtualBetSelection[];
  onRemoveSelection: (id: string) => void;
  onClearBetslip: () => void;
}

const VirtualBetslip = ({ selections, onRemoveSelection, onClearBetslip }: VirtualBetslipProps) => {
  const [stake, setStake] = useState(0);

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const potentialWinnings = stake * totalOdds;

  const handlePlaceBet = () => {
    if (selections.length === 0 || stake === 0) return;
    alert(`Virtual Bet placed! Stake: UGX ${stake.toLocaleString()} | Potential Win: UGX ${potentialWinnings.toLocaleString()}`);
    onClearBetslip();
    setStake(0);
  };

  return (
    <div className="border-t border-purple-500/20 flex flex-col mt-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">VIRTUAL BETSLIP</span>
          {selections.length > 0 && (
            <span className="bg-white/20 text-white text-xxs px-1.5 py-0.5 rounded-full font-bold">
              {selections.length}
            </span>
          )}
        </div>
        {selections.length > 0 && (
          <button
            onClick={onClearBetslip}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-white/80" />
          </button>
        )}
      </div>

      {/* Selections */}
      <div className="p-3 flex-1 overflow-y-auto max-h-48">
        {selections.length === 0 ? (
          <p className="text-center text-muted-foreground text-xs py-4">
            Your Virtual Ticket is empty
          </p>
        ) : (
          <div className="space-y-2">
            {selections.map((sel) => (
              <div key={sel.id} className="bg-secondary rounded-xl p-2 text-xs border border-purple-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{sel.homeTeam} vs {sel.awayTeam}</p>
                    <p className="text-purple-400 text-xxs mt-0.5">{sel.market}: {sel.selection}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-purple-400 font-semibold">{sel.odds.toFixed(2)}</span>
                    <button
                      onClick={() => onRemoveSelection(sel.id)}
                      className="p-0.5 hover:bg-background rounded"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {selections.length > 0 && (
        <div className="border-t border-purple-500/20 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Odds:</span>
            <span className="text-purple-400 font-bold">{totalOdds.toFixed(2)}</span>
          </div>
          
          <div>
            <label className="text-xxs text-muted-foreground mb-1 block">Stake (UGX)</label>
            <input
              type="number"
              placeholder="Enter stake"
              value={stake || ""}
              onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
              className="w-full bg-background border border-purple-500/30 rounded-xl px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Potential Win:</span>
            <span className="text-purple-400 font-bold">UGX {potentialWinnings.toLocaleString()}</span>
          </div>
          
          <button
            onClick={handlePlaceBet}
            disabled={stake === 0}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl text-xs font-bold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
          >
            Place Virtual Bet
          </button>
        </div>
      )}
    </div>
  );
};

export default VirtualBetslip;