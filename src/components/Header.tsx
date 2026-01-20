import { Search, Bell, Smartphone, User, Book, Gamepad2, History, Ticket, PlusCircle, LogOut, Wallet, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBetslip } from "@/contexts/BetslipContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selections, setIsOpen } = useBetslip();
  const { user, userProfile, logout, loading } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const navItems = [
    { icon: Book, label: "SPORTSBOOK", path: "/" },
    { icon: Gamepad2, label: "VIRTUAL", path: "/virtual" },
    { icon: History, label: "MY BETS", path: "/my-bets" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const openAuthModal = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  return (
    <>
      {/* Hidden on mobile, visible on md and up */}
      <header className="hidden md:flex h-11 bg-header-bg border-b border-border items-center justify-between px-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-primary font-bold text-base tracking-wide">mollybet</Link>
          
          <div className="flex items-center gap-1 text-xxs text-muted-foreground bg-secondary rounded px-2 py-1">
            <Smartphone className="w-3 h-3" />
            <span>Download on the</span>
            <span className="font-medium text-foreground">App Store</span>
          </div>
          
          <div className="bg-muted rounded h-6 w-24"></div>
          
          <span className="text-muted-foreground">›</span>
        </div>

        {/* Center navigation */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isActive(item.path)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          ))}
          
          {/* Betslip Button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              selections.length > 0 
                ? "text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Ticket className="w-4 h-4" />
            BETSLIP
            {selections.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full ml-1">
                {selections.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          {showSearch ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border border-border rounded px-2 py-1 text-xs w-40 focus:outline-none focus:border-primary"
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setShowSearch(false);
                }}
              />
              <button 
                onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                className="p-1.5 hover:bg-secondary rounded transition-colors"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowSearch(true)}
              className="p-1.5 hover:bg-secondary rounded transition-colors"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          
          <button className="p-1.5 hover:bg-secondary rounded transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
          
          {/* Auth Section */}
          {!loading && (
            <>
              {user && userProfile ? (
                <div className="flex items-center gap-3">
                  {/* Balance Display */}
                  <div className="flex items-center gap-2 bg-secondary rounded px-2 py-1">
                    <Wallet className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      {formatBalance(userProfile.balance)}
                    </span>
                  </div>

                  {/* Deposit Button */}
                  <Link
                    to="/deposit"
                    className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    DEPOSIT
                  </Link>

                  {/* User Avatar Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:bg-secondary rounded p-1 transition-colors">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(userProfile.displayName)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{userProfile.displayName}</p>
                        <p className="text-xs text-muted-foreground">{userProfile.phone}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-bets" className="cursor-pointer">
                          <History className="w-4 h-4 mr-2" />
                          My Bets
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/deposit" className="cursor-pointer">
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Deposit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/withdraw" className="cursor-pointer">
                          <Wallet className="w-4 h-4 mr-2" />
                          Withdraw
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => openAuthModal("login")}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={() => openAuthModal("register")}
                    className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium"
                  >
                    REGISTER
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab={authModalTab}
      />
    </>
  );
};

export default Header;