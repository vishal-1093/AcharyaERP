import React from "react";
import ThemeContextProvider from "./contexts/ThemeContextProvider";
import AlertContextProvider from "./contexts/AlertContextProvider";
import RouteConfig from "./Routes";

function App() {
  return (
    <ThemeContextProvider>
      <AlertContextProvider>
        <RouteConfig />
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
