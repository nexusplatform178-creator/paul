import { History, CheckCircle, XCircle, Clock, ArrowLeft, Filter, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { ref, onValue, query, orderByChild } from "firebase/database";
import { database } from "@/lib/firebase";

interface Bet {
  id: string;
  selections: Array<{
    matchId: string;
    homeTeam: string;
    awayTeam: string;
    market: string;
    selection: string;
    odds: number;
  }>;
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: "pending" | "won" | "lost";
  type: "virtual" | "sports";
  createdAt: number;
  settledAt?: number;
}

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

const BetHistoryPage = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "won" | "lost">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "virtual" | "sports">("all");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const betsRef = ref(database, `bets/${user.uid}`);
    const betsQuery = query(betsRef, orderByChild("createdAt"));
    
    const unsubscribe = onValue(betsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const betsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<Bet, "id">),
        }));
        setBets(betsArray.reverse());
      } else {
        setBets([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredBets = bets.filter((bet) => {
    const statusMatch = filter === "all" || bet.status === filter;
    const typeMatch = typeFilter === "all" || bet.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
    
    if (isToday) return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    if (isYesterday) return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to view your bet history</p>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      {/* Mobile Back Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">Bet History</span>
        <div className="w-5" />
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-border space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {(["all", "pending", "won", "lost"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {(["all", "virtual", "sports"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                typeFilter === type
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredBets.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bets found</p>
              <Link to="/virtual" className="text-primary hover:underline text-sm mt-2 inline-block">
                Place your first bet
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBets.map((bet) => (
                <div
                  key={bet.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xxs px-1.5 py-0.5 rounded ${
                          bet.type === "virtual" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                        }`}>
                          {bet.type.toUpperCase()}
                        </span>
                        <p className="text-xs text-muted-foreground">{formatDate(bet.createdAt)}</p>
                      </div>
                      {bet.selections.map((sel, idx) => (
                        <div key={idx} className="mt-1">
                          <p className="text-sm font-medium text-foreground">
                            {sel.homeTeam} vs {sel.awayTeam}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {sel.market}: {sel.selection} @ {sel.odds.toFixed(2)}
                          </p>
                        </div>
                      ))}
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
                      {bet.status === "won" 
                        ? `+UGX ${bet.potentialWin.toLocaleString()}` 
                        : bet.status === "lost"
                        ? `-UGX ${bet.stake.toLocaleString()}`
                        : `To Win: UGX ${bet.potentialWin.toLocaleString()}`
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default BetHistoryPage;