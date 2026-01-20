import { Star, ChevronDown, RefreshCw } from "lucide-react";
import { useBetslip } from "@/contexts/BetslipContext";

interface Match {
  id: number;
  time: string;
  isLive?: boolean;
  liveMinute?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  homeFlag?: string;
  awayFlag?: string;
  position?: string;
  odds: {
    "1x2": { "1": number; x: number; "2": number };
    handicap: { value: string; a1: number; a2: number };
    total: { value: string; o: number; u: number };
  };
  isFavorite?: boolean;
  priceHighlight?: "green" | "red" | "yellow";
}

interface TableSection {
  title: string;
  league?: string;
  count: number;
  isLive?: boolean;
  matches: Match[];
}

const sections: TableSection[] = [
  {
    title: "FAVOURITES",
    count: 2,
    matches: [],
  },
  {
    title: "",
    league: "UEFA Champions League",
    count: 0,
    matches: [
      {
        id: 1,
        time: "15'",
        isLive: true,
        liveMinute: "15'",
        homeTeam: "Paris Saint-Germain",
        awayTeam: "Manchester City",
        homeScore: 4,
        awayScore: 3,
        odds: {
          "1x2": { "1": 2.28, x: 2.442, "2": 7.139 },
          handicap: { value: "-1.5", a1: 5.250, a2: 14.187 },
          total: { value: "2.5", o: 1.314, u: 1.101 },
        },
        isFavorite: true,
        priceHighlight: "green",
      },
      {
        id: 2,
        time: "90'+15'",
        isLive: true,
        liveMinute: "90'+15'",
        homeTeam: "Shakhtar Donetsk",
        awayTeam: "Dynamo Kyiv",
        homeScore: 0,
        awayScore: 0,
        position: "€36.48",
        odds: {
          "1x2": { "1": 2.241, x: 1.101, "2": 9.754 },
          handicap: { value: "-1.5", a1: 7.123, a2: 14.187 },
          total: { value: "2.5", o: 3.219, u: 8.214 },
        },
        isFavorite: true,
      },
      {
        id: 3,
        time: "Today",
        homeTeam: "Marseille",
        awayTeam: "Ajax Amsterdam",
        position: "POSITION",
        odds: {
          "1x2": { "1": 2.442, x: 2.442, "2": 5.250 },
          handicap: { value: "-1.5", a1: 5.195, a2: 2.113 },
          total: { value: "2.5", o: 5.250, u: 8.067 },
        },
        isFavorite: true,
      },
      {
        id: 4,
        time: "Today",
        homeTeam: "Veres Rivne",
        awayTeam: "Karpaty Lviv",
        odds: {
          "1x2": { "1": 1.314, x: 2.241, "2": 5.250 },
          handicap: { value: "-1.5", a1: 6.001, a2: 2.962 },
          total: { value: "2.5", o: 4.001, u: 6.410 },
        },
        isFavorite: true,
        priceHighlight: "green",
      },
      {
        id: 5,
        time: "24 Jul",
        homeTeam: "Ajax",
        awayTeam: "Atlético Madrid",
        odds: {
          "1x2": { "1": 4.851, x: -0.5, "2": 1.0 },
          handicap: { value: "-1.5", a1: 1.101, a2: 6.001 },
          total: { value: "2.5", o: 2.293, u: 5.354 },
        },
        isFavorite: true,
      },
      {
        id: 6,
        time: "24 Jul",
        homeTeam: "AS Roma",
        awayTeam: "AC Milan",
        odds: {
          "1x2": { "1": 5.250, x: 3.5, "2": 3.5 },
          handicap: { value: "-1.5", a1: 2.296, a2: 9.216 },
          total: { value: "2.5", o: 2.241, u: 2.849 },
        },
        isFavorite: true,
      },
      {
        id: 7,
        time: "25 Jul",
        homeTeam: "FC Barcelona",
        awayTeam: "Atlético Madrid",
        position: "€36.48",
        odds: {
          "1x2": { "1": 4.001, x: 4.216, "2": 2.296 },
          handicap: { value: "-1.5", a1: 4.526, a2: 9.754 },
          total: { value: "2.5", o: 4.216, u: 7.123 },
        },
        isFavorite: true,
        priceHighlight: "yellow",
      },
      {
        id: 8,
        time: "25 Jul",
        homeTeam: "FC Porto",
        awayTeam: "S.L. Benfica",
        odds: {
          "1x2": { "1": 5.354, x: 1.101, "2": 8.067 },
          handicap: { value: "-1.5", a1: 1.314, a2: 2.849 },
          total: { value: "2.5", o: 4.001, u: 1.101 },
        },
        isFavorite: true,
      },
    ],
  },
];

