import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { ref, set, onValue, get, query, orderByChild, equalTo } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phone: string;
  balance: number;
  bonusBalance: number;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkPhoneExists: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to format phone number
const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('256') ? `+${cleaned}` : `+256${cleaned}`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence to local so users stay logged in
    setPersistence(auth, browserLocalPersistence).catch(console.error);
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.val());
          }
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check if phone number already exists
  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    const formattedPhone = formatPhone(phone);
    const usersRef = ref(database, 'users');
    const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(formattedPhone));
    const snapshot = await get(phoneQuery);
    return snapshot.exists();
  };

  // Get email by phone number for login
  const getEmailByPhone = async (phone: string): Promise<string | null> => {
    const formattedPhone = formatPhone(phone);
    const usersRef = ref(database, 'users');
    const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(formattedPhone));
    const snapshot = await get(phoneQuery);
    
    if (snapshot.exists()) {
      const userData = Object.values(snapshot.val())[0] as UserProfile;
      return userData.email;
    }
    return null;
  };

  const login = async (phone: string, password: string) => {
    try {
      const email = await getEmailByPhone(phone);
      
      if (!email) {
        toast({
          title: "Login Failed",
          description: "No account found with this phone number. Please check your phone number or register a new account.",
          variant: "destructive",
        });
        throw new Error("No account found with this phone number");
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      let message = "Invalid login credentials. Please check your phone number and password.";
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Incorrect password. Please try again or use 'Forgot Password' to reset it.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later or reset your password.";
      } else if (error.code === 'auth/user-disabled') {
        message = "This account has been disabled. Please contact support.";
      } else if (error.message === "No account found with this phone number") {
        throw error; // Already handled above
      }
      
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      // Check if phone already exists
      const phoneExists = await checkPhoneExists(phone);
      if (phoneExists) {
        toast({
          title: "Registration Failed",
          description: "This phone number is already registered with another account. Please use a different phone number or login with your existing account.",
          variant: "destructive",
        });
        throw new Error("Phone number already exists");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: newUser } = userCredential;
      
      await updateProfile(newUser, { displayName: fullName });
      
      const profile: UserProfile = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: fullName,
        phone: formatPhone(phone),
        balance: 0,
        bonusBalance: 0,
        createdAt: Date.now(),
      };
      
      await set(ref(database, `users/${newUser.uid}`), profile);
      
      toast({
        title: "Account Created!",
        description: "Welcome to MollyBet!",
      });
    } catch (error: any) {
      if (error.message === "Phone number already exists") {
        throw error;
      }
      
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please login or use a different email.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Invalid email address format.";
      }
      
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email inbox for instructions to reset your password.",
      });
    } catch (error: any) {
      let message = "Failed to send reset email. Please try again.";
      if (error.code === 'auth/user-not-found') {
        message = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Invalid email address format.";
      }
      
      toast({
        title: "Reset Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBalance = async (amount: number) => {
    if (!user || !userProfile) return;
    
    const newBalance = userProfile.balance + amount;
    await set(ref(database, `users/${user.uid}/balance`), newBalance);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      login, 
      register, 
      logout,
      updateBalance,
      resetPassword,
      checkPhoneExists
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
