import React from "react";

import Login from "./containers/Login/Login";
import ThemeContext from "./utils/ThemeContext";

import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";
import ResetPassword from "./containers/ResetPassword/ResetPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeContext>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>

          <Route
            exact
            path="/ForgotPassword"
            element={<ForgotPassword />}
          ></Route>
          <Route
            exact
            path="/ResetPassword"
            element={<ResetPassword />}
          ></Route>
        </Routes>
      </Router>
    </ThemeContext>
  );
}

export default App;
