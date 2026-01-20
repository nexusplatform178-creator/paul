import { X, Trash2 } from "lucide-react";
import { useBetslip } from "@/contexts/BetslipContext";

const Betslip = () => {
  const {
    selections,
    removeSelection,
    clearBetslip,
    stake,
    setStake,
    totalOdds,
    potentialWinnings,
    isOpen,
    setIsOpen,
  } = useBetslip();

  const handlePlaceBet = () => {
    if (selections.length === 0 || stake === 0) return;
    alert(`Bet placed! Stake: UGX ${stake.toLocaleString()} | Potential Win: UGX ${potentialWinnings.toLocaleString()}`);
    clearBetslip();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Betslip Panel */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 md:right-4 md:left-auto md:w-80 bg-card border border-border rounded-t-xl md:rounded-t-lg shadow-2xl z-50 max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50 rounded-t-xl md:rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Betslip</span>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {selections.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selections.length > 0 && (
              <button
                onClick={clearBetslip}
                className="p-1.5 hover:bg-secondary rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-secondary rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Selections */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {selections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <span className="text-sm">No selections</span>
              <span className="text-xs mt-1">Click on odds to add selections</span>
            </div>
          ) : (
            <div className="space-y-2">
              {selections.map((selection) => (
                <div
                  key={selection.id}
                  className="bg-secondary/30 rounded-lg p-3 border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-foreground font-medium">
                        {selection.homeTeam} vs {selection.awayTeam}
                      </p>
                      <p className="text-xxs text-muted-foreground mt-0.5">
                        {selection.market}: {selection.selection}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold">
                        {selection.odds.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeSelection(selection.id)}
                        className="p-1 hover:bg-secondary rounded"
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

        {/* Footer - Single stake input for all selections */}
        {selections.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            {/* Total Odds */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Odds:</span>
              <span className="text-foreground font-semibold">
                {totalOdds.toFixed(2)}
              </span>
            </div>
            
            {/* Single Stake Input */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stake (UGX)</label>
              <input
                type="number"
                placeholder="Enter stake amount"
                value={stake || ""}
                onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            {/* Potential Winnings */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Potential Winnings:</span>
              <span className="text-primary font-semibold">
                UGX {potentialWinnings.toLocaleString()}
              </span>
            </div>
            
            <button
              onClick={handlePlaceBet}
              disabled={stake === 0}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Bet
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Betslip;
