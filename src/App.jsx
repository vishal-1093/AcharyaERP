import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import ThemeContextProvider from "./contexts/ThemeContextProvider";
import AlertContextProvider from "./contexts/AlertContextProvider";
import NavigationLayout from "./Layouts/NavigationLayout";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FormExample from "./containers/examples/FormExample";

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

import InstituteMaster from "./containers/Tab/InstituteMaster";
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
              {/* add your routes here */}

              <Route
                exact
                path="/InstituteMaster/EmptypeCreation"
                element={<EmptypeCreation />}
              />
              <Route
                exact
                path="/InstituteMaster/EmptypeIndex"
                element={<EmptypeIndex />}
              />
              <Route
                exact
                path="/InstituteMaster/EmptypeUpdate/:id"
                element={<EmptypeUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster/JobtypeCreation"
                element={<JobtypeCreation />}
              />
              <Route
                exact
                path="/InstituteMaster/JobtypeIndex"
                element={<JobtypeIndex />}
              />
              <Route
                exact
                path="/InstituteMaster/JobtypeUpdate/:id"
                element={<JobtypeUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster/OrganizationCreation"
                element={<OrganizationCreation />}
              />
              <Route
                exact
                path="/InstituteMaster/OrganizationUpdate/:id"
                element={<OrganizationUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster/OrganizationIndex"
                element={<OrganizationIndex />}
              />

              <Route
                exact
                path="/InstituteMaster/SchoolCreation"
                element={<SchoolCreation />}
              />
              <Route
                exact
                path="/InstituteMaster/SchoolIndex"
                element={<SchoolIndex />}
              />
              <Route
                exact
                path="/InstituteMaster/SchoolUpdate/:id"
                element={<SchoolUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster"
                element={<InstituteMaster />}
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
