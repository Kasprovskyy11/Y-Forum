// src/contexts/UserContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type User = {
  name: string; // unikalny login
  username: string; // wyświetlana nazwa
  email: string;
  profilePhoto: string; // ścieżka do profilowego
  birthDate: string;
  isAdmin?: boolean;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // przy starcie sprawdzamy localStorage
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const saveUser = (user: User | null) => {
    if (user) localStorage.setItem("userData", JSON.stringify(user));
    else localStorage.removeItem("userData");
    setUser(user);
  };

  const logout = () => saveUser(null);

  return (
    <UserContext.Provider value={{ user, setUser: saveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do używania kontekstu
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
