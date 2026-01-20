import { ChevronDown, ChevronUp } from "lucide-react";

const RecentOrders = () => {
  return (
    // Hidden on mobile, visible on md and up
    <div className="hidden md:flex h-7 bg-secondary/50 border-t border-border items-center px-3">
      <div className="flex items-center gap-2">
        <ChevronUp className="w-3 h-3 text-muted-foreground" />
        <span className="text-xxs font-medium text-foreground">RECENT ORDERS</span>
        <span className="text-xxs text-muted-foreground">6</span>
      </div>
    </div>
  );
};

export default RecentOrders;
