import { MoreHorizontal } from "lucide-react";
import { FootballIcon, BasketballIcon, TennisIcon, AmericanFootballIcon, IceHockeyIcon, BaseballIcon } from "./icons/SportIcons";

interface Sport {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  active?: boolean;
}

const sports: Sport[] = [
  { icon: FootballIcon, name: "Football", active: true },
  { icon: BasketballIcon, name: "Basketball" },
  { icon: TennisIcon, name: "Tennis" },
  { icon: AmericanFootballIcon, name: "American Football" },
  { icon: IceHockeyIcon, name: "Ice Hockey" },
  { icon: BaseballIcon, name: "Baseball" },
];

const timeFilters = ["Full time", "Half time", "Extra time", "HT/FT", "Corners", "HT Corners"];

const SportsTabs = () => {
  return (
    // Hidden on mobile, visible on md and up
    <div className="hidden md:flex h-9 bg-card border-b border-border items-center px-3 gap-2">
      {/* Sport tabs */}
      <div className="flex items-center gap-3">
        {sports.map((sport) => (
          <button
            key={sport.name}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${
              sport.active 
                ? "text-foreground bg-secondary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <sport.icon className="w-4 h-4" />
            <span>{sport.name}</span>
          </button>
        ))}
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-3 h-3" />
          <span>More</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-2"></div>

      {/* Time filters */}
      <div className="flex items-center gap-1">
        {timeFilters.map((filter, i) => (
          <button
            key={filter}
            className={`text-xxs px-2 py-1 rounded transition-colors ${
              i === 1 
                ? "text-foreground bg-secondary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportsTabs;
