import { Book, Gamepad2, Ticket, History, User } from "lucide-react";
import { useBetslip } from "@/contexts/BetslipContext";
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
  const { selections, setIsOpen } = useBetslip();

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.id === "betslip") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "#betslip") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="h-16 bg-card/95 backdrop-blur-lg border-t border-border/50 flex items-center justify-around px-2 md:hidden fixed bottom-0 left-0 right-0 z-50 shadow-lg">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const isBetslip = item.id === "betslip";
        const hasBets = selections.length > 0;

        const content = (
          <div className={`
            flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200
            ${active && !isBetslip ? "bg-primary/15" : ""}
            ${isBetslip && hasBets ? "bg-primary" : ""}
          `}>
            <div className="relative">
              {isBetslip ? (
                <div className={`
                  flex items-center justify-center gap-1 px-2 py-1 rounded-xl
                  ${hasBets ? "" : "bg-secondary"}
                `}>
                  <item.icon 
                    className={`w-5 h-5 ${
                      hasBets ? "text-primary-foreground" : "text-muted-foreground"
                    }`} 
                  />
                  {hasBets && (
                    <span className="text-xs font-bold text-primary-foreground min-w-[14px] text-center">
                      {selections.length}
                    </span>
                  )}
                </div>
              ) : (
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${active ? "bg-primary shadow-lg shadow-primary/30" : "bg-secondary/60"}
                `}>
                  <item.icon 
                    className={`w-5 h-5 ${
                      active ? "text-primary-foreground" : "text-muted-foreground"
                    }`} 
                  />
                </div>
              )}
            </div>
            <span className={`text-[10px] font-medium leading-tight ${
              active ? "text-primary" : isBetslip && hasBets ? "text-primary-foreground" : "text-muted-foreground"
            }`}>
              {item.label}
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
