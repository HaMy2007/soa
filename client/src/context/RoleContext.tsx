import React, { useState, createContext, useContext } from "react";

type RoleContextType = {
  role: string;
  setRole: (role: string) => void;
};

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined
);

type RoleProviderProps = {
  children: React.ReactNode;
};

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRole] = useState("customer");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
