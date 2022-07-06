import React from "react";
// import CustomizedSteppers from './components/Steppers/DesktopFormStepper';
import UserCreationForm from "./components/Forms/UserCreationForm";
import FormGroup from "@mui/material/FormGroup";
import Login from "./Containers/Login";
import Header from "./components/Header";
import ThemeContext from "./utils/ThemeContext";

import Navigationbar from "./components/academic/Navigationbar";
import Sidebar from "./components/academic/Sidebar";
// import Menubar from "./components/academic/MenuBar";
// import Toolbar from "./components/academic/Toolbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <ThemeContext>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route
            exact
            path="/Navigationbar"
            element={<Navigationbar />}
          ></Route>
        </Routes>
      </Router>
    </ThemeContext>
  );
}

export default App;
