import { useState, useEffect } from "react";
import { ref, onValue, query, orderByChild } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { VirtualBet } from "@/contexts/VirtualBetslipContext";

export interface Bet extends VirtualBet {
  id: string;
}

export const useFirebaseBets = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const betsRef = ref(database, `bets/${user.uid}`);
    const betsQuery = query(betsRef, orderByChild("createdAt"));

    const unsubscribe = onValue(
      betsQuery,
      (snapshot) => {
        const betsData: Bet[] = [];
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            betsData.push({
              id: childSnapshot.key!,
              ...childSnapshot.val(),
            });
          });
        }
        
        // Sort by createdAt descending (newest first)
        betsData.sort((a, b) => b.createdAt - a.createdAt);
        
        setBets(betsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching bets:", err);
        setError("Failed to load bets");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const pendingBets = bets.filter((b) => b.status === "pending");
  const settledBets = bets.filter((b) => b.status !== "pending");
  const wonBets = bets.filter((b) => b.status === "won");
  const lostBets = bets.filter((b) => b.status === "lost");

  return {
    bets,
    pendingBets,
    settledBets,
    wonBets,
    lostBets,
    loading,
    error,
  };
};
