import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ThemeContextProvider from "./contexts/ThemeContextProvider";
import AlertContextProvider from "./contexts/AlertContextProvider";
import NavigationLayout from "./layouts/NavigationLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FormExample from "./containers/examples/FormExample";

// Master pages
import InstituteMaster from "./pages/masters/InstituteMaster";
import NavigationMaster from "./pages/masters/NavigationMaster";

// Institute master forms
import SchoolForm from "./pages/forms/SchoolForm";
import OrganizationCreation from "./containers/Organization/OrganizationCreation";
import OrganizationUpdate from "./containers/Organization/OrganizationUpdate";
import JobtypeCreation from "./containers/JobType/JobtypeCreation";
import JobtypeUpdate from "./containers/JobType/JobtypeUpdate";
import EmptypeCreation from "./containers/EmployeeType/EmptypeCreation";
import EmptypeUpdate from "./containers/EmployeeType/EmptypeUpdate";

// Navigation master forms
import ModuleForm from "./pages/forms/ModuleForm";
import MenuForm from "./pages/forms/MenuForm";
import SubmenuForm from "./pages/forms/SubmenuForm";
import RoleForm from "./pages/forms/RoleForm";

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

              {/* Institute Master */}
              <>
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
                  path="/InstituteMaster/School/New"
                  element={<SchoolForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/School/Update/:id"
                  element={<SchoolForm />}
                />
              </>

              {/* Navigation Master */}
              <>
                <Route
                  exact
                  path="/NavigationMaster"
                  element={<NavigationMaster />}
                />

                <Route
                  exact
                  path="/NavigationMaster/Module/New"
                  element={<ModuleForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Module/Update/:id"
                  element={<ModuleForm />}
                />

                <Route
                  exact
                  path="/NavigationMaster/Menu/New"
                  element={<MenuForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Menu/Update/:id"
                  element={<MenuForm />}
                />

                <Route
                  exact
                  path="/NavigationMaster/Submenu/New"
                  element={<SubmenuForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Submenu/Update/:id"
                  element={<SubmenuForm />}
                />

                <Route
                  exact
                  path="/NavigationMaster/Role/New"
                  element={<RoleForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Role/Update/:id"
                  element={<RoleForm />}
                />
              </>
            </Route>
          </Routes>
        </Router>
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
