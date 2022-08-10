import React from "react";
import ThemeContext from "./utils/ThemeContext";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import FormExample from "./containers/examples/FormExample";
import AcademicYearCreation from "./containers/AcademicYear/AcademicYearCreation";
import AcademicYearIndex from "./containers/AcademicYear/AcademicYearIndex";
import AcademicYearUpdate from "./containers/AcademicYear/AcademicYearUpdate";
import SchoolCreation from "./containers/School/SchoolCreation";
import SchoolIndex from "./containers/School/SchoolIndex";
import SchoolUpdate from "./containers/School/SchoolUpdate";
import OrganizationCreation from "./containers/Organization/OrganizationCreation";
import OrganizationIndex from "./containers/Organization/OrganizationIndex";
import OrganizationUpdate from "./containers/Organization/OrganizationUpdate";
import JobtypeCreation from "./containers/JobType/JobtypeCreation";
import JobtypeIndex from "./containers/JobType/JobtypeIndex";
import JobtypeUpdate from "./containers/JobType/JobtypeUpdate";
import EmptypeCreation from "./containers/EmployeeType/EmptypeCreation";
import EmptypeIndex from "./containers/EmployeeType/EmptypeIndex";
import EmptypeUpdate from "./containers/EmployeeType/EmptypeUpdate";

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
          <Route
            exact
            path="/AcademicYearCreation"
            element={<AcademicYearCreation />}
          />
          <Route
            exact
            path="/AcademicYearIndex"
            element={<AcademicYearIndex />}
          />
          <Route
            exact
            path="/AcademicYearUpdate/:id"
            element={<AcademicYearUpdate />}
          />
          <Route exact path="/SchoolCreation" element={<SchoolCreation />} />
          <Route exact path="/SchoolIndex" element={<SchoolIndex />} />
          <Route exact path="/SchoolUpdate/:id" element={<SchoolUpdate />} />
          <Route exact path="/EmptypeCreation" element={<EmptypeCreation />} />
          <Route exact path="/EmptypeIndex" element={<EmptypeIndex />} />
          <Route exact path="/EmptypeUpdate/:id" element={<EmptypeUpdate />} />

          <Route exact path="/JobtypeCreation" element={<JobtypeCreation />} />
          <Route exact path="/JobtypeIndex" element={<JobtypeIndex />} />
          <Route exact path="/JobtypeUpdate/:id" element={<JobtypeUpdate />} />
          <Route
            exact
            path="/OrganizationUpdate/:id"
            element={<OrganizationUpdate />}
          />
          <Route
            exact
            path="/OrganizationCreation"
            element={<OrganizationCreation />}
          />
          <Route
            exact
            path="/OrganizationIndex"
            element={<OrganizationIndex />}
          />
        </Routes>
      </Router>
    </ThemeContext>
  );
}

export default App;
