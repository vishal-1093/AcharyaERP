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
import Profile from "./pages/Profile";

// Master pages
import InstituteMaster from "./pages/masters/InstituteMaster";
import NavigationMaster from "./pages/masters/NavigationMaster";
import AcademicMaster from "./pages/masters/AcademicMaster";
import AdmissionMaster from "./pages/masters/AdmissionMaster";
import DesignationMaster from "./pages/masters/DesignationMaster";
import ShiftMaster from "./pages/masters/ShiftMaster";
import AccountMaster from "./pages/masters/AccountMaster";
import AcademicCalendars from "./pages/masters/AcademicCalendars";
import SalaryMaster from "./pages/masters/SalaryMaster";
import InventoryMaster from "./pages/masters/InventoryMaster";
import TranscriptMaster from "./pages/masters/TranscriptMaster";
import InfrastructureMaster from "./pages/masters/InfrastructureMaster";
import HolidayCalenderMaster from "./pages/masters/HolidayCalenderMaster";

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

// Academic master forms
import DepartmentForm from "./pages/forms/academicMaster/DepartmentForm";
import DepartmentAssignmentForm from "./pages/forms/academicMaster/DepartmentAssignmentForm";
import ProgramForm from "./pages/forms/academicMaster/ProgramForm";
import ProgramAssignmentForm from "./pages/forms/academicMaster/ProgramAssignmentForm";
import ProgramSpecializationForm from "./pages/forms/academicMaster/ProgramSpecializationForm";

// Admission master forms
import AdmCategoryForm from "./pages/forms/admissionMaster/AdmCategoryForm";
import AdmSubCategoryForm from "./pages/forms/admissionMaster/AdmSubcategoryForm";
import BoardForm from "./pages/forms/admissionMaster/BoardForm";
import CurrencytypeForm from "./pages/forms/admissionMaster/CurrencyForm";
import ProgramtypeForm from "./pages/forms/admissionMaster/ProgramtypeForm";

// User Creation
import UserForm from "./pages/forms/UserForm";
import UserIndex from "./pages/indeces/UserIndex";

// Job Portal
import JobPortalIndex from "./pages/indeces/JobPortalIndex";
import HodCommentsIndex from "./pages/indeces/HodCommentsIndex";
import CandidateAttachmentView from "./pages/forms/jobPortal/CandidateAttachmentView";
import InterView from "./pages/forms/jobPortal/InterView";
import ResultForm from "./pages/forms/jobPortal/ResultForm";
import SalaryBreakupForm from "./pages/forms/jobPortal/SalaryBreakupForm";
import SalaryBreakupPrint from "./pages/forms/jobPortal/SalaryBreakupPrint";
import OfferLetterPrint from "./pages/forms/jobPortal/OfferLetterPrint";
import OfferForm from "./pages/forms/jobPortal/OfferForm";
import RecruitmentForm from "./pages/forms/jobPortal/RecruitmentForm";
import EmployeeIndex from "./pages/indeces/EmployeeIndex";
import OfferAccepted from "./pages/forms/jobPortal/OfferAccepted";

// Designation Master forms
import DesignationForm from "./pages/forms/designationMaster/DesignationForm";

// Shift Master Forms
import ShiftForm from "./pages/forms/shiftMaster/ShiftForm";

// Account master
import GroupForm from "./pages/forms/accountMaster/GroupForm";
import LedgerForm from "./pages/forms/accountMaster/LedgerForm";
import TallyheadForm from "./pages/forms/accountMaster/TallyheadForm";
import VoucherForm from "./pages/forms/accountMaster/VoucherForm";
import VoucherAssignmentForm from "./pages/forms/accountMaster/VoucherAssignmentForm";

// Academic Calendars
import AcademicyearForm from "./pages/forms/academicCalendars/AcademicyearForm";
import CalenderyearForm from "./pages/forms/academicCalendars/CalenderyearForm";
import FinancialyearForm from "./pages/forms/academicCalendars/FinancialyearForm";

