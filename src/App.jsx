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
import AcademicMaster from "./pages/masters/AcademicMaster";
import AdmissionMaster from "./pages/masters/AdmissionMaster";

// Institute master forms
import SchoolForm from "./pages/forms/instituteMaster/SchoolForm";
import OrganizationForm from "./pages/forms/instituteMaster/OrganizationForm";
import JobtypeForm from "./pages/forms/instituteMaster/JobtypeForm";
import EmptypeForm from "./pages/forms/instituteMaster/EmptypeForm";

// Navigation master forms
import ModuleForm from "./pages/forms/navigationMaster/ModuleForm";
import MenuForm from "./pages/forms/navigationMaster/MenuForm";
import SubmenuForm from "./pages/forms/navigationMaster/SubmenuForm";
import RoleForm from "./pages/forms/navigationMaster/RoleForm";

//Academic master forms
import DepartmentForm from "./pages/forms/academicMaster/DepartmentForm";
import DepartmentAssignmentForm from "./pages/forms/academicMaster/DepartmentAssignmentForm";
import ProgramForm from "./pages/forms/academicMaster/ProgramForm";
import ProgramAssignmentForm from "./pages/forms/academicMaster/ProgramAssignmentForm";
import ProgramSpecializationForm from "./pages/forms/academicMaster/ProgramSpecializationForm";

//Admission master forms
import AdmCategoryForm from "./pages/forms/admissionMaster/AdmCategoryForm";
import AdmSubCategoryForm from "./pages/forms/admissionMaster/AdmSubcategoryForm";
import BoardForm from "./pages/forms/admissionMaster/BoardForm";
import CurrencytypeForm from "./pages/forms/admissionMaster/CurrencyForm";
import ProgramtypeForm from "./pages/forms/admissionMaster/ProgramtypeForm";

//UserCreation
import UserForm from "./pages/forms/UserForm";
import UserIndex from "./containers/indeces/UserIndex";

//JobPortalMaster
import JobPortal from "./containers/indeces/jobPortalMaster/JobPortal";
import CandidateAttachmentView from "./pages/forms/jobPortal/CandidateAttachmentView";
import InterView from "./pages/forms/jobPortal/InterView";
import HodComments from "./containers/indeces/jobPortalMaster/HodComments";

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
                  path="/InstituteMaster/Emptype/New"
                  element={<EmptypeForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Emptype/Update/:id"
                  element={<EmptypeForm />}
                />

                <Route
                  exact
                  path="/InstituteMaster/Jobtype/New"
                  element={<JobtypeForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Jobtype/Update/:id"
                  element={<JobtypeForm />}
                />

                <Route
                  exact
                  path="/InstituteMaster/Organization/New"
                  element={<OrganizationForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Organization/Update/:id"
                  element={<OrganizationForm />}
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
                <Route exact path="/UserForm" element={<UserForm />} />
                <Route exact path="/UserIndex" element={<UserIndex />} />
                <Route exact path="/JobPortal" element={<JobPortal />} />
                <Route
                  exact
                  path="/Interview/New/:id"
                  element={<InterView />}
                />
                <Route
                  exact
                  path="/Interview/Update/:id"
                  element={<InterView />}
                />
                <Route exact path="/HodComments" element={<HodComments />} />
              </>

              {/*Academic Master */}
              <>
                <Route
                  exact
                  path="/AcademicMaster"
                  element={<AcademicMaster />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Department/New"
                  element={<DepartmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Department/Update/:id"
                  element={<DepartmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/DepartmentAssignment/New"
                  element={<DepartmentAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/DepartmentAssignment/Update/:id"
                  element={<DepartmentAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Program/New"
                  element={<ProgramForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Program/Update/:id"
                  element={<ProgramForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramAssignment/New"
                  element={<ProgramAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramAssignment/Update/:id"
                  element={<ProgramAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramSpecialization/New"
                  element={<ProgramSpecializationForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramSpecialization/Update/:id"
                  element={<ProgramSpecializationForm />}
                />
              </>

              {/*Admission Master */}
              <>
                <Route
                  exact
                  path="/AdmissionMaster"
                  element={<AdmissionMaster />}
                />

                <Route
                  exact
                  path="/AdmissionMaster/AdmissionCategory/New"
                  element={<AdmCategoryForm />}
                />
                <Route
                  exact
                  path="/AdmissionMaster/AdmissionCategory/Update/:id"
                  element={<AdmCategoryForm />}
                />

                <Route
                  exact
                  path="/AdmissionMaster/AdmissionSubCategory/New"
                  element={<AdmSubCategoryForm />}
                />
                <Route
                  exact
                  path="/AdmissionMaster/AdmissionSubCategory/Update/:id"
                  element={<AdmSubCategoryForm />}
                />

                <Route
                  exact
                  path="/AdmissionMaster/Board/New"
                  element={<BoardForm />}
                />
                <Route
                  exact
                  path="/AdmissionMaster/Board/Update/:id"
                  element={<BoardForm />}
                />

                <Route
                  exact
                  path="/AdmissionMaster/Currency/New"
                  element={<CurrencytypeForm />}
                />
                <Route
                  exact
                  path="/AdmissionMaster/Currency/Update/:id"
                  element={<CurrencytypeForm />}
                />

                <Route
                  exact
                  path="/AdmissionMaster/ProgramType/New"
                  element={<ProgramtypeForm />}
                />
                <Route
                  exact
                  path="/AdmissionMaster/ProgramType/Update/:id"
                  element={<ProgramtypeForm />}
                />
              </>
            </Route>
            <Route
              exact
              path="/CandidateAttachment/:id/:type"
              element={<CandidateAttachmentView />}
            />
          </Routes>
        </Router>
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
