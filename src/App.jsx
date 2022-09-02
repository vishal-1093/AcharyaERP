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

import BoardCreation from "./containers/Board/BoardCreation";
import BoardIndex from "./containers/Board/BoardIndex";
import MenuCreation from "./containers/Menu/MenuCreation";
import MenuIndex from "./containers/Menu/MenuIndex";
import MenuUpdate from "./containers/Menu/MenuUpdate";

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

import AdmCategoryCreation from "./containers/AdmissionCategory/AdmCategoryCreation";
import AdmCategoryIndex from "./containers/AdmissionCategory/AdmCategoryIndex";
import AdmCategoryUpdate from "./containers/AdmissionCategory/AdmCategoryUpdate";
import AdmSubCategoryCreation from "./containers/AdmissionSubCategory/AdmSubCategoryCreation";
import AdmSubCategoryIndex from "./containers/AdmissionSubCategory/AdmSubCategoryIndex";
import AdmSubCategoryUpdate from "./containers/AdmissionSubCategory/AdmSubCategoryUpdate";
import BoardUpdate from "./containers/Board/BoardUpdate";
import ProgramCreation from "./containers/Program/ProgramCreation";
import ProgramIndex from "./containers/Program/ProgramIndex";
import ProgramUpdate from "./containers/Program/ProgramUpdate";
import ProgramtypeCreation from "./containers/ProgramType/ProgramtypeCreation";
import ProgramtypeIndex from "./containers/ProgramType/ProgramtypeIndex";
import ProgramtypeUpdate from "./containers/ProgramType/ProgramtypeUpdate";
import CurrencytypeCreation from "./containers/CurrencyType/CurrencytypeCreation";
import CurrencytypeIndex from "./containers/CurrencyType/CurrencytypeIndex";
import CurrencytypeUpdate from "./containers/CurrencyType/CurrencytypeUpdate";
import GraduationCreation from "./containers/Graduation/GraduationCreation";
import GraduationIndex from "./containers/Graduation/GraduationIndex";
import GraduationUpdate from "./containers/Graduation/GraduationUpdate";
import ModuleCreation from "./containers/Module/ModuleCreation";
import ModuleIndex from "./containers/Module/ModuleIndex";
import ModuleUpdate from "./containers/Module/ModuleUpdate";
import SubmenuCreation from "./containers/SubMenu/SubmenuCreation";
import SubmenuIndex from "./containers/SubMenu/SubmenuIndex";
import SubmenuUpdate from "./containers/SubMenu/SubmenuUpdate";
import GroupCreation from "./containers/Group/GroupCreation";
import GroupIndex from "./containers/Group/GroupIndex";
import GroupUpdate from "./containers/Group/GroupUpdate";
import LedgerCreation from "./containers/Ledger/LedgerCreation";
import LedgerIndex from "./containers/Ledger/LedgerIndex";
import LedgerUpdate from "./containers/Ledger/LedgerUpdate";
import TallyheadCreation from "./containers/TallyHead/TallyheadCreation";
import TallyheadIndex from "./containers/TallyHead/TallyheadIndex";
import TallyheadUpdate from "./containers/TallyHead/TallyheadUpdate";
import FinancialyearCreation from "./containers/FinancialYear/FinancialyearCreation";
import FinancialyearIndex from "./containers/FinancialYear/FinancialyearIndex";
import FinancialyearUpdate from "./containers/FinancialYear/FinancialyearUpdate";
import ProgramSpecializationCreation from "./containers/ProgramSpecialization/ProgramSpecializationCreation";
import ProgramSpecializationIndex from "./containers/ProgramSpecialization/ProgramSpecializationIndex";
import ProgramSpecializationUpdate from "./containers/ProgramSpecialization/ProgramSpecializationUpdate";
import ProgramAssCreation from "./containers/ProgramAssignment/ProgramAssCreation";
import InstituteMaster from "./containers/Tab/InstituteMaster";
import ProgramAssIndex from "./containers/ProgramAssignment/ProgramAssIndex";
import ProgramAssUpdate from "./containers/ProgramAssignment/ProgramAssUpdate";
import DepartmentCreation from "./containers/Department/DepartmentCreation";
import DepartmentIndex from "./containers/Department/DepartmentIndex";
import DepartmentUpdate from "./containers/Department/DepartmentUpdate";
import DepartmentAssignmentCreation from "./containers/DepartmentAssignment/DepartmentAssignmentCreation";
import DepartmentAssignmentIndex from "./containers/DepartmentAssignment/DepartmentAssignmentIndex";
import DepartmentAssignmentUpdate from "./containers/DepartmentAssignment/DepartmentAssignmentUpdate";

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
                path="/SchoolCreation"
                element={<SchoolCreation />}
              />
              <Route exact path="/SchoolIndex" element={<SchoolIndex />} />
              <Route
                exact
                path="/SchoolUpdate/:id"
                element={<SchoolUpdate />}
              />
              <Route
                exact
                path="/EmptypeCreation"
                element={<EmptypeCreation />}
              />
              <Route exact path="/EmptypeIndex" element={<EmptypeIndex />} />
              <Route
                exact
                path="/EmptypeUpdate/:id"
                element={<EmptypeUpdate />}
              />

              <Route
                exact
                path="/OrganizationUpdate/:id"
                element={<OrganizationUpdate />}
              />

              <Route
                exact
                path="/OrganizationIndex"
                element={<OrganizationIndex />}
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