// Salary Master
import SalaryStructureHeadForm from "./pages/forms/salaryMaster/SalaryStructureHeadForm";
import SalaryStructureForm from "./pages/forms/salaryMaster/SalaryStructureForm";
import SalaryStructureAssignment from "./pages/forms/salaryMaster/SalaryStructureAssignment";
import SlabStructureForm from "./pages/forms/salaryMaster/SlabStructureForm";

// InventoryMaster
import StoreForm from "./pages/forms/inventoryMaster/StoreForm";
import MeasureForm from "./pages/forms/inventoryMaster/MeasureForm";

// Transcript Master Forms
import TranscriptForm from "./pages/forms/TranscriptMaster/TranscriptForm";
import TranscriptAssignmentForm from "./pages/forms/TranscriptMaster/TranscriptAssignmentForm";

// InfrastructureMaster Forms
import FacilityForm from "./pages/forms/InfrastructureMaster/FacilityForm";
import BlockForm from "./pages/forms/InfrastructureMaster/BlockForm";
import RoomForm from "./pages/forms/InfrastructureMaster/RoomForm";

// HolidayCalenderMaster Forms
import HolidayCalenderForm from "./pages/forms/HolidayCalenderMaster/HolidayCalenderForm";
import DeAssignDepartment from "./pages/forms/HolidayCalenderMaster/DeAssignDepartment";

