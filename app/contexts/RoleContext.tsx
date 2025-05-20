// contexts/RoleContext.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";


interface RoleContextType {
  role: string | null;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}
const supabase = createClient();

export function RoleProvider({ children }: RoleProviderProps) {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log("🎯 RoleProvider Mounted");

  useEffect(() => {
    console.log("🎯 RoleProvider useEffect triggered");
    
    const fetchRole = async () => {
      console.log("🎯 fetchRole started");
      try {
        console.log("🎯 Getting auth user...");
        const { data: { user } } = await supabase.auth.getUser();
        console.log("🎯 Auth User Result:", user);
        
        if (user) {
          console.log("🎯 User found, fetching role...");
          const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();
            
          console.log("🎯 Role query result:", { data, error });
          
          if (error) throw error;
          setRole(data.role);
          console.log("🎯 Role set to:", data.role);
        } else {
          console.log("🎯 No authenticated user found");
        }
      } catch (error) {
        console.error("🎯 Error in fetchRole:", error);
      } finally {
        setIsLoading(false);
        console.log("🎯 Loading state set to false");
      }
    };

    fetchRole();
  }, []);
  
  const contextValue = { role, isLoading };
  console.log("🎯 RoleProvider rendering with value:", contextValue);

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRoleContext = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
};
