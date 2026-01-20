import { Settings, ArrowLeft, Bell, Moon, Globe, Volume2, User, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface SettingsState {
  notifications: {
    betResults: boolean;
    promotions: boolean;
    news: boolean;
    sound: boolean;
  };
  appearance: {
    darkMode: boolean;
    language: string;
  };
  betting: {
    confirmBets: boolean;
    quickBet: boolean;
    defaultStake: number;
  };
}

const defaultSettings: SettingsState = {
  notifications: {
    betResults: true,
    promotions: true,
    news: false,
    sound: true,
  },
  appearance: {
    darkMode: true,
    language: "en",
  },
  betting: {
    confirmBets: true,
    quickBet: false,
    defaultStake: 1000,
  },
};

const SettingsPage = () => {
  const { user, userProfile } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("mollybet_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // Use defaults
      }
    }
  }, []);

  useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayName(userProfile.displayName);
    }
  }, [userProfile]);

  const updateSetting = <K extends keyof SettingsState>(
    category: K,
    key: keyof SettingsState[K],
    value: SettingsState[K][keyof SettingsState[K]]
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    setSettings(newSettings);
    localStorage.setItem("mollybet_settings", JSON.stringify(newSettings));
    toast({
      title: "Setting Updated",
      description: "Your preference has been saved",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to access settings</p>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">Settings</span>
        <div className="w-5" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Profile Section */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Profile</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Display Name</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.displayName || "Not set"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Phone Number</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.phone}</p>
                </div>
                <span className="text-xs text-muted-foreground">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">Primary</span>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Notifications</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Bet Results</p>
                  <p className="text-xs text-muted-foreground">Get notified when your bets are settled</p>
                </div>
                <Switch
                  checked={settings.notifications.betResults}
                  onCheckedChange={(checked) => updateSetting("notifications", "betResults", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Promotions</p>
                  <p className="text-xs text-muted-foreground">Receive bonus and promotion alerts</p>
                </div>
                <Switch
                  checked={settings.notifications.promotions}
                  onCheckedChange={(checked) => updateSetting("notifications", "promotions", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">News & Updates</p>
                  <p className="text-xs text-muted-foreground">Get the latest sports news</p>
                </div>
                <Switch
                  checked={settings.notifications.news}
                  onCheckedChange={(checked) => updateSetting("notifications", "news", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground">Sound</p>
                    <p className="text-xs text-muted-foreground">Play sounds for notifications</p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.sound}
                  onCheckedChange={(checked) => updateSetting("notifications", "sound", checked)}
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Appearance</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Use dark theme</p>
                </div>
                <Switch
                  checked={settings.appearance.darkMode}
                  onCheckedChange={(checked) => updateSetting("appearance", "darkMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground">Language</p>
                    <p className="text-xs text-muted-foreground">Select your preferred language</p>
                  </div>
                </div>
                <select
                  value={settings.appearance.language}
                  onChange={(e) => updateSetting("appearance", "language", e.target.value)}
                  className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="lg">Luganda</option>
                </select>
              </div>
            </div>
          </div>

          {/* Betting Preferences */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Betting Preferences</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Confirm Bets</p>
                  <p className="text-xs text-muted-foreground">Show confirmation before placing bets</p>
                </div>
                <Switch
                  checked={settings.betting.confirmBets}
                  onCheckedChange={(checked) => updateSetting("betting", "confirmBets", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Quick Bet</p>
                  <p className="text-xs text-muted-foreground">Enable one-click betting</p>
                </div>
                <Switch
                  checked={settings.betting.quickBet}
                  onCheckedChange={(checked) => updateSetting("betting", "quickBet", checked)}
                />
              </div>
              <div>
                <p className="text-sm text-foreground mb-1">Default Stake (UGX)</p>
                <input
                  type="number"
                  value={settings.betting.defaultStake}
                  onChange={(e) => updateSetting("betting", "defaultStake", parseInt(e.target.value) || 0)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-sm text-foreground font-medium">MollyBet</p>
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
              <Link to="/support" className="hover:text-primary">Help</Link>
              <span>•</span>
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default SettingsPage;