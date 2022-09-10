import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import ThemeContextProvider from "./contexts/ThemeContextProvider";
import AlertContextProvider from "./contexts/AlertContextProvider";
import NavigationLayout from "./layouts/NavigationLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FormExample from "./containers/examples/FormExample";
import SchoolCreation from "./containers/School/SchoolCreation";
import SchoolUpdate from "./containers/School/SchoolUpdate";
import OrganizationCreation from "./containers/Organization/OrganizationCreation";
import OrganizationUpdate from "./containers/Organization/OrganizationUpdate";
import JobtypeCreation from "./containers/JobType/JobtypeCreation";
import JobtypeUpdate from "./containers/JobType/JobtypeUpdate";
import EmptypeCreation from "./containers/EmployeeType/EmptypeCreation";
import EmptypeUpdate from "./containers/EmployeeType/EmptypeUpdate";

import InstituteMaster from "./pages/InstituteMaster";

import SchoolForm from "./pages/SchoolForm";

function App() {
  return (
    <ThemeContextProvider>
      <AlertContextProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/login" />} />
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
            <Route exact path="/ResetPassword" element={<ResetPassword />} />
            <Route element={<NavigationLayout />}>
              <Route exact path="/FormExample" element={<FormExample />} />
              <Route exact path="/Dashboard" element={<></>} />
              {/* add your routes here */}

              <Route
                exact
                path="/InstituteMaster"
                element={<InstituteMaster />}
              />

              <Route
                exact
                path="/InstituteMaster/Emptype/Creation"
                element={<EmptypeCreation />}
              />

              <Route
                exact
                path="/InstituteMaster/Emptype/Update/:id"
                element={<EmptypeUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster/Jobtype/Creation"
                element={<JobtypeCreation />}
              />
              <Route
                exact
                path="/InstituteMaster/Jobtype/Update/:id"
                element={<JobtypeUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster/Organization/Creation"
                element={<OrganizationCreation />}
              />

              <Route
                exact
                path="/InstituteMaster/Organization/Update/:id"
                element={<OrganizationUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster/School/Creation"
                element={<SchoolCreation />}
              />

              <Route
                exact
                path="/InstituteMaster/School/Update/:id"
                element={<SchoolUpdate />}
              />

              <Route exact path="/head" element={<>Head</>} />
              <Route exact path="/heads" element={<>Heads</>} />
              <Route exact path="/test" element={<>Test</>} />
              <Route exact path="/tests" element={<>Tests</>} />
              <Route exact path="/main" element={<>Main</>} />
              <Route exact path="/mess" element={<>Mess</>} />
              <Route
                exact
                path="/online"
                element={
                  <>
                    <div>Online</div>
                    <Link to="/online/nav1">Nav1</Link>
                  </>
                }
              />
              <Route
                exact
                path="/online/nav1"
                element={
                  <>
                    <div>Nav1</div>
                    <Link to="/online/nav1/nav2">Nav2</Link>
                  </>
                }
              />
              <Route exact path="/online/nav1/nav2" element={<>Nav2</>} />
            </Route>
          </Routes>
        </Router>
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
