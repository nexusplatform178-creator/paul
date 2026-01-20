import { useState } from "react";
import { Star } from "lucide-react";

interface Filter {
  label: string;
  icon?: React.ElementType;
  count: number | null;
  id: string;
}

const filters: Filter[] = [
  { label: "Favourites", icon: Star, count: null, id: "favourites" },
  { label: "Live", count: 23, id: "live" },
  { label: "Today", count: 52, id: "today" },
  { label: "Tomorrow", count: 16, id: "tomorrow" },
];

const MobileFilterTabs = () => {
  const [activeFilter, setActiveFilter] = useState("today");

  return (
    <div className="bg-card border-b border-border px-3 py-1.5 md:hidden">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5">
          <span className="text-xxs text-muted-foreground">All</span>
          <span className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 rounded font-medium">
            439
          </span>
        </div>
        
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 text-xxs px-2.5 py-1 rounded whitespace-nowrap transition-all ${
                isActive 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              {filter.icon && <filter.icon className="w-3 h-3" />}
              <span>{filter.label}</span>
              {filter.count !== null && (
                <span className={`${isActive ? "text-foreground/70" : "text-muted-foreground"}`}>
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileFilterTabs;