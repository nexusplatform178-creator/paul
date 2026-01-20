import { History, CheckCircle, XCircle, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import MobileBottomNav from "@/components/MobileBottomNav";
import Betslip from "@/components/Betslip";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useFirebaseBets, Bet } from "@/hooks/useFirebaseBets";
import { useAuth } from "@/contexts/AuthContext";

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

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' }) + 
      `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
};

const BetCard = ({ bet }: { bet: Bet }) => {
  const matchDisplay = bet.selections.length > 1 
    ? `${bet.selections[0].homeTeam} vs ${bet.selections[0].awayTeam} + ${bet.selections.length - 1} more`
    : `${bet.selections[0]?.homeTeam || 'Unknown'} vs ${bet.selections[0]?.awayTeam || 'Unknown'}`;
  
  const selectionDisplay = bet.selections.length > 1
    ? `${bet.selections.length} Selections`
    : `${bet.selections[0]?.market || 'Market'}: ${bet.selections[0]?.selection || 'Selection'}`;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{formatDate(bet.createdAt)}</p>
          <p className="text-sm font-medium text-foreground mt-1">{matchDisplay}</p>
          <p className="text-xs text-muted-foreground">{selectionDisplay}</p>
          {bet.type === "virtual" && (
            <span className="inline-block mt-1 text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
              Virtual
            </span>
          )}
        </div>
        {getStatusIcon(bet.status)}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
        <div className="text-xs text-muted-foreground">
          Stake: <span className="text-foreground">UGX {bet.stake.toLocaleString()}</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Odds: </span>
          <span className={bet.status === "pending" ? "text-primary" : "text-foreground"} style={{ fontWeight: 600 }}>
            {bet.totalOdds.toFixed(2)}
          </span>
        </div>
        <div className={`text-xs font-medium ${getStatusColor(bet.status)}`}>
          {bet.status === "pending" 
            ? `To Win: UGX ${bet.potentialWin.toLocaleString()}`
            : bet.status === "won" 
              ? `+UGX ${bet.potentialWin.toLocaleString()}` 
              : `-UGX ${bet.stake.toLocaleString()}`}
        </div>
      </div>
    </div>
  );
};

const MyBetsPage = () => {
  const { user } = useAuth();
  const { pendingBets, settledBets, loading, error } = useFirebaseBets();

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
          {!user ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground mb-4">Please login to view your bets</p>
              <Link to="/" className="text-primary hover:underline">Go to Home</Link>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive">{error}</div>
          ) : (
            <>
              {/* Pending Bets */}
              {pendingBets.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-accent" />
                    <h2 className="text-sm font-semibold text-foreground">Pending ({pendingBets.length})</h2>
                  </div>
                  <div className="space-y-3">
                    {pendingBets.map((bet) => (
                      <BetCard key={bet.id} bet={bet} />
                    ))}
                  </div>
                </div>
              )}

              {/* Settled Bets */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Settled ({settledBets.length})</h2>
                </div>
                {settledBets.length === 0 && pendingBets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No bets yet. Place your first bet!
                  </div>
                ) : settledBets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No settled bets yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {settledBets.map((bet) => (
                      <BetCard key={bet.id} bet={bet} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Betslip />
      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default MyBetsPage;