const liveSections: TableSection[] = [
  {
    title: "LIVE",
    count: 2,
    isLive: true,
    league: "Ukrainian Premier League",
    matches: [
      {
        id: 10,
        time: "15'",
        isLive: true,
        liveMinute: "15'",
        homeTeam: "Shakhtar Donetsk",
        awayTeam: "Dynamo Kyiv",
        homeScore: 1,
        awayScore: 3,
        position: "€36.48",
        odds: {
          "1x2": { "1": 9.216, x: 2.293, "2": 2.296 },
          handicap: { value: "-1.5", a1: 4.091, a2: 1.101 },
          total: { value: "2.5", o: 2.241, u: 2.962 },
        },
        priceHighlight: "green",
      },
      {
        id: 11,
        time: "15'",
        isLive: true,
        liveMinute: "15'",
        homeTeam: "Veres Rivne",
        awayTeam: "Karpaty Lviv",
        homeScore: 2,
        awayScore: 0,
        odds: {
          "1x2": { "1": 6.410, x: 2.442, "2": 1.094 },
          handicap: { value: "-1.5", a1: 7.169, a2: 5.250 },
          total: { value: "2.5", o: 5.354, u: 4.001 },
        },
        priceHighlight: "green",
      },
    ],
  },
];

const todaySections: TableSection[] = [
  {
    title: "TODAY",
    count: 2,
    league: "Primeira Liga",
    matches: [
      {
        id: 20,
        time: "Today",
        homeTeam: "FC Porto",
        awayTeam: "S.L. Benfica",
        position: "",
        odds: {
          "1x2": { "1": 14.187, x: 1.101, "2": 14.187 },
          handicap: { value: "-1.5", a1: 4.216, a2: 7.098 },
          total: { value: "2.5", o: 5.354, u: 5.210 },
        },
        priceHighlight: "green",
      },
      {
        id: 21,
        time: "Today",
        homeTeam: "Sporting CP",
        awayTeam: "Boavista F.C.",
        position: "€36.48",
        odds: {
          "1x2": { "1": 1.150, x: 5.195, "2": 1.101 },
          handicap: { value: "-1.5", a1: 14.187, a2: 2.442 },
          total: { value: "2.5", o: 9.216, u: 7.123 },
        },
      },
    ],
  },
  {
    title: "",
    league: "Seria A",
    count: 0,
    matches: [
      {
        id: 22,
        time: "Today",
        homeTeam: "AC Milan",
        awayTeam: "Inter",
        position: "€36.48",
        odds: {
          "1x2": { "1": 4.091, x: 9.216, "2": 4.001 },
          handicap: { value: "-1.5", a1: 1.094, a2: 2.849 },
          total: { value: "2.5", o: 4.526, u: 1.314 },
        },
        priceHighlight: "green",
      },
    ],
  },
];

interface OddsButtonProps {
  value: number | string;
  highlight?: "green" | "red" | "yellow";
  isSelected?: boolean;
  onClick?: () => void;
}

const OddsButton = ({ value, highlight, isSelected, onClick }: OddsButtonProps) => {
  const numValue = typeof value === 'number' ? value.toFixed(3) : value;
  
  return (
    <button 
      onClick={onClick}
      className={`min-w-[48px] rounded px-2 py-1 text-center transition-all hover:scale-105 border ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : highlight === "green"
            ? "bg-primary/20 border-primary/50" 
            : highlight === "yellow"
              ? "bg-accent/20 border-accent/50"
              : highlight === "red"
                ? "bg-destructive/20 border-destructive/50"
                : "bg-secondary hover:bg-secondary/80 border-transparent"
      }`}
    >
      <span className={`text-xxs font-medium ${
        isSelected 
          ? "text-primary-foreground"
          : highlight === "green"
            ? "text-primary" 
            : highlight === "yellow"
              ? "text-accent"
              : highlight === "red"
                ? "text-destructive"
                : "text-foreground"
      }`}>
        {numValue}
      </span>
    </button>
  );
};

const OddsCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-1 py-1 text-center">
    {children}
  </td>
);

const MatchRow = ({ match }: { match: Match }) => {
  const { selections, addSelection } = useBetslip();
  const matchId = `match-${match.id}`;

  const isSelected = (selectionId: string) => 
    selections.some((s) => s.id === selectionId);

  const handleOddClick = (market: string, selection: string, oddsValue: number) => {
    const selectionId = `${matchId}-${market}-${selection}`;
    addSelection({
      id: selectionId,
      matchId,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      market,
      selection,
      odds: oddsValue,
    });
  };

  return (
    <tr className="border-b border-border hover:bg-row-hover transition-colors">
      <td className="w-6 px-1">
        <Star className={`w-3 h-3 ${match.isFavorite ? "text-accent fill-accent" : "text-muted-foreground"}`} />
      </td>
      <td className="px-2 py-1 text-xxs w-16">
        {match.isLive ? (
          <span className="live-badge">{match.liveMinute}</span>
        ) : (
          <span className="text-muted-foreground">{match.time}</span>
        )}
        {match.time.includes("Jul") && (
          <div className="text-muted-foreground text-xxs">19:00</div>
        )}
        {match.time === "Today" && (
          <div className="text-muted-foreground text-xxs">19:00</div>
        )}
      </td>
      <td className="px-1 py-1 w-6">
        <span className="text-xxs">⚽</span>
      </td>
      <td className="px-2 py-1 min-w-[140px]">
        <div className="flex flex-col text-xxs">
          <span className="text-foreground">{match.homeTeam}</span>
          <span className="text-foreground">{match.awayTeam}</span>
        </div>
      </td>
      <td className="px-2 py-1 w-8 text-xxs">
        {match.homeScore !== undefined && (
          <div className="flex flex-col">
            <span className={match.isLive ? "text-primary" : "text-foreground"}>{match.homeScore}</span>
            <span className={match.isLive ? "text-primary" : "text-foreground"}>{match.awayScore}</span>
          </div>
        )}
      </td>
      <td className="px-2 py-1 w-16 text-xxs text-odds-green">
        {match.position}
      </td>
      <td className="w-px bg-border"></td>
      
      {/* 1X2 */}
      <OddsCell>
        <OddsButton 
          value={match.odds["1x2"]["1"]} 
          highlight={match.id === 1 ? "green" : undefined}
          isSelected={isSelected(`${matchId}-1X2-1`)}
          onClick={() => handleOddClick("1X2", "1", match.odds["1x2"]["1"])}
        />
      </OddsCell>
      <OddsCell>
        <OddsButton 
          value={match.odds["1x2"].x}
          isSelected={isSelected(`${matchId}-1X2-X`)}
          onClick={() => handleOddClick("1X2", "X", match.odds["1x2"].x)}
        />
      </OddsCell>
      <OddsCell>
        <OddsButton 
          value={match.odds["1x2"]["2"]}
          isSelected={isSelected(`${matchId}-1X2-2`)}
          onClick={() => handleOddClick("1X2", "2", match.odds["1x2"]["2"])}
        />
      </OddsCell>
      
      <td className="w-px bg-border"></td>
      
      {/* Asian Handicap */}
      <td className="px-1 py-1 text-center">
        <span className="text-xxs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">{match.odds.handicap.value}</span>
      </td>
      <OddsCell>
        <OddsButton 
          value={match.odds.handicap.a1} 
          highlight={match.priceHighlight}
          isSelected={isSelected(`${matchId}-Handicap-Home`)}
          onClick={() => handleOddClick("Handicap", "Home", match.odds.handicap.a1)}
        />
      </OddsCell>
      <OddsCell>
        <OddsButton 
          value={match.odds.handicap.a2}
          isSelected={isSelected(`${matchId}-Handicap-Away`)}
          onClick={() => handleOddClick("Handicap", "Away", match.odds.handicap.a2)}
        />
      </OddsCell>
      
      <td className="w-px bg-border"></td>
      
      {/* Asian Total */}
      <td className="px-1 py-1 text-center">
        <span className="text-xxs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">{match.odds.total.value}</span>
      </td>
      <OddsCell>
        <OddsButton 
          value={match.odds.total.o}
          isSelected={isSelected(`${matchId}-Total-Over`)}
          onClick={() => handleOddClick("Total", "Over", match.odds.total.o)}
        />
      </OddsCell>
      <OddsCell>
        <OddsButton 
          value={match.odds.total.u}
          isSelected={isSelected(`${matchId}-Total-Under`)}
          onClick={() => handleOddClick("Total", "Under", match.odds.total.u)}
        />
      </OddsCell>
    </tr>
  );
};

