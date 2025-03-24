"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompetitionProvider } from "./TradingCompetition/CompetitionContext";

// -- FIREBASE IMPORTS --
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// 1. Create a Firebase config using env variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Initialize Firebase app + auth
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// 3. Create a context so other components can read the user
interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextValue>({ user: null, loading: true });

// 4. Optional hook to read user context
export function useAuth() {
  return React.useContext(AuthContext);
}

// 5. We also keep the React Query Client
const queryClient = new QueryClient();

// 6. Our main Providers wrapper
export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Listen for changes to the Firebase Auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* AuthContext provides user + loading to the entire app */}
      <AuthContext.Provider value={{ user, loading }}>
        <CompetitionProvider>
          {children}
        </CompetitionProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}


