import { useContext } from "react";
import { AlertContext } from "../contexts/AlertContextProvider";

const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context)
    throw Error("useAlert must be used inside AlertContextProvider");

  return context;
};

export default useAlert;