const TableHeader = () => (
  <tr className="bg-table-header text-xxs text-muted-foreground">
    <th className="px-1 py-1 text-left"></th>
    <th className="px-2 py-1 text-left"></th>
    <th className="px-1 py-1"></th>
    <th className="px-2 py-1 text-left"></th>
    <th className="px-2 py-1"></th>
    <th className="px-2 py-1 text-left"></th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-1 text-center" colSpan={3}>1 X 2</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-1 text-center" colSpan={3}>ASIAN HANDICAP</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-1 text-center" colSpan={3}>ASIAN TOTAL</th>
  </tr>
);

const LeagueHeader = ({ league, showRefresh = true }: { league: string; showRefresh?: boolean }) => (
  <tr className="bg-secondary/30">
    <td colSpan={20} className="px-2 py-1">
      <div className="flex items-center gap-2">
        <Star className="w-3 h-3 text-muted-foreground" />
        <span className="text-xxs text-foreground">{league}</span>
        {showRefresh && <RefreshCw className="w-2.5 h-2.5 text-muted-foreground ml-auto" />}
      </div>
    </td>
  </tr>
);

const SubTableHeader = () => (
  <tr className="text-xxs text-muted-foreground border-b border-border">
    <th className="px-1 py-0.5"></th>
    <th className="px-2 py-0.5"></th>
    <th className="px-1 py-0.5"></th>
    <th className="px-2 py-0.5"></th>
    <th className="px-2 py-0.5"></th>
    <th className="px-2 py-0.5"><RefreshCw className="w-2.5 h-2.5 inline" /> <ChevronDown className="w-2.5 h-2.5 inline" /></th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-0.5 text-center">1</th>
    <th className="px-2 py-0.5 text-center">X</th>
    <th className="px-2 py-0.5 text-center">2</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-0.5 text-center">Hcap</th>
    <th className="px-2 py-0.5 text-center">1</th>
    <th className="px-2 py-0.5 text-center">2</th>
    <th className="w-px bg-border"></th>
    <th className="px-2 py-0.5 text-center">Total</th>
    <th className="px-2 py-0.5 text-center">O</th>
    <th className="px-2 py-0.5 text-center">U</th>
  </tr>
);

const OddsTable = () => {
  return (
    // Hidden on mobile, visible on md and up
    <div className="hidden md:block flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <TableHeader />
        </thead>
        <tbody>
          {/* Favourites Section */}
          <tr className="bg-secondary/50">
            <td colSpan={20} className="px-2 py-1">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                <span className="text-xxs font-medium text-foreground">FAVOURITES</span>
                <span className="text-xxs text-muted-foreground">2</span>
              </div>
            </td>
          </tr>
          
          <LeagueHeader league="UEFA Champions League" />
          <SubTableHeader />
          {sections[1].matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}

          {/* Live Section */}
          <tr className="bg-secondary/50">
            <td colSpan={20} className="px-2 py-1">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                <span className="text-xxs font-medium text-foreground">LIVE</span>
                <span className="text-xxs text-muted-foreground">2</span>
              </div>
            </td>
          </tr>
          
          <LeagueHeader league="Ukrainian Premier League" />
          <SubTableHeader />
          {liveSections[0].matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}

          {/* Today Section */}
          <tr className="bg-secondary/50">
            <td colSpan={20} className="px-2 py-1">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                <span className="text-xxs font-medium text-foreground">TODAY</span>
                <span className="text-xxs text-muted-foreground">2</span>
              </div>
            </td>
          </tr>
          
          <LeagueHeader league="Primeira Liga" />
          <SubTableHeader />
          {todaySections[0].matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
          
          <LeagueHeader league="Seria A" />
          <SubTableHeader />
          {todaySections[1].matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OddsTable;
