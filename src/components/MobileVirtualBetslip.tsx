import { X, Trash2, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { useVirtualBetslip, VirtualBetSelection } from "@/contexts/VirtualBetslipContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const MobileVirtualBetslip = () => {
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
    placeBet,
    isPlacingBet,
  } = useVirtualBetslip();

  const handlePlaceBet = async () => {
    await placeBet();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-3xl bg-card border-t-0 p-0 overflow-hidden"
      >
        {/* Purple Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Virtual Betslip</h3>
              <p className="text-white/70 text-xs">
                {selections.length} selection{selections.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {selections.length > 0 && (
            <button
              onClick={clearBetslip}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Selections */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[45vh]">
          {selections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-muted-foreground text-sm">Your Virtual Betslip is empty</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Add selections to place a bet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selections.map((sel) => (
                <div 
                  key={sel.id} 
                  className="bg-secondary rounded-2xl p-4 border border-purple-500/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-foreground font-semibold text-sm">
                        {sel.homeTeam} vs {sel.awayTeam}
                      </p>
                      <p className="text-purple-400 text-xs mt-1 font-medium">
                        {sel.market}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-xs font-medium">
                          {sel.selection}
                        </span>
                        <span className="text-purple-400 font-bold text-sm">
                          @ {sel.odds.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSelection(sel.id)}
                      className="p-2 hover:bg-background rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {selections.length > 0 && (
          <div className="border-t border-border p-4 space-y-4 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total Odds</span>
              <span className="text-purple-400 font-bold text-lg">{totalOdds.toFixed(2)}</span>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Stake (UGX)</label>
              <input
                type="number"
                placeholder="Enter stake amount"
                value={stake || ""}
                onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                className="w-full bg-secondary border border-purple-500/30 rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Potential Win</span>
              <span className="text-purple-400 font-bold text-xl">
                UGX {potentialWinnings.toLocaleString()}
              </span>
            </div>
            
            <button
              onClick={handlePlaceBet}
              disabled={stake === 0 || isPlacingBet}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl text-sm font-bold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
            >
              {isPlacingBet ? "Placing Bet..." : "Place Virtual Bet"}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileVirtualBetslip;
