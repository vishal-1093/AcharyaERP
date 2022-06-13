import React from "react";
// import CustomizedSteppers from './components/Steppers/DesktopFormStepper';
import StepperForm from './components/Forms/stepperForm';
import FormGroup from '@mui/material/FormGroup';
import Header from "./components/Header";
import ThemeContext from "./utils/ThemeContext";


function App() {

  return (
    <ThemeContext>
      <FormGroup>
        <Header />
        {/* <CustomizedSteppers /> */}
        <StepperForm />
      </FormGroup>
    </ThemeContext>
  );
}

export default App;
