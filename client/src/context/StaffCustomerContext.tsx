import React, { createContext, useContext, useEffect, useState } from "react";

type StaffCustomerRole = "staff" | "customer";

type StaffCustomerContextType = {
  currentRole: StaffCustomerRole;
  isTableOpened: boolean;
  selectedTable: string | null;
  switchToCustomer: (table: string) => void;
  switchToStaff: (secretCode: string) => Promise<boolean>;
  clearTableData: () => void;
  setIsTableOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentRole: React.Dispatch<React.SetStateAction<StaffCustomerRole>>;
  getCurrentTableNumber: () => number | null;
};

const StaffCustomerContext = createContext<
  StaffCustomerContextType | undefined
>(undefined);

type StaffCustomerProviderProps = {
  children: React.ReactNode;
};

const STAFF_SECRET = "ChangeTable";

export const StaffCustomerProvider = ({
  children,
}: StaffCustomerProviderProps) => {
  const [currentRole, setCurrentRole] = useState<StaffCustomerRole>("staff");
  const [isTableOpened, setIsTableOpened] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("staffCustomerRole");
    const savedTable = localStorage.getItem("openedTable");

    if (savedRole === "customer") {
      setCurrentRole("customer");
    }

    if (savedTable) {
      try {
        const parsed = JSON.parse(savedTable);
        if (parsed.isOpened) {
          setSelectedTable(parsed.name);
          setIsTableOpened(true);
        }
      } catch (error) {
        console.error("Error parsing saved table:", error);
      }
    }
  }, []);

  const getCurrentTableNumber = () => {
    const opened = localStorage.getItem("openedTable");
    if (!opened) return null;
  
    const parsed = JSON.parse(opened);
    if (parsed.isOpened && parsed.name.startsWith("Table ")) {
      return parseInt(parsed.name.replace("Table ", ""));
    }
    return null;
  };  

  const switchToCustomer = (table: string) => {
    setCurrentRole("customer");
    setSelectedTable(table);
    setIsTableOpened(true);
    localStorage.setItem("staffCustomerRole", "customer");
    localStorage.setItem(
      "openedTable",
      JSON.stringify({
        name: table,
        isOpened: true,
      })
    );
  };

  const switchToStaff = async (secretCode: string): Promise<boolean> => {
    if (secretCode === STAFF_SECRET) {
      setCurrentRole("staff");
      localStorage.setItem("staffCustomerRole", "staff");
      return true;
    }
    return false;
  };

  const clearTableData = () => {
    setSelectedTable(null);
    setIsTableOpened(false);
    localStorage.removeItem("openedTable");
  };

  return (
    <StaffCustomerContext.Provider
      value={{
        setCurrentRole,
        currentRole,
        isTableOpened,
        selectedTable,
        switchToCustomer,
        switchToStaff,
        clearTableData,
        setIsTableOpened,
        getCurrentTableNumber,
      }}
    >
      {children}
    </StaffCustomerContext.Provider>
  );
};

export const useStaffCustomer = () => {
  const context = useContext(StaffCustomerContext);
  if (context === undefined) {
    throw new Error(
      "useStaffCustomer must be used within a StaffCustomerProvider"
    );
  }
  return context;
};
