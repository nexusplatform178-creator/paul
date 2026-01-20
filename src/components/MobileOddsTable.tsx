import MobileLeagueHeader from "./MobileLeagueHeader";
import MobileMatchCard from "./MobileMatchCard";
import { TrophyIcon } from "./icons/SportIcons";
import { FlagPortugal, FlagItaly, FlagSpain, FlagEngland } from "./icons/CountryFlags";

const matches = [
  {
    league: { flag: "trophy", country: "Europe", name: "UEFA Champions League" },
    matches: [
      {
        matchId: "ucl-1",
        time: "15'",
        isLive: true,
        liveMinute: "15'",
        homeTeam: "Paris Saint-Germain",
        awayTeam: "Manchester City",
        homeScore: 4,
        awayScore: 3,
        position: "UGX 135K",
        odds: {
          "1x2": { "1": 2.28, x: 2.44, "2": 7.14 },
          handicap: { value: "-1.5", home: 5.25, away: 14.19 },
          total: { value: "2.5", over: 1.31, under: 1.10 },
        },
        highlightColor: "green" as const,
      },
      {
        matchId: "ucl-2",
        time: "90'+15'",
        isLive: true,
        liveMinute: "90'+15'",
        homeTeam: "Shakhtar Donetsk",
        awayTeam: "Dynamo Kyiv",
        homeScore: 0,
        awayScore: 0,
        position: "UGX 135K",
        odds: {
          "1x2": { "1": 2.24, x: 1.10, "2": 9.75 },
          handicap: { value: "-1.5", home: 7.12, away: 14.19 },
          total: { value: "2.5", over: 3.22, under: 8.21 },
        },
      },
    ],
  },
  {
    league: { flag: "pt", country: "Portugal", name: "Primeira Liga" },
    matches: [
      {
        matchId: "pt-1",
        time: "19:00",
        homeTeam: "FC Porto",
        awayTeam: "S.L. Benfica",
        odds: {
          "1x2": { "1": 14.19, x: 1.10, "2": 14.19 },
          handicap: { value: "-1.5", home: 4.22, away: 7.10 },
          total: { value: "2.5", over: 5.35, under: 5.21 },
        },
        highlightColor: "green" as const,
      },
    ],
  },
  {
    league: { flag: "it", country: "Italy", name: "Serie A" },
    matches: [
      {
        matchId: "it-1",
        time: "20:45",
        homeTeam: "AC Milan",
        awayTeam: "Inter",
        position: "UGX 135K",
        odds: {
          "1x2": { "1": 4.09, x: 9.22, "2": 4.00 },
          handicap: { value: "-1.5", home: 1.09, away: 2.85 },
          total: { value: "2.5", over: 4.53, under: 1.31 },
        },
        highlightColor: "green" as const,
      },
    ],
  },
  {
    league: { flag: "es", country: "Spain", name: "La Liga" },
    matches: [
      {
        matchId: "es-1",
        time: "21:00",
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        position: "UGX 460K",
        odds: {
          "1x2": { "1": 2.10, x: 3.50, "2": 3.40 },
          handicap: { value: "-0.5", home: 2.20, away: 1.75 },
          total: { value: "2.5", over: 1.70, under: 2.20 },
        },
        highlightColor: "yellow" as const,
      },
    ],
  },
  {
    league: { flag: "en", country: "England", name: "Premier League" },
    matches: [
      {
        matchId: "en-1",
        time: "17:30",
        homeTeam: "Liverpool",
        awayTeam: "Chelsea",
        odds: {
          "1x2": { "1": 1.85, x: 3.60, "2": 4.20 },
          handicap: { value: "-1", home: 2.45, away: 1.62 },
          total: { value: "3.5", over: 2.10, under: 1.80 },
        },
      },
    ],
  },
];

const getFlagComponent = (flag: string) => {
  switch (flag) {
    case "pt": return <FlagPortugal className="w-5 h-3.5" />;
    case "it": return <FlagItaly className="w-5 h-3.5" />;
    case "es": return <FlagSpain className="w-5 h-3.5" />;
    case "en": return <FlagEngland className="w-5 h-3.5" />;
    case "trophy": return <TrophyIcon className="w-5 h-5 text-accent" />;
    default: return <TrophyIcon className="w-5 h-5 text-accent" />;
  }
};

const MobileOddsTable = () => {
  return (
    <div className="flex-1 overflow-y-auto md:hidden w-full scrollbar-thin pb-2">
      {matches.map((section, i) => (
        <div key={i}>
          <MobileLeagueHeader 
            flag={getFlagComponent(section.league.flag)}
            country={section.league.country}
            league={section.league.name}
          />
          {section.matches.map((match, j) => (
            <MobileMatchCard 
              key={j}
              {...match}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MobileOddsTable;
