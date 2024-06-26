import React, { createContext, useState } from "react";

type SnackbarTypeValues = "error" | "success";

interface SnackbarContextType {
  snackbarMessage: string;
  snackbarType: SnackbarTypeValues;
  isSnackbarOpen: boolean;
  setSnackbar: (type: SnackbarTypeValues, message: string) => void;
  hideSnackbar: () => void;
}

interface SnackbarContextProps {
  children: React.ReactNode;
}

const defaultState: SnackbarContextType = {
  snackbarMessage: "",
  snackbarType: "success",
  isSnackbarOpen: false,
  setSnackbar: () => {},
  hideSnackbar: () => {},
};

const SnackbarContext = createContext<SnackbarContextType>(defaultState);

const SnackbarProvider: React.FC<SnackbarContextProps> = ({ children }) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarType, setSnackbarType] = useState<SnackbarTypeValues>("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarTimeoutId, setSnackbarTimeoutId] = useState<number | null>(null);

  const setSnackbar = (type: SnackbarTypeValues, message: string) => {
    if (snackbarTimeoutId !== null) {
      clearTimeout(snackbarTimeoutId);
    }

    setSnackbarType(type);
    setSnackbarMessage(message);
    setIsSnackbarOpen(true);

    const timeoutId = setTimeout(() => {
      setIsSnackbarOpen(false);
      setSnackbarTimeoutId(null);
    }, 5000);
    setSnackbarTimeoutId(timeoutId);
  };

  const hideSnackbar = () => {
    if (snackbarTimeoutId !== null) {
      clearTimeout(snackbarTimeoutId);
    }
    setIsSnackbarOpen(false);
    setSnackbarTimeoutId(null);
  };

  const value = { snackbarMessage, snackbarType, isSnackbarOpen, setSnackbar, hideSnackbar };

  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
};
export { SnackbarContext, SnackbarProvider };
