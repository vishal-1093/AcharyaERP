import React from "react";
import ThemeContext from "./utils/ThemeContext";
import Login from "./containers/Login/Login";
import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";
import ResetPassword from "./containers/ResetPassword/ResetPassword";
import FormExample from "./containers/examples/FormExample";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeContext>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
          <Route exact path="/ResetPassword" element={<ResetPassword />} />
          <Route exact path="/FormExample" element={<FormExample />} />
        </Routes>
      </Router>
    </ThemeContext>
  );
}

export default App;
