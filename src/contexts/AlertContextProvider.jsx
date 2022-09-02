import { createContext, useState } from "react";
import CustomAlert from "../components/CustomAlert";

export const AlertContext = createContext();

function AlertContextProvider({ children }) {
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <AlertContext.Provider value={{ setAlertMessage, setAlertOpen }}>
      <CustomAlert
        open={alertOpen}
        setOpen={setAlertOpen}
        severity={alertMessage.severity}
        message={alertMessage.message}
      />
      {children}
    </AlertContext.Provider>
  );
}

export default AlertContextProvider;
