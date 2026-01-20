import { Gift, ArrowLeft, Copy, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Promotion {
  id: string;
  title: string;
  description: string;
  code?: string;
  expiresAt: string;
  type: "deposit" | "freebet" | "cashback" | "loyalty";
  value: string;
  claimed: boolean;
}

const promotions: Promotion[] = [
  {
    id: "1",
    title: "Welcome Bonus",
    description: "Get 100% bonus on your first deposit up to UGX 500,000",
    code: "WELCOME100",
    expiresAt: "2025-02-28",
    type: "deposit",
    value: "100% up to UGX 500,000",
    claimed: false,
  },
  {
    id: "2",
    title: "Weekend Free Bet",
    description: "Place 5 bets and get a free bet worth UGX 10,000",
    expiresAt: "2025-01-26",
    type: "freebet",
    value: "UGX 10,000 Free Bet",
    claimed: false,
  },
  {
    id: "3",
    title: "Cashback Monday",
    description: "Get 10% cashback on all losses every Monday",
    expiresAt: "2025-12-31",
    type: "cashback",
    value: "10% Cashback",
    claimed: true,
  },
  {
    id: "4",
    title: "VIP Loyalty Bonus",
    description: "Exclusive bonus for loyal customers - bet more, earn more!",
    code: "VIP2025",
    expiresAt: "2025-06-30",
    type: "loyalty",
    value: "Up to 50% Extra",
    claimed: false,
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "deposit":
      return "bg-primary/20 text-primary";
    case "freebet":
      return "bg-accent/20 text-accent";
    case "cashback":
      return "bg-green-500/20 text-green-500";
    case "loyalty":
      return "bg-purple-500/20 text-purple-500";
    default:
      return "bg-secondary text-foreground";
  }
};

const BonusesPage = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"promotions" | "my-bonuses">("promotions");

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `Promo code ${code} copied to clipboard`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to view bonuses</p>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">Bonuses & Promotions</span>
        <div className="w-5" />
      </div>

      {/* Bonus Balance Card */}
      <div className="px-4 py-4 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Your Bonus Balance</p>
            <p className="text-2xl font-bold text-primary">
              UGX {(userProfile?.bonusBalance || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab("promotions")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "promotions"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Promotions
          </button>
          <button
            onClick={() => setActiveTab("my-bonuses")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "my-bonuses"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Bonuses
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {activeTab === "promotions" ? (
            <div className="space-y-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-primary" />
                        <span className={`text-xxs px-2 py-0.5 rounded-full ${getTypeColor(promo.type)}`}>
                          {promo.type.toUpperCase()}
                        </span>
                      </div>
                      {promo.claimed && (
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <CheckCircle className="w-3 h-3" /> Claimed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mt-2">{promo.title}</h3>
                    <p className="text-primary font-semibold">{promo.value}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Expires: {new Date(promo.expiresAt).toLocaleDateString()}</span>
                      </div>
                      {promo.code && (
                        <button
                          onClick={() => copyCode(promo.code!)}
                          className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded text-xs hover:bg-secondary/80 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          {promo.code}
                        </button>
                      )}
                    </div>
                    {!promo.claimed && (
                      <button className="w-full mt-3 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        Claim Bonus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Bonuses</h3>
              <p className="text-muted-foreground text-sm">
                Check out our promotions and claim your bonuses
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default BonusesPage;