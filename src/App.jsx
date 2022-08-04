import React from "react";
import ThemeContext from "./utils/ThemeContext";
import FormExample from "./containers/examples/FormExample";

function App() {
  return (
    <ThemeContext>
      <FormExample />
    </ThemeContext>
  );
}

export default App;
