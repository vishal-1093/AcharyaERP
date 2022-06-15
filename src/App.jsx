import React from "react";
// import CustomizedSteppers from './components/Steppers/DesktopFormStepper';
import UserCreationForm from './components/Forms/UserCreationForm';
import FormGroup from '@mui/material/FormGroup';
import Header from "./components/Header";
import ThemeContext from "./utils/ThemeContext";
import Login from "./components/Pages/Login";
import Navigationbar from "./components/Pages/Navigationbar";
function App() {

  return (
    <ThemeContext>
      {/* <FormGroup> */}
        <Header />
        {/* <CustomizedSteppers /> */}
        <UserCreationForm/>
      {/* </FormGroup> */}
      {/* <Login/> */}
      {/* <Navigationbar/> */}
    </ThemeContext>
  );
}

export default App;
