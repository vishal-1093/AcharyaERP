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
import FeetemplateMaster from "./pages/masters/FeetemplateMaster";
import CategoryTypeMaster from "./pages/masters/CategoryTypeMaster";
import CourseMaster from "./pages/masters/CourseMaster";
import LeaveMaster from "./pages/masters/LeaveMaster";
import HolidayCalenderMaster from "./pages/masters/HolidayCalenderMaster";
import LeavePatternMaster from "./pages/masters/LeavePatternMaster";
import HostelMaster from "./pages/masters/HostelMaster";
import SectionMaster from "./pages/masters/SectionMaster";
import MentorMaster from "./pages/masters/MentorMaster";

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
import VendorForm from "./pages/forms/inventoryMaster/VendorForm";
import View from "./pages/forms/inventoryMaster/View";

// Transcript Master Forms
import TranscriptForm from "./pages/forms/TranscriptMaster/TranscriptForm";
import TranscriptAssignmentForm from "./pages/forms/TranscriptMaster/TranscriptAssignmentForm";

// InfrastructureMaster Forms
import FacilityForm from "./pages/forms/InfrastructureMaster/FacilityForm";
import BlockForm from "./pages/forms/InfrastructureMaster/BlockForm";
import RoomForm from "./pages/forms/InfrastructureMaster/RoomForm";

//Feetemplate Master
import FeeTemplate from "./pages/forms/feetemplateMaster/FeeTemplate";
import FeetemplateSubamount from "./pages/forms/feetemplateMaster/FeetemplateSubamount";
import FeetemplateApproval from "./pages/forms/feetemplateMaster/FeetemplateApproval";
import ViewFeetemplateSubAmount from "./pages/forms/feetemplateMaster/ViewFeetemplateSubAmount";
import FeetemplateAttachmentView from "./pages/forms/feetemplateMaster/FeetemplateAttachmentView";
import FeetemplateApprovalIndex from "./containers/indeces/feetemplateMaster/FeetemplateApprovalIndex";
import FeetemplateSubAmountHistory from "./pages/forms/feetemplateMaster/FeetemplateSubAmountHistory";

//Course
import CourseForm from "./pages/forms/courseMaster/CourseForm";
import CourseAssignment from "./pages/forms/courseMaster/CourseAssignment";
import CoursePatternForm from "./pages/forms/courseMaster/CoursePatternForm";
import CourseTypeForm from "./pages/forms/courseMaster/CourseTypeForm";
import CourseCategoryForm from "./pages/forms/courseMaster/CourseCategoryForm";

//Syllabus
import SyllabusForm from "./pages/forms/courseMaster/SyllabusForm";
import SyllabusIndex from "./containers/indeces/CourseMaster/SyllabusIndex";
import SyllabusView from "./pages/forms/courseMaster/SyllabusView";

// CategoryType Master Forms
import CategoryTypeForm from "./pages/forms/CategoryTypeMaster/CategoryTypeForm";
import CategoryDetailsForm from "./pages/forms/CategoryTypeMaster/CategoryDetailsForm";

//LeaveMaster Forms
import LeaveTypeForm from "./pages/forms/LeaveMaster/LeaveTypeForm";
import ViewLeavePDF from "./pages/forms/LeaveMaster/ViewLeavePDF";

// HolidayCalenderMaster Forms
import HolidayCalenderForm from "./pages/forms/HolidayCalenderMaster/HolidayCalenderForm";
import DeAssignDepartment from "./pages/forms/HolidayCalenderMaster/DeAssignDepartment";

//LeavePattern Master Forms
import LeavePatternForm from "./pages/forms/LeavePatternMaster/LeavePatternForm";
import ViewReport from "./pages/forms/LeavePatternMaster/ViewReport";

// HostelMaster Forms
import DoctorWardenForm from "./pages/forms/HostelMaster/DoctorWardenForm";
import HostelBlockForm from "./pages/forms/HostelMaster/HostelBlockForm";
import RoomTypeForm from "./pages/forms/HostelMaster/RoomTypeForm";
import HostelRoomForm from "./pages/forms/HostelMaster/HostelRoomForm";

// Section Master forms
import SectionForm from "./pages/forms/SectionMaster/SectionForm";
import BatchForm from "./pages/forms/SectionMaster/BatchForm";

