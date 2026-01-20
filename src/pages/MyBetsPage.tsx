import { History, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MobileBottomNav from "@/components/MobileBottomNav";
import Betslip from "@/components/Betslip";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";

const bets = [
  { 
    id: 1, 
    match: "Man City vs Liverpool", 
    market: "1X2", 
    selection: "1", 
    stake: 50000, 
    odds: 2.45, 
    totalOdds: 2.45,
    status: "won", 
    payout: 122500,
    date: "Today, 14:30"
  },
  { 
    id: 2, 
    match: "Barcelona vs Real Madrid", 
    market: "Over/Under", 
    selection: "Over 2.5", 
    stake: 30000, 
    odds: 1.85, 
    totalOdds: 1.85,
    status: "lost", 
    payout: 0,
    date: "Today, 12:00"
  },
  { 
    id: 3, 
    match: "Bayern vs Dortmund", 
    market: "Asian Handicap", 
    selection: "-1.5", 
    stake: 100000, 
    odds: 2.10, 
    totalOdds: 2.10,
    status: "pending", 
    payout: 0,
    date: "Today, 18:00"
  },
  { 
    id: 4, 
    match: "PSG vs Monaco", 
    market: "1X2", 
    selection: "1", 
    stake: 25000, 
    odds: 1.45, 
    totalOdds: 1.45,
    status: "won", 
    payout: 36250,
    date: "Yesterday"
  },
  { 
    id: 5, 
    match: "Liverpool vs Chelsea + Arsenal vs Spurs", 
    market: "Accumulator", 
    selection: "2 Selections", 
    stake: 10000, 
    odds: 4.50, 
    totalOdds: 4.50,
    status: "pending", 
    payout: 0,
    date: "Today, 17:30"
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "won":
      return <CheckCircle className="w-5 h-5 text-primary" />;
    case "lost":
      return <XCircle className="w-5 h-5 text-destructive" />;
    case "pending":
      return <Clock className="w-5 h-5 text-accent" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "won":
      return "text-primary";
    case "lost":
      return "text-destructive";
    case "pending":
      return "text-accent";
    default:
      return "text-foreground";
  }
};

const MyBetsPage = () => {
  const pendingBets = bets.filter(b => b.status === "pending");
  const settledBets = bets.filter(b => b.status !== "pending");

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      {/* Mobile Back Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">My Bets</span>
        <div className="w-5" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {/* Pending Bets */}
          {pendingBets.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-accent" />
                <h2 className="text-sm font-semibold text-foreground">Pending ({pendingBets.length})</h2>
              </div>
              <div className="space-y-3">
                {pendingBets.map((bet) => (
                  <div
                    key={bet.id}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{bet.date}</p>
                        <p className="text-sm font-medium text-foreground mt-1">{bet.match}</p>
                        <p className="text-xs text-muted-foreground">{bet.market}: {bet.selection}</p>
                      </div>
                      {getStatusIcon(bet.status)}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                      <div className="text-xs text-muted-foreground">
                        Stake: <span className="text-foreground">UGX {bet.stake.toLocaleString()}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Odds: </span>
                        <span className="text-primary font-semibold">{bet.totalOdds.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-accent font-medium">
                        To Win: UGX {(bet.stake * bet.totalOdds).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settled Bets */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Settled</h2>
            </div>
            <div className="space-y-3">
              {settledBets.map((bet) => (
                <div
                  key={bet.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{bet.date}</p>
                      <p className="text-sm font-medium text-foreground mt-1">{bet.match}</p>
                      <p className="text-xs text-muted-foreground">{bet.market}: {bet.selection}</p>
                    </div>
                    {getStatusIcon(bet.status)}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                    <div className="text-xs text-muted-foreground">
                      Stake: <span className="text-foreground">UGX {bet.stake.toLocaleString()}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Odds: </span>
                      <span className="text-foreground font-semibold">{bet.totalOdds.toFixed(2)}</span>
                    </div>
                    <div className={`text-xs font-medium ${getStatusColor(bet.status)}`}>
                      {bet.status === "won" ? `+UGX ${bet.payout.toLocaleString()}` : `-UGX ${bet.stake.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Betslip />
      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default MyBetsPage;
