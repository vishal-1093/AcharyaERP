import { useContext } from "react";
import { BreadcrumbsContext } from "../contexts/BreadcrumbsContextProvider";

const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);

  if (!context)
    throw Error(
      "useBreadcrumbs must be used inside BreadcrumbsContextProvider"
    );

  return context;
};

export default useBreadcrumbs;
