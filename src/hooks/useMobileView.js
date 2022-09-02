import { useContext } from "react";
import { ViewContext } from "../contexts/ViewContextProvider";

const useMobileView = () => {
  const context = useContext(ViewContext);

  if (!context)
    throw Error("useMobileView must be used inside ViewContextProvider");

  return context;
};

export default useMobileView;
