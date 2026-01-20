import { X, ChevronDown, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface League {
  name: string;
  count: number;
}

interface LeagueSection {
  title: string;
  expanded: boolean;
  leagues: League[];
}

const popularLeagues = [
  { name: "ATP Championship", icon: "🎾" },
  { name: "Men's Single", icon: "🎾" },
  { name: "Women's Single", icon: "🎾" },
  { name: "Men's Double", icon: "🎾" },
];

const leaguesList = [
  { name: "Ukrainian Championship", flag: "🇺🇦" },
  { name: "Men's Single", icon: "🎾" },
  { name: "Women's Single", icon: "🎾" },
  { name: "Men's Double", icon: "🎾" },
];

const countries = [
  { 
    name: "England", 
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    leagues: ["Wimbledon", "Lexus British Tour", "Local Tennis League", "County Cup"]
  },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Spain", flag: "🇪🇸" },
];

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const [sections, setSections] = useState<LeagueSection[]>([
    {
      title: "LIVE",
      expanded: true,
      leagues: [
        { name: "Premier League", count: 3 },
        { name: "La Liga", count: 2 },
      ],
    },
    {
      title: "TODAY",
      expanded: true,
      leagues: [
        { name: "Champions League", count: 8 },
        { name: "Serie A", count: 5 },
        { name: "Bundesliga", count: 4 },
        { name: "Ligue 1", count: 6 },
      ],
    },
    {
      title: "UPCOMING",
      expanded: false,
      leagues: [
        { name: "Premier League", count: 10 },
        { name: "Champions League", count: 16 },
        { name: "Europa League", count: 24 },
        { name: "La Liga", count: 10 },
        { name: "Serie A", count: 10 },
        { name: "Bundesliga", count: 9 },
        { name: "Turkish Championship", count: 8 },
        { name: "La Liga 2", count: 11 },
      ],
    },
  ]);

  const toggleSection = (index: number) => {
    setSections(sections.map((section, i) => 
      i === index ? { ...section, expanded: !section.expanded } : section
    ));
  };

  const [showEvents, setShowEvents] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-sidebar-bg z-50 overflow-hidden md:hidden flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="text-primary font-bold text-xl tracking-tight">mollybet</div>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Toggle between Events and Navigation */}
        <div className="flex border-b border-border flex-shrink-0">
          <button 
            onClick={() => setShowEvents(true)}
            className={`flex-1 py-2 text-xs transition-colors ${showEvents ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            Events
          </button>
          <button 
            onClick={() => setShowEvents(false)}
            className={`flex-1 py-2 text-xs transition-colors ${!showEvents ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            Navigation
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {showEvents ? (
            /* Events View */
            <>
              {/* Event Title */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <span className="text-xxs text-muted-foreground">Events</span>
                <span className="text-primary font-bold text-xs">(Football)</span>
              </div>
              
              {sections.map((section, sectionIndex) => (
                <div key={section.title} className="border-b border-border">
                  {/* Section Header */}
                  <button 
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xxs font-medium text-muted-foreground">{section.title}</span>
                      <span className="text-xxs text-primary font-medium">
                        {section.leagues.reduce((sum, l) => sum + l.count, 0)}
                      </span>
                    </div>
                    {section.expanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  {/* Leagues */}
                  {section.expanded && (
                    <div className="pb-2">
                      {section.leagues.map((league) => (
                        <button 
                          key={league.name}
                          className="w-full flex items-center justify-between px-4 py-2 hover:bg-secondary/20 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-xxs text-foreground">{league.name}</span>
                          </div>
                          <span className="text-xxs text-muted-foreground">{league.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            /* Navigation View */
            <>
              {/* App Store button */}
              <div className="px-4 py-3">
                <button className="w-full flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                  <span className="text-lg">📱</span>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-muted-foreground">Download on the</span>
                    <span className="text-xs text-foreground font-medium">App Store</span>
                  </div>
                </button>
              </div>
              
              {/* Popular Leagues */}
              <div className="border-t border-border">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xxs font-medium text-foreground">POPULAR LEAGUES</span>
                  <span className="text-xxs text-muted-foreground">9</span>
                </div>
                
                {popularLeagues.map((league) => (
                  <button
                    key={league.name}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary/20 transition-colors"
                  >
                    <span className="text-xs">{league.icon}</span>
                    <span className="text-xxs text-muted-foreground flex-1 text-left">{league.name}</span>
                  </button>
                ))}
                
                <button className="w-full px-4 py-2 text-xxs text-primary hover:underline">
                  SHOW MORE +5
                </button>
              </div>
              
              {/* Leagues */}
              <div className="border-t border-border">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xxs font-medium text-foreground">LEAGUES</span>
                  <span className="text-xxs text-muted-foreground">ALL</span>
                </div>
                
                {leaguesList.map((league) => (
                  <button
                    key={league.name}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary/20 transition-colors"
                  >
                    <span className="text-xs">{league.flag || league.icon}</span>
                    <span className="text-xxs text-muted-foreground flex-1 text-left">{league.name}</span>
                  </button>
                ))}
                
                <button className="w-full px-4 py-2 text-xxs text-primary hover:underline">
                  SHOW MORE +13
                </button>
              </div>
              
              {/* By Country */}
              <div className="border-t border-border">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xxs font-medium text-foreground">BY COUNTRY</span>
                </div>
                
                {countries.map((country) => (
                  <div key={country.name}>
                    <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary/20 transition-colors">
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{country.flag}</span>
                      <span className="text-xxs text-foreground flex-1 text-left">{country.name}</span>
                    </button>
                    
                    {country.leagues && (
                      <div className="pl-8">
                        {country.leagues.map((league) => (
                          <button
                            key={league}
                            className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-secondary/20 transition-colors"
                          >
                            <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
                            <span className="text-xxs text-muted-foreground">{league}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Footer Action */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <button className="w-full py-2.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors active:scale-[0.98]">
            TRADE
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
