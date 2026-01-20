import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

interface Sport {
  icon: string;
  name: string;
  id: string;
}

const sports: Sport[] = [
  { icon: "⚽", name: "Football", id: "football" },
  { icon: "🏀", name: "Basketball", id: "basketball" },
  { icon: "🎾", name: "Tennis", id: "tennis" },
  { icon: "🏈", name: "American Football", id: "americanfootball" },
];

const MobileSportsTabs = () => {
  const [activeSport, setActiveSport] = useState("football");

  return (
    <div className="bg-card border-b border-border px-2 py-1.5 md:hidden">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xxs text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-muted-foreground">◆</span>
          <span>Top</span>
        </button>
        
        <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xxs text-muted-foreground hover:text-foreground transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-live-red animate-pulse"></span>
          <span>Live</span>
        </button>
        
        {sports.map((sport) => {
          const isActive = activeSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.id)}
              className={`flex items-center gap-1 text-xxs px-2.5 py-1 rounded whitespace-nowrap transition-all ${
                isActive 
                  ? "text-primary-foreground bg-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="text-xs">{sport.icon}</span>
              <span>{sport.name}</span>
            </button>
          );
        })}
        
        <button className="flex items-center gap-1 text-xxs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors">
          <MoreHorizontal className="w-3.5 h-3.5" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
};

export default MobileSportsTabs;