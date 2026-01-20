import { Bell, ArrowLeft, CheckCircle, Gift, TrendingUp, AlertCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { ref, onValue, update } from "firebase/database";
import { database } from "@/lib/firebase";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "bet_won" | "bet_lost" | "promo" | "system" | "deposit";
  read: boolean;
  createdAt: number;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "bet_won":
      return <CheckCircle className="w-5 h-5 text-primary" />;
    case "bet_lost":
      return <AlertCircle className="w-5 h-5 text-destructive" />;
    case "promo":
      return <Gift className="w-5 h-5 text-accent" />;
    case "deposit":
      return <TrendingUp className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Bet Won! 🎉",
    message: "Your bet on V-Newcastle vs V-Arsenal has won! UGX 25,000 added to your balance.",
    type: "bet_won",
    read: false,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "2",
    title: "New Promotion Available",
    message: "Get 100% bonus on your next deposit! Use code WEEKEND100.",
    type: "promo",
    read: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "3",
    title: "Deposit Successful",
    message: "UGX 50,000 has been added to your account.",
    type: "deposit",
    read: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "4",
    title: "Bet Lost",
    message: "Your bet on V-Lyon vs V-Marseille did not win. Better luck next time!",
    type: "bet_lost",
    read: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
];

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const notifRef = ref(database, `notifications/${user.uid}`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notifArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<Notification, "id">),
        }));
        setNotifications([...notifArray.reverse(), ...sampleNotifications]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    const notif = notifications.find((n) => n.id === id);
    if (notif && !notif.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      // Update in Firebase if it's a real notification
      try {
        await update(ref(database, `notifications/${user.uid}/${id}`), { read: true });
      } catch {
        // Ignore for sample data
      }
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to view notifications</p>
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
        <span className="text-sm font-semibold text-foreground">Notifications</span>
        <Link to="/settings" className="p-1">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Header Actions */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
              <p className="text-muted-foreground text-sm">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                    !notif.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xxs text-muted-foreground mt-1">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default NotificationsPage;