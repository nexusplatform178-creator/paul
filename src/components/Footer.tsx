import { Settings, FileText, HelpCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import FlagUganda from "./icons/FlagUganda";
import nlgrbLogo from "@/assets/nlgrb-logo.png";

const Footer = () => {
  return (
    // Hidden on mobile, visible on md and up
    <footer className="hidden md:flex h-10 bg-header-bg border-t border-border items-center justify-between px-4">
      {/* Left - Links */}
      <div className="flex items-center gap-4 text-xxs">
        <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <HelpCircle className="w-3 h-3" />
          About Us
        </Link>
        <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <Mail className="w-3 h-3" />
          Contact
        </Link>
        <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <FileText className="w-3 h-3" />
          Terms & Conditions
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4 text-xxs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FlagUganda className="w-5 h-3.5" />
          <img src={nlgrbLogo} alt="NLGRB" className="h-5 w-auto" />
          <span>Uganda</span>
        </div>
        
        <button className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Settings className="w-3 h-3 text-primary-foreground" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