//Mentor Master
import ProctorheadForm from "./pages/forms/mentorMaster/ProctorheadForm";
import ProctorStudentAssignmentForm from "./pages/forms/mentorMaster/ProctorStudentAssignmentForm";
import ProctorStudentAssignmentIndex from "./containers/indeces/mentorMaster/ProctorStudentAssignmentIndex";

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
                  path={"/AcademicMaster"}
                  element={<Navigate replace to="/AcademicMaster/Department" />}
                />
                {[
                  "/AcademicMaster/Department",
                  "/AcademicMaster/Assignment",
                  "/AcademicMaster/Program",
                  "/AcademicMaster/Assign",
                  "/AcademicMaster/Specialization",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<AcademicMaster />}
                  />
                ))}
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
                  path={"/AdmissionMaster"}
                  element={<Navigate replace to="/AdmissionMaster/Course" />}
                />
                {[
                  "/AdmissionMaster/Course",
                  "/AdmissionMaster/Board",
                  "/AdmissionMaster/Category",
                  "/AdmissionMaster/Sub",
                  "/AdmissionMaster/Currency",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<AdmissionMaster />}
                  />
                ))}

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
                  path="/AdmissionMaster/Currencytype/New"
                  element={<CurrencytypeForm />}
                />
                <Route
                  exact
                  path="/AdmissionMaster/Currencytype/Update/:id"
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
                  element={
                    <Navigate replace to="/DesignationMaster/Designations" />
                  }
                />
                {["DesignationMaster/Designations"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<DesignationMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/DesignationMaster/Designations/New"
                  element={<DesignationForm />}
                />
                <Route
                  exact
                  path="/DesignationMaster/Designations/Update/:id"
                  element={<DesignationForm />}
                />
              </>
              {/* Shift Master */}
              <>
                <Route
                  exact
                  path="/ShiftMaster"
                  element={<Navigate replace to="/ShiftMaster/Shifts" />}
                />
                {["ShiftMaster/Shifts"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<ShiftMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/ShiftMaster/Shifts/New"
                  element={<ShiftForm />}
                />
                <Route
                  exact
                  path="/ShiftMaster/Shifts/Update/:id"
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
                  path={"/AccountMaster"}
                  element={<Navigate replace to="/AccountMaster/Group" />}
                />
                {[
                  "/AccountMaster/Group",
                  "/AccountMaster/Ledger",
                  "/AccountMaster/Tallyhead",
                  "/AccountMaster/Voucherhead",
                  "/AccountMaster/Assignment",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<AccountMaster />}
                  />
                ))}

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
              {/* InventoryMaster */}
              <>
                <Route
                  exact
                  path={"/InventoryMaster"}
                  element={<Navigate replace to="/InventoryMaster/Stores" />}
                />
                {[
                  "/InventoryMaster/Stores",
                  "/InventoryMaster/Measures",
                  "/InventoryMaster/Vendor",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<InventoryMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/InventoryMaster/Stores/New"
                  element={<StoreForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Stores/Update/:id"
                  element={<StoreForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Measures/New"
                  element={<MeasureForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Measures/Update/:id"
                  element={<MeasureForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Vendor/New"
                  element={<VendorForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Vendor/Update/:id"
                  element={<VendorForm />}
                />
                <Route exact path="/VendorIndex/View/:id" element={<View />} />
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
              {/*Feetemplate Master */}
              <>
                <Route
                  exact
                  path="/FeetemplateMaster"
                  element={
                    <Navigate replace to="/FeetemplateMaster/Feetemplate" />
                  }
                />
                {["/FeetemplateMaster/Feetemplate"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<FeetemplateMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/FeetemplateMaster/Feetemplate/New"
                  element={<FeeTemplate />}
                />
                <Route
                  exact
                  path="/FeetemplateMaster/Feetemplate/Update/:id"
                  element={<FeeTemplate />}
                />
                <Route
                  exact
                  path="/FeetemplateSubamount/:id"
                  element={<FeetemplateSubamount />}
                />
                <Route
                  exact
                  path="/FeetemplateMaster/EditFeetemplateSubAmount/:id/1"
                  element={<FeetemplateSubamount />}
                />
                <Route
                  exact
                  path="/FeetemplateMaster/EditFeetemplateSubAmount/:id"
                  element={<FeetemplateSubamount />}
                />
                <Route
                  exact
                  path="/FeetemplateSubAmountHistory/:id"
                  element={<FeetemplateSubAmountHistory />}
                />
                <Route
                  exact
                  path="/FeetemplateAttachmentView/:id"
                  element={<FeetemplateAttachmentView />}
                />
                <Route
                  exact
                  path="/ViewFeetemplateSubAmount/:id"
                  element={<ViewFeetemplateSubAmount />}
                />
                <Route
                  exact
                  path="/ViewFeetemplateSubAmount/:id/1"
                  element={<ViewFeetemplateSubAmount />}
                />
                <Route
                  exact
                  path="/FeetemplateApproval/:id"
                  element={<FeetemplateApproval />}
                />
                <Route
                  exact
                  path="/FeetemplateApprovalIndex"
                  element={<FeetemplateApprovalIndex />}
                />
              </>
              {/*Course  */}
              <>
                <Route
                  exact
                  path="/CourseMaster"
                  element={<Navigate replace to="/CourseMaster/Course" />}
                />
                {[
                  "/CourseMaster/Course",
                  "/CourseMaster/Assignment",
                  "/CourseMaster/Type",
                  "/CourseMaster/Category",
                  "/CourseMaster/Bucket",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<CourseMaster />}
                  />
                ))}
                <Route exact path="/CourseForm" element={<CourseForm />} />
                <Route
                  exact
                  path="/CourseAssignment"
                  element={<CourseAssignment />}
                />
                <Route
                  exact
                  path="/CourseAssignment/Update/:id"
                  element={<CourseAssignment />}
                />

                <Route
                  exact
                  path="/CourseForm/Update/:id"
                  element={<CourseForm />}
                />
                <Route
                  exact
                  path="/CoursePatternForm"
                  element={<CoursePatternForm />}
                />
                <Route
                  exact
                  path="/CoursePatternForm/Update/:id"
                  element={<CoursePatternForm />}
                />
                <Route
                  exact
                  path="/CourseTypeForm/New"
                  element={<CourseTypeForm />}
                />
                <Route
                  exact
                  path="/CourseTypeForm/Update/:id"
                  element={<CourseTypeForm />}
                />
                <Route
                  exact
                  path="/CourseCategoryForm/New"
                  element={<CourseCategoryForm />}
                />
                <Route
                  exact
                  path="/CourseCategoryForm/Update/:id"
                  element={<CourseCategoryForm />}
                />
              </>
              {/*Syllabus Form */}
              <>
                <Route exact path="/SyllabusForm" element={<SyllabusForm />} />
                <Route
                  exact
                  path="/SyllabusIndex"
                  element={<SyllabusIndex />}
                />
                <Route
                  exact
                  path="/SyllabusUpdate/:id"
                  element={<SyllabusForm />}
                />
                <Route
                  exact
                  path="/SyllabusView/:id"
                  element={<SyllabusView />}
                />
              </>

              {/*Category Type Master */}
              <>
                <Route
                  exact
                  path={"/CategoryTypeMaster"}
                  element={
                    <Navigate replace to="/CategoryTypeMaster/CategoryTypes" />
                  }
                />
                {[
                  "/CategoryTypeMaster/CategoryTypes",
                  "/CategoryTypeMaster/CategoryDetail",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<CategoryTypeMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/CategoryTypeMaster/CategoryTypes/New"
                  element={<CategoryTypeForm />}
                />
                <Route
                  exact
                  path="/CategoryTypeMaster/CategoryTypes/Update/:id"
                  element={<CategoryTypeForm />}
                />
                <Route
                  exact
                  path="/CategoryTypeMaster/CategoryDetail/New"
                  element={<CategoryDetailsForm />}
                />
                <Route
                  exact
                  path="/CategoryTypeMaster/CategoryDetail/Update/:id"
                  element={<CategoryDetailsForm />}
                />
              </>

              {/*HolidayCalenderMaster */}
              <>
                <Route
                  exact
                  path={"/HolidayCalenderMaster"}
                  element={
                    <Navigate
                      replace
                      to="/HolidayCalenderMaster/HolidayCalenders"
                    />
                  }
                />
                {["/HolidayCalenderMaster/HolidayCalenders"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<HolidayCalenderMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/HolidayCalenderMaster/HolidayCalenders/New"
                  element={<HolidayCalenderForm />}
                />
                <Route
                  exact
                  path="/HolidayCalenderMaster/HolidayCalenders/Update/:id"
                  element={<HolidayCalenderForm />}
                />
                <Route
                  exact
                  path="/HolidayCalenderMaster/DeAssignDepartments/:id"
                  element={<DeAssignDepartment />}
                />
              </>

              {/* Leave Master */}
              <>
                <Route
                  exact
                  path={"/LeaveMaster"}
                  element={<Navigate replace to="/LeaveMaster/LeaveTypes" />}
                />
                {["/LeaveMaster/LeaveTypes"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<LeaveMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/LeaveMaster/LeaveTypes/New"
                  element={<LeaveTypeForm />}
                />
                <Route
                  exact
                  path="/LeaveMaster/LeaveTypes/Update/:id"
                  element={<LeaveTypeForm />}
                />
                <Route
                  exact
                  path="/LeaveTypes/AttachmentView/:id"
                  element={<ViewLeavePDF />}
                />
              </>

              {/*Leave Pattern Master */}
              <>
                <Route
                  exact
                  path={"/LeavePatternMaster"}
                  element={
                    <Navigate replace to="/LeavePatternMaster/LeavePatterns" />
                  }
                />
                {[
                  "/LeavePatternMaster/LeavePatterns",
                  "/LeavePatternMaster/ViewReports",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<LeavePatternMaster />}
                  />
                ))}
                <Route />
                <Route
                  exact
                  path="/LeavePatternMaster/LeavePatterns/New"
                  element={<LeavePatternForm />}
                />
                <Route
                  exact
                  path="/LeavePatternMaster/LeavePatterns/Update/:id"
                  element={<LeavePatternForm />}
                />
                <Route
                  exact
                  path="/LeavePatternMaster/ViewReports/New"
                  element={<ViewReport />}
                />
              </>

              {/* Hostel Master */}
              <>
                <Route
                  exact
                  path={"/HostelMaster"}
                  element={<Navigate replace to="/HostelMaster/Blocks" />}
                />
                {[
                  "/HostelMaster/Blocks",
                  "/HostelMaster/Floors",
                  "/HostelMaster/Wardens",
                  "/HostelMaster/RoomTypes",
                  "/HostelMaster/HostelRooms",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<HostelMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/HostelMaster/Blocks/New"
                  element={<HostelBlockForm />}
                />
                <Route
                  exact
                  path="/HostelMaster/Blocks/Update/:id"
                  element={<HostelBlockForm />}
                />
                <Route
                  exact
                  path="/HostelMaster/Wardens/New"
                  element={<DoctorWardenForm />}
                />
                <Route
                  exact
                  path="/HostelMaster/RoomTypes/New"
                  element={<RoomTypeForm />}
                />
                <Route
                  exact
                  path="/HostelMaster/RoomTypes/Update/:id"
                  element={<RoomTypeForm />}
                />
                <Route
                  exact
                  path="/HostelMaster/HostelRooms/New"
                  element={<HostelRoomForm />}
                />
                <Route
                  exact
                  path="/HostelMaster/HostelRooms/Update/:id"
                  element={<HostelRoomForm />}
                />
              </>
              {/*Section Master*/}
              <>
                <Route
                  exact
                  path={"/SectionMaster"}
                  element={<Navigate replace to="/SectionMaster/Sections" />}
                />
                {["/SectionMaster/Sections", "/SectionMaster/Batches"].map(
                  (path) => (
                    <Route
                      exact
                      key={path}
                      path={path}
                      element={<SectionMaster />}
                    />
                  )
                )}
                <Route
                  exact
                  path="/SectionMaster/Section/New"
                  element={<SectionForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/Section/Update/:id"
                  element={<SectionForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/Batch/New"
                  element={<BatchForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/Batch/Update/:id"
                  element={<BatchForm />}
                />
              </>
              {/*Mentor Master */}
              <>
                <Route
                  exact
                  path={"/MentorMaster"}
                  element={<Navigate replace to="/MentorMaster/Mentor" />}
                />
                {["/MentorMaster/Mentor"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<MentorMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/MentorMaster/Mentor/New"
                  element={<ProctorheadForm />}
                />
                <Route
                  exact
                  path="/MentorMaster/Mentor/Update/:id"
                  element={<ProctorheadForm />}
                />
                <Route
                  exact
                  path="/MentorStudentAssignment/New"
                  element={<ProctorStudentAssignmentForm />}
                />
                <Route
                  exact
                  path="/MentorAssignmentIndex"
                  element={<ProctorStudentAssignmentIndex />}
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
