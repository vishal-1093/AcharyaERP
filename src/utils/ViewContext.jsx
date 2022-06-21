import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useContext } from "react";
import { useTheme } from "@mui/material";

const MobileViewContext = (createContext < boolean) | (undefined > undefined);

export const useMobileView = () => useContext(MobileViewContext);

function ViewContext({ children }) {
  const theme = useTheme();

  const maxMobileWidth = theme.breakpoints.values.md;

  const [isMobile, setIsMobile] =
    (useState < boolean) | (undefined > undefined);

  useEffect(() => {
    if (window.innerWidth < maxMobileWidth) setIsMobile(true);
    else setIsMobile(false);
  }, [maxMobileWidth]);

  return (
    <MobileViewContext.Provider value={isMobile}>
      {children}
    </MobileViewContext.Provider>
  );
}

export default ViewContext;
