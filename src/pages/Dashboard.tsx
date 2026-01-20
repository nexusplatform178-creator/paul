import { 
  User, Wallet, History, Settings, Bell, TrendingUp, Calendar,
  ChevronRight, ArrowLeft, CreditCard, Gift, Shield, HelpCircle, LogOut, Edit, Star, Trophy
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: Wallet, label: "Deposit", path: "/deposit", badge: null },
  { icon: CreditCard, label: "Withdraw", path: "/withdraw", badge: null },
  { icon: History, label: "Bet History", path: "/history", badge: null },
  { icon: Star, label: "Favourites", path: "/favourites", badge: null },
  { icon: Gift, label: "Bonuses & Promotions", path: "/bonuses", badge: null },
  { icon: Bell, label: "Notifications", path: "/notifications", badge: null },
  { icon: Shield, label: "Security", path: "/security", badge: null },
  { icon: Settings, label: "Settings", path: "/settings", badge: null },
  { icon: HelpCircle, label: "Help & Support", path: "/support", badge: null },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to view your account</p>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="text-sm font-semibold text-foreground">My Account</span>
          <button className="p-1.5 hover:bg-secondary rounded transition-colors">
            <Edit className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="bg-gradient-to-br from-primary/20 to-secondary px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">{userProfile?.displayName || "User"}</h2>
            <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
            <p className="text-xs text-muted-foreground">{userProfile?.phone}</p>
          </div>
        </div>

        <div className="mt-4 bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-foreground">UGX {(userProfile?.balance || 0).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/deposit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-medium">
                Deposit
              </Link>
              <Link to="/withdraw" className="bg-secondary text-foreground px-4 py-2 rounded-lg text-xs font-medium border border-border">
                Withdraw
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div>
              <p className="text-xxs text-muted-foreground">Bonus Balance</p>
              <p className="text-sm font-semibold text-primary">UGX {(userProfile?.bonusBalance || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 pb-8">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
