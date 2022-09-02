import { createContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material";

export const ViewContext = createContext();

function ViewContextProvider({ children }) {
  const theme = useTheme();

  const maxMobileWidth = theme.breakpoints.values.md;

  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    if (window.innerWidth < maxMobileWidth) setIsMobile(true);
    else setIsMobile(false);
  }, [maxMobileWidth]);

  return (
    <ViewContext.Provider value={isMobile}>{children}</ViewContext.Provider>
  );
}

export default ViewContextProvider;
