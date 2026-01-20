import { Ticket } from "lucide-react";
import { useBetslip } from "@/contexts/BetslipContext";

const DesktopBetslipButton = () => {
  const { selections, setIsOpen, isOpen } = useBetslip();
  const hasBets = selections.length > 0;
  
  // Don't show if betslip is already open
  if (isOpen) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`
        hidden md:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
        fixed bottom-6 right-6 z-40 shadow-xl
        ${hasBets 
          ? "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90" 
          : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
        }
      `}
    >
      <Ticket className="w-5 h-5" />
      <span className="font-medium">Betslip</span>
      {hasBets && (
        <span className="bg-primary-foreground text-primary text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {selections.length}
        </span>
      )}
    </button>
  );
};

export default DesktopBetslipButton;
