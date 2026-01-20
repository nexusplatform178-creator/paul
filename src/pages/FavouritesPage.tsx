import { Star, ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { ref, onValue, remove } from "firebase/database";
import { database } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

interface Favourite {
  id: string;
  teamName: string;
  league: string;
  type: "team" | "competition";
  addedAt: number;
}

const FavouritesPage = () => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const favsRef = ref(database, `favourites/${user.uid}`);
    const unsubscribe = onValue(favsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const favsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<Favourite, "id">),
        }));
        setFavourites(favsArray);
      } else {
        setFavourites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const removeFavourite = async (id: string) => {
    if (!user) return;
    try {
      await remove(ref(database, `favourites/${user.uid}/${id}`));
      toast({
        title: "Removed",
        description: "Favourite removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove favourite",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to view your favourites</p>
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
        <span className="text-sm font-semibold text-foreground">Favourites</span>
        <div className="w-5" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : favourites.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Favourites Yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add your favourite teams and competitions for quick access
              </p>
              <Link to="/" className="text-primary hover:underline text-sm">
                Browse matches
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favourites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{fav.teamName}</p>
                      <p className="text-xs text-muted-foreground">{fav.league}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavourite(fav.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
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

export default FavouritesPage;