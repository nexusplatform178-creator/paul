import { Menu, Bell, Search, PlusCircle, Wallet, LogOut, History, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MobileHeaderProps {
  onMenuClick?: () => void;
}

const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const { user, userProfile, logout, loading } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  return (
    <>
      <header className="h-11 bg-background border-b border-border flex items-center justify-between px-3 md:hidden">
        {/* Left - Menu & Logo */}
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <button onClick={onMenuClick} className="p-1 -ml-1">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          )}
          <Link to="/" className="text-primary font-bold text-lg tracking-tight">mollybet</Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          {showSearch ? (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary border border-border rounded px-2 py-1 text-xs w-24 focus:outline-none focus:border-primary"
              autoFocus
              onBlur={() => {
                if (!searchQuery) setShowSearch(false);
              }}
            />
          ) : (
            <button 
              onClick={() => setShowSearch(true)}
              className="p-1.5 hover:bg-secondary rounded transition-colors"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          
          <button className="relative p-1.5 hover:bg-secondary rounded transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-destructive rounded-full"></span>
          </button>
          
          {/* Auth Section */}
          {!loading && (
            <>
              {user && userProfile ? (
                <div className="flex items-center gap-1.5">
                  {/* Balance Display */}
                  <div className="flex items-center gap-1 bg-secondary rounded px-1.5 py-0.5">
                    <Wallet className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      {formatBalance(userProfile.balance)}
                    </span>
                  </div>

                  {/* Deposit Button */}
                  <Link
                    to="/deposit"
                    className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium"
                  >
                    <PlusCircle className="w-3 h-3" />
                  </Link>

                  {/* User Avatar Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center hover:bg-secondary rounded p-0.5 transition-colors">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                            {getInitials(userProfile.displayName)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium truncate">{userProfile.displayName}</p>
                        <p className="text-xs text-muted-foreground">{userProfile.phone}</p>
                      </div>
                      <DropdownMenuSeparator />
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
                    className="text-xs text-primary font-medium px-2 py-1"
                  >
                    Login
                  </button>
                  
                  <button 
                    onClick={() => openAuthModal("register")}
                    className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded"
                  >
                    Register
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

export default MobileHeader;