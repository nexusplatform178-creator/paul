import { Star } from "lucide-react";
import { ReactNode } from "react";

interface MobileLeagueHeaderProps {
  flag: ReactNode;
  country: string;
  league: string;
}

const MobileLeagueHeader = ({ flag, country, league }: MobileLeagueHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20 blur-xl scale-150"
        style={{
          background: `linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent)`,
        }}
      />
      
      <div className="relative flex items-center justify-between px-3 py-2 bg-gradient-to-r from-secondary/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6">{flag}</div>
          <div className="flex flex-col">
            <span className="text-xxs text-foreground font-medium">{country}</span>
            <span className="text-xxs text-primary">• {league}</span>
          </div>
        </div>
        <button className="p-1">
          <Star className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default MobileLeagueHeader;
