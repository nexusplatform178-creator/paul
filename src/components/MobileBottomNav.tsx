import { Book, Gamepad2, Ticket, History, User } from "lucide-react";
import { useBetslip } from "@/contexts/BetslipContext";
import { useVirtualBetslip } from "@/contexts/VirtualBetslipContext";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Book, label: "Sportsbook", id: "sportsbook", path: "/" },
  { icon: Gamepad2, label: "Virtual", id: "virtual", path: "/virtual" },
  { icon: Ticket, label: "Betslip", id: "betslip", path: "#betslip" },
  { icon: History, label: "My Bet", id: "mybets", path: "/my-bets" },
  { icon: User, label: "Account", id: "account", path: "/dashboard" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { selections: regularSelections, setIsOpen: setRegularBetslipOpen } = useBetslip();
  const { selections: virtualSelections, setIsOpen: setVirtualBetslipOpen } = useVirtualBetslip();

  const isVirtualPage = location.pathname === "/virtual";
  const selections = isVirtualPage ? virtualSelections : regularSelections;

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.id === "betslip") {
      e.preventDefault();
      if (isVirtualPage) {
        setVirtualBetslipOpen(true);
      } else {
        setRegularBetslipOpen(true);
      }
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "#betslip") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`h-16 backdrop-blur-lg border-t flex items-center justify-around px-2 md:hidden fixed bottom-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 ${
      isVirtualPage 
        ? "bg-purple-900/95 border-purple-500/30" 
        : "bg-card/95 border-border/50"
    }`}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        const isBetslip = item.id === "betslip";
        const hasBets = selections.length > 0;

        const content = (
          <div className={`
            flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200
            ${active && !isBetslip ? isVirtualPage ? "bg-purple-500/20" : "bg-primary/15" : ""}
            ${isBetslip && hasBets ? isVirtualPage ? "bg-purple-500" : "bg-primary" : ""}
          `}>
            <div className="relative">
              {isBetslip ? (
                <div className={`
                  flex items-center justify-center gap-1 px-2 py-1 rounded-xl
                  ${hasBets ? "" : isVirtualPage ? "bg-purple-500/20" : "bg-secondary"}
                `}>
                  <item.icon 
                    className={`w-5 h-5 ${
                      hasBets 
                        ? "text-white" 
                        : isVirtualPage ? "text-purple-300" : "text-muted-foreground"
                    }`} 
                  />
                  {hasBets && (
                    <span className="text-xs font-bold text-white min-w-[14px] text-center">
                      {selections.length}
                    </span>
                  )}
                </div>
              ) : (
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${active 
                    ? isVirtualPage 
                      ? "bg-purple-500 shadow-lg shadow-purple-500/30" 
                      : "bg-primary shadow-lg shadow-primary/30" 
                    : isVirtualPage 
                      ? "bg-purple-500/20" 
                      : "bg-secondary/60"
                  }
                `}>
                  <item.icon 
                    className={`w-5 h-5 ${
                      active 
                        ? "text-white" 
                        : isVirtualPage 
                          ? "text-purple-300" 
                          : "text-muted-foreground"
                    }`} 
                  />
                </div>
              )}
            </div>
            <span className={`text-[10px] font-medium leading-tight ${
              active 
                ? isVirtualPage ? "text-purple-300" : "text-primary" 
                : isBetslip && hasBets 
                  ? "text-white" 
                  : isVirtualPage 
                    ? "text-purple-300/70" 
                    : "text-muted-foreground"
            }`}>
              {isBetslip && isVirtualPage ? "V-Betslip" : item.label}
            </span>
          </div>
        );

        return (
          <Link
            key={item.id}
            to={item.path}
            onClick={(e) => handleNavClick(item, e)}
            className="flex-1 flex justify-center"
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
