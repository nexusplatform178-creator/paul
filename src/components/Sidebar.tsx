import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface LeagueItem {
  name: string;
  icon?: string;
  flag?: string;
}

interface Section {
  title: string;
  count: number;
  expanded?: boolean;
  items: LeagueItem[];
}

const sections: Section[] = [
  {
    title: "LIVE",
    count: 1,
    expanded: true,
    items: [
      { name: "Ukrainian Premier League", flag: "🇺🇦" },
    ],
  },
  {
    title: "TODAY",
    count: 5,
    expanded: true,
    items: [
      { name: "La Liga 2", flag: "🇪🇸" },
      { name: "Ukrainian Premier League", flag: "🇺🇦" },
      { name: "Seria A", flag: "🇮🇹" },
      { name: "Primeira Liga", flag: "🇵🇹" },
      { name: "Seria B", flag: "🇮🇹" },
    ],
  },
  {
    title: "UPCOMING",
    count: 16,
    expanded: true,
    items: [
      { name: "La Liga", flag: "🇪🇸" },
      { name: "Primeira Liga", flag: "🇵🇹" },
      { name: "Ukrainian Premier League", flag: "🇺🇦" },
      { name: "Champions League", icon: "⭐" },
      { name: "Bundesliga", flag: "🇩🇪" },
      { name: "Scottish Championship", icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
      { name: "La Liga 2", flag: "🇪🇸" },
      { name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { name: "UEFA Europa League", icon: "⭐" },
      { name: "Women's Super League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { name: "Liga 1", flag: "🇷🇴" },
      { name: "Liga 2", flag: "🇷🇴" },
      { name: "EFL League Two", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { name: "Euro 2024 qualifying", icon: "🏆" },
      { name: "Swedish Professional League", flag: "🇸🇪" },
      { name: "Poland Ekstraklasa", flag: "🇵🇱" },
    ],
  },
];

const Sidebar = () => {
  return (
    // Hidden on mobile, visible on md and up
    <aside className="hidden md:block w-52 bg-sidebar-bg border-r border-border overflow-y-auto">
      {sections.map((section) => (
        <div key={section.title} className="border-b border-border">
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-secondary/50">
            <div className="flex items-center gap-1.5">
              <span className="text-xxs font-medium text-foreground">{section.title}</span>
              <span className="text-xxs text-muted-foreground">{section.count}</span>
            </div>
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
          </div>
          
          <div className="py-0.5">
            {section.items.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-2 px-2.5 py-1 text-left hover:bg-row-hover transition-colors group"
              >
                <span className="text-xs">{item.flag || item.icon}</span>
                <span className="text-xxs text-muted-foreground group-hover:text-foreground truncate flex-1">
                  {item.name}
                </span>
                <RefreshCw className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
