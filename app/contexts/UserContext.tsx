// contexts/UserContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getUser } from "@/lib/services/items";

type User = any; // replace 'any' with your actual user type

interface UserContextValue {
  user: User | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  refreshUser: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Expose user and a function to refresh
  const contextValue: UserContextValue = {
    user,
    refreshUser: fetchUser,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