function App() {
  const token = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.token;

  return (
    <ThemeContextProvider>
      <AlertContextProvider>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                token ? (
                  <Navigate replace to="/Dashboard" />
                ) : (
                  <Navigate replace to="/Login" />
                )
              }
            />
            <Route exact path="/Login" element={<Login />}></Route>
            <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
            <Route exact path="/ResetPassword" element={<ResetPassword />} />

            <Route element={<NavigationLayout />}>
              <Route exact path="/FormExample" element={<FormExample />} />
              <Route exact path="/Dashboard" element={<></>} />
              <Route exact path="/Profile" element={<Profile />} />

              {/* Institute Master */}
              <>
                <Route
                  exact
                  path={"/InstituteMaster"}
                  element={
                    <Navigate replace to="/InstituteMaster/Organization" />
                  }
                />
                {[
                  "/InstituteMaster/Organization",
                  "/InstituteMaster/School",
                  "/InstituteMaster/JobType",
                  "/InstituteMaster/EmpType",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<InstituteMaster />}
                  />
                ))}

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
                  path={"/NavigationMaster"}
                  element={<Navigate replace to="/NavigationMaster/Module" />}
                />
                {[
                  "/NavigationMaster/Module",
                  "/NavigationMaster/Menu",
                  "/NavigationMaster/Submenu",
                  "/NavigationMaster/Role",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<NavigationMaster />}
                  />
                ))}

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
              {/*Salary Master */}
              <>
                <Route
                  exact
                  path={"/SalaryMaster"}
                  element={
                    <Navigate replace to="/SalaryMaster/SalaryStructure" />
                  }
                />
                {[
                  "/SalaryMaster/SalaryStructure",
                  "/SalaryMaster/SalaryHead",
                  "/SalaryMaster/Assignment",
                  "/SalaryMaster/SlabDefinition",
                  "/SalaryMaster/SlabStructure",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<SalaryMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/SalaryMaster/SalaryStructure/New"
                  element={<SalaryStructureForm />}
                />
                <Route
                  exact
                  path="/SalaryMaster/SalaryStructure/Update/:id"
                  element={<SalaryStructureForm />}
                />
                <Route
                  exact
                  path="/SalaryMaster/SalaryStructureHead/New"
                  element={<SalaryStructureHeadForm />}
                />
                <Route
                  exact
                  path="/SalaryMaster/SalaryStructureHead/Update/:id"
                  element={<SalaryStructureHeadForm />}
                />
                <Route
                  exact
                  path="/SalaryMaster/SalaryStructureAssignment/New"
                  element={<SalaryStructureAssignment />}
                />
                <Route
                  exact
                  path="SlabStructureForm"
                  element={<SlabStructureForm />}
                />
                <Route
                  exact
                  path="SlabStructureUpdate/:id"
                  element={<SlabStructureForm />}
                />
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
              {/* Admission Master */}
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
                  path="/AdmissionMaster/Programtype/New"
                  element={<ProgramtypeForm />}
                />
                <Route
                  exact
                  path="/AdmissionMaster/Programtype/Update/:id"
                  element={<ProgramtypeForm />}
                />
              </>
              {/* Designation Master */}
              <>
                <Route
                  exact
                  path="/DesignationMaster"
                  element={<DesignationMaster />}
                />
                <Route
                  exact
                  path="/DesignationMaster/Designation/New"
                  element={<DesignationForm />}
                />
                <Route
                  exact
                  path="/DesignationMaster/Designation/Update/:id"
                  element={<DesignationForm />}
                />
              </>
              {/* Shift Master */}
              <>
                <Route exact path="/ShiftMaster" element={<ShiftMaster />} />
                <Route
                  exact
                  path="/ShiftMaster/Shift/New"
                  element={<ShiftForm />}
                />
                <Route
                  exact
                  path="/ShiftMaster/Shift/Update/:id"
                  element={<ShiftForm />}
                />
              </>
              {/* Academic Calenders */}
              <>
                <Route
                  exact
                  path={"/AcademicCalendars"}
                  element={
                    <Navigate replace to="/AcademicCalendars/AcademicYear" />
                  }
                />
                {[
                  "/AcademicCalendars/AcademicYear",
                  "/AcademicCalendars/FinancialYear",
                  "/AcademicCalendars/CalendarYear",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<AcademicCalendars />}
                  />
                ))}
                <Route
                  exact
                  path="/AcademicCalendars/Academicyear/New"
                  element={<AcademicyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Academicyear/Update/:id"
                  element={<AcademicyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Financialyear/New"
                  element={<FinancialyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Financialyear/Update/:id"
                  element={<FinancialyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Calenderyear/New"
                  element={<CalenderyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Calenderyear/Update/:id"
                  element={<CalenderyearForm />}
                />
              </>
              {/*Account Master */}
              <>
                <Route
                  exact
                  path="/AccountMaster"
                  element={<AccountMaster />}
                />
                <Route
                  exact
                  path="/AccountMaster/Group/New"
                  element={<GroupForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/Group/Update/:id"
                  element={<GroupForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/Ledger/New"
                  element={<LedgerForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/Ledger/Update/:id"
                  element={<LedgerForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/Tallyhead/New"
                  element={<TallyheadForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/Tallyhead/Update/:id"
                  element={<TallyheadForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/Voucher/New"
                  element={<VoucherForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/Voucher/Update/:id"
                  element={<VoucherForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/VoucherAssignment/New"
                  element={<VoucherAssignmentForm />}
                />
                <Route
                  exact
                  path="/AccountMaster/VoucherAssignment/Update/:id"
                  element={<VoucherAssignmentForm />}
                />
              </>
              <Route exact path="/UserIndex" element={<UserIndex />} />
              <Route exact path="/UserForm" element={<UserForm />} />
              <Route exact path="/JobPortal" element={<JobPortalIndex />} />
              <Route exact path="/Interview/New/:id" element={<InterView />} />
              <Route
                exact
                path="/Interview/Update/:id"
                element={<InterView />}
              />
              <Route exact path="/HodComments" element={<HodCommentsIndex />} />
              <Route exact path="/ResultForm/:id" element={<ResultForm />} />
              <Route
                exact
                path="/SalaryBreakupForm/:id"
                element={<SalaryBreakupForm />}
              />
              <Route
                exact
                path="/OfferForm/:id/:offerId"
                element={<OfferForm />}
              />
              <Route
                exact
                path="/Recruitment/:id/:offerId"
                element={<RecruitmentForm />}
              />
              <Route
                path="/AcademicCalendars/Calenderyear/Update/:id"
                element={<CalenderyearForm />}
              />
              {/* Shift Master */}
              <>
                <Route exact path="/ShiftMaster" element={<ShiftMaster />} />
                <Route
                  exact
                  path="/ShiftMaster/Shift/New"
                  element={<ShiftForm />}
                />
                <Route
                  exact
                  path="/ShiftMaster/Shift/Update/:id"
                  element={<ShiftForm />}
                />
              </>
              {/* inventoryMaster */}
              <>
                <Route
                  exact
                  path="/InventoryMaster"
                  element={<InventoryMaster />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Store/New"
                  element={<StoreForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Store/Update/:id"
                  element={<StoreForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Measure/New"
                  element={<MeasureForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Measure/Update/:id"
                  element={<MeasureForm />}
                />
              </>
              {/* Transcript Master */}
              <>
                <Route
                  exact
                  path={"/TranscriptMaster"}
                  element={
                    <Navigate replace to="/TranscriptMaster/Transcript" />
                  }
                />
                {[
                  "/TranscriptMaster/Transcript",
                  "/TranscriptMaster/Assignment",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<TranscriptMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/TranscriptMaster/Transcript/New"
                  element={<TranscriptForm />}
                />
                <Route
                  exact
                  path="/TranscriptMaster/Transcript/Update/:id"
                  element={<TranscriptForm />}
                />
                <Route
                  exact
                  path="/TranscriptMaster/TranscriptAssignment/Assign"
                  element={<TranscriptAssignmentForm />}
                />
              </>

              {/* Infrastructure Master*/}
              <>
                <Route
                  exact
                  path={"/InfrastructureMaster"}
                  element={
                    <Navigate replace to="/InfrastructureMaster/Facility" />
                  }
                />
                {[
                  "/InfrastructureMaster/Facility",
                  "/InfrastructureMaster/Block",
                  "/InfrastructureMaster/Floor",
                  "/InfrastructureMaster/Rooms",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<InfrastructureMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/InfrastructureMaster/Facility/New"
                  element={<FacilityForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Facility/Update/:id"
                  element={<FacilityForm />}
                />

                <Route
                  exact
                  path="/InfrastructureMaster/Block/New"
                  element={<BlockForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Block/Update/:id"
                  element={<BlockForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Rooms/New"
                  element={<RoomForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Rooms/Update/:id"
                  element={<RoomForm />}
                />
              </>

              {/*HolidayCalenderMaster */}
              <>
                <Route
                  exact
                  path="/HolidayCalenderMaster"
                  element={<HolidayCalenderMaster />}
                />
                <Route
                  exact
                  path="/HolidayCalenderMaster/HolidayCalender/New"
                  element={<HolidayCalenderForm />}
                />
                <Route
                  exact
                  path="/HolidayCalenderMaster/HolidayCalender/Update/:id"
                  element={<HolidayCalenderForm />}
                />
                <Route
                  exact
                  path="/HolidayCalenderMaster/DeAssignDepartment/:id"
                  element={<DeAssignDepartment />}
                />
              </>

              <Route exact path="/UserIndex" element={<UserIndex />} />
              <Route exact path="/UserForm" element={<UserForm />} />
              <Route exact path="/JobPortal" element={<JobPortalIndex />} />
              <Route exact path="/Interview/New/:id" element={<InterView />} />
              <Route
                exact
                path="/Interview/Update/:id"
                element={<InterView />}
              />
              <Route exact path="/EmployeeIndex" element={<EmployeeIndex />} />
            </Route>

            <Route
              exact
              path="/CandidateAttachment/:id/:type"
              element={<CandidateAttachmentView />}
            />

            <Route
              exact
              path="/SalaryBreakupPrint/:id/:offerId"
              element={<SalaryBreakupPrint />}
            />
            <Route
              exact
              path="/OfferLetterPrint/:id/:offerId"
              element={<OfferLetterPrint />}
            />
            <Route
              exact
              path="/OfferAccepted/:id"
              element={<OfferAccepted />}
            />
          </Routes>
        </Router>
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
