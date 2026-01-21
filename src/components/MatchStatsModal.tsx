import { X } from "lucide-react";
import { useEffect } from "react";

interface MatchStatsModalProps {
  matchId: number;
  isOpen: boolean;
  onClose: () => void;
  homeTeam: string;
  awayTeam: string;
}

const MatchStatsModal = ({ matchId, isOpen, onClose, homeTeam, awayTeam }: MatchStatsModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[80vh] mx-4 bg-card rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-foreground">Match Statistics</h3>
            <p className="text-xs text-muted-foreground">{homeTeam} vs {awayTeam}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Iframe */}
        <iframe
          src={`https://gsm-widgets.betstream.betgenius.com/multisportgametracker?productName=touchvas&fixtureId=${matchId}`}
          className="w-full h-[calc(100%-56px)]"
          frameBorder="0"
          allowFullScreen
          title="Match Statistics"
        />
      </div>
    </div>
  );
};

export default MatchStatsModal;
