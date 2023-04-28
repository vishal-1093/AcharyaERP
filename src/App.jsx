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
import ChartsTest from "./containers/examples/ChartsTest";
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
import MentorMaster from "./pages/masters/MentorMaster";
import ReportMaster from "./pages/masters/StudentReportingMaster";
import HostelFeeMaster from "./pages/masters/HostelFeeMaster";
import SectionMaster from "./pages/masters/SectionMaster";
import StudentFeedbackMaster from "./pages/masters/StudentFeedbackMaster";
import TimeTableMaster from "./pages/masters/TimeTableMaster";
import StudentDetailsMaster from "./pages/masters/StudentDetailsMaster";
import StudentTranscriptMaster from "./pages/masters/StudentTranscriptMaster";
import BankMaster from "./pages/masters/BankMaster";
import StudentIntakeMaster from "./pages/masters/StudentIntakeMaster";
import ExitFormMaster from "./pages/masters/ExitFormMaster";
import EventMaster from "./pages/masters/EventMaster";
import AcademicSectionMaster from "./pages/masters/AcademicSectionMaster";
import CourseSubjectiveMaster from "./pages/masters/CourseSubjectiveMaster";

// Institute master forms
import SchoolForm from "./pages/forms/instituteMaster/SchoolForm";
import OrganizationForm from "./pages/forms/instituteMaster/OrganizationForm";
import JobtypeForm from "./pages/forms/instituteMaster/JobtypeForm";
import EmptypeForm from "./pages/forms/instituteMaster/EmptypeForm";
import GraduationForm from "./pages/forms/instituteMaster/GraduationForm";
import SchoolVisionForm from "./pages/forms/instituteMaster/SchoolVisionForm";

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
import InternalCreationForm from "./pages/forms/academicMaster/InternalCreationForm";
import SessionAssignmentForm from "./pages/forms/academicMaster/SessionAssignmentForm";
import SessionAssignmentIndex from "./containers/indeces/academicMaster/SessionAssignmentIndex";
import InternalTimetablePdf from "./pages/forms/academicMaster/InternalTimetablePdf";
import SessionMarksEntryForm from "./pages/forms/academicMaster/SessionMarksEntryForm";
import SessionMarksEntry from "./pages/forms/academicMaster/SessionMarksEntry";
import VisionMissionForm from "./pages/forms/academicMaster/VisionMissionForm";

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
import EmployeeUpdateForm from "./pages/forms/jobPortal/EmployeeUpdateForm";

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
import TranscriptForm from "./pages/forms/transcriptMaster/TranscriptForm";
import TranscriptAssignmentForm from "./pages/forms/transcriptMaster/TranscriptAssignmentForm";
import UniversityForm from "./pages/forms/transcriptMaster/UniversityForm";

// InfrastructureMaster Forms
import FacilityForm from "./pages/forms/infrastructureMaster/FacilityForm";
import BlockForm from "./pages/forms/infrastructureMaster/BlockForm";
import RoomForm from "./pages/forms/infrastructureMaster/RoomForm";

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
import CoursePatternIndex from "./containers/indeces/courseMaster/CoursePatternIndex";
import CourseTypeForm from "./pages/forms/courseMaster/CourseTypeForm";
import CourseCategoryForm from "./pages/forms/courseMaster/CourseCategoryForm";
import CourseStudentAssignment from "./pages/forms/courseMaster/CourseStudentAssignment";
import CourseStudentAssignmentIndex from "./containers/indeces/courseMaster/CourseStudentAssignmentIndex";
import CourseassignmentIndex from "./containers/indeces/courseMaster/CourseassignmentIndex";

// CategoryType Master Forms
import CategoryTypeForm from "./pages/forms/categoryTypeMaster/CategoryTypeForm";
import CategoryDetailsForm from "./pages/forms/categoryTypeMaster/CategoryDetailsForm";
import CommencementTypeForm from "./pages/forms/categoryTypeMaster/CommencementTypeForm";

//LeaveMaster Forms
import LeaveTypeForm from "./pages/forms/leaveMaster/LeaveTypeForm";
import ViewLeavePDF from "./pages/forms/leaveMaster/ViewLeavePDF";

// HolidayCalenderMaster Forms
import HolidayCalenderForm from "./pages/forms/holidayCalenderMaster/HolidayCalenderForm";
import DeAssignDepartment from "./pages/forms/holidayCalenderMaster/DeAssignDepartment";

//LeavePattern Master Forms
import LeavePatternForm from "./pages/forms/leavePatternMaster/LeavePatternForm";
import ViewReport from "./pages/forms/leavePatternMaster/ViewReport";

// HostelMaster Forms
import DoctorWardenForm from "./pages/forms/hostelMaster/DoctorWardenForm";
import HostelBlockForm from "./pages/forms/hostelMaster/HostelBlockForm";
import RoomTypeForm from "./pages/forms/hostelMaster/RoomTypeForm";
import HostelRoomForm from "./pages/forms/hostelMaster/HostelRoomForm";
import StandardAccessoriesForm from "./pages/forms/hostelMaster/StandardAccessoriesForm";

// Section Master forms
import SectionForm from "./pages/forms/sectionMaster/SectionForm";
import BatchForm from "./pages/forms/sectionMaster/BatchForm";
import SectionAssignmentForm from "./pages/forms/sectionMaster/SectionAssignmentForm";
import StudentPromote from "./pages/forms/sectionMaster/StudentPromote";
import TimeSlotsForm from "./pages/forms/sectionMaster/TimeSlotsForm";
import CourseAssignmentForm from "./pages/forms/timeTableMaster/CourseAssignmentForm";
import TimeIntervalTypesForm from "./pages/forms/sectionMaster/TimeIntervalTypesForm";
import TimetableForSectionForm from "./pages/forms/timeTableMaster/TimetableForSectionForm";
import TimetableForBatchForm from "./pages/forms/timeTableMaster/TimetableForBatchForm";

//Mentor Master
import ProctorheadForm from "./pages/forms/mentorMaster/ProctorheadForm";
import ProctorStudentAssignmentForm from "./pages/forms/mentorMaster/ProctorStudentAssignmentForm";
import ProctorStudentAssignmentIndex from "./containers/indeces/mentorMaster/ProctorStudentAssignmentIndex";

//Student Master
import LessonplanForm from "./pages/forms/studentMaster/LessonplanForm";
import Referencebookform from "./pages/forms/studentMaster/ReferencebookForm";
import LessonplanIndex from "./containers/indeces/studentMaster/LessonplanIndex";
import ReferencebookIndex from "./containers/indeces/studentMaster/ReferencebookIndex";

//Report Master
import ReportForm from "./pages/forms/studentReportingMaster/ReportForm";
import ReportIndex from "./containers/indeces/studentReportingMaster/ReportIndex";
import StudentEligibleForm from "./pages/forms/studentReportingMaster/StudentEligibleForm";
import StudentEligibleIndex from "./containers/indeces/studentReportingMaster/StudentEligibleIndex";
import StudentPromoteForm from "./pages/forms/studentReportingMaster/StudentPromoteForm";
import StudentPromoteIndex from "./containers/indeces/studentReportingMaster/StudentPromoteIndex";
import StudentHistory from "./pages/forms/studentReportingMaster/StudentHistory";
import StudentHistoryIndex from "./containers/indeces/studentReportingMaster/StudentHistoryIndex";

// Candidate Walkin
import CandidateWalkinIndex from "./pages/indeces/CandidateWalkinIndex";
import CandidateWalkinForm from "./pages/forms/candidateWalkin/CandidateWalkinForm";
import PreAdmissionProcessForm from "./pages/forms/candidateWalkin/PreAdmissionProcessForm";
import PreScholarshipApproverIndex from "./pages/indeces/PreScholarshipApproverIndex";
import PreScholarshipApproverForm from "./pages/forms/candidateWalkin/PreScholarshipApproverForm";
import PreScholarshipVerifierIndex from "./pages/indeces/PreScholarshipVerifierIndex";
import PreScholarshipVerifierForm from "./pages/forms/candidateWalkin/PreScholarshipVerifierForm";
import OfferLetterView from "./pages/forms/candidateWalkin/OfferLetterView";
import AuidForm from "./pages/forms/candidateWalkin/AuidForm";
import StudentDocumentCollectionPdf from "./components/StudentDocumentCollectionPdf";
import CandidateOfferLetterPdf from "./pages/forms/candidateWalkin/CandidateOfferLetterPdf";
import DirectScholarshipForm from "./pages/forms/candidateWalkin/DirectScholarshipForm";
import ScholarshipApproverForm from "./pages/forms/candidateWalkin/ScholarshipApproverForm";
import ScholarshipApproverIndex from "./pages/indeces/ScholarshipApproverIndex";

// HostelFee Master Forms
import HostelFeeForm from "./pages/forms/hostelFeeMaster/HostelFeeForm";
import ViewFeeTemplate from "./pages/forms/hostelFeeMaster/ViewFeeTemplate";

// Student Feedback Master Forms
import StudentFeedbackForm from "./pages/forms/studentFeedbackMaster/StudentFeedbackForm";

// TimeTable Master Forms
import BatchAssignmentForm from "./pages/forms/timeTableMaster/BatchAssignmentForm";
import TimeTabeleView from "./pages/forms/timeTableMaster/TimeTableView";
import TimeTableViewDateWise from "./pages/forms/timeTableMaster/TimeTableViewDateWise";
import TimeTableDateWisePDF from "./pages/forms/timeTableMaster/TimeTableDateWisePDF";
import TimeTableViewForCourse from "./pages/forms/timeTableMaster/TimeTableViewForCourse";
import TimeTableViewWeekWise from "./pages/forms/timeTableMaster/TimeTableViewWeekWise";
import TimeTableFacultyViewPDF from "./pages/forms/timeTableMaster/TimeTableFacultyViewPDF";
import TimeTableViewWeekWisePdf from "./pages/forms/timeTableMaster/TimeTableViewWeekWisePdf";

//Student Details Master forms
import ProvisionCertificate from "./pages/forms/studentDetailMaster/ProvisionCertificate";
import ProvisionCertificatePDF from "./pages/forms/studentDetailMaster/ProvisionCertificatePDF";

// Student transcrtipt master forms
import StudentTranscriptForm from "./pages/forms/studentTranscriptsMaster/StudentTranscriptForm";

//Bank Master
import BankForm from "./pages/forms/bankMaster/BankForm";

//Student Intake
import StudentIntakeForm from "./pages/forms/studentIntake/StudentIntakeForm";
import StudentIntakeSelection from "./pages/forms/studentIntake/StudentIntakeSelectionForm";
import StudentIntakeSummary from "./pages/forms/studentIntake/StudentIntakeSummary";

// ExitForm Master Forms
import ExitForm from "./pages/forms/exitFormMaster/ExitForm";
import ExitQuestionsForm from "./pages/forms/exitFormMaster/ExitQuestionsForm";

// Event Master Forms
import EventCreationForm from "./pages/forms/eventMaster/EventCreationForm";
import SessionRoomInvigilatorAssignment from "./pages/forms/academicMaster/SessionRoomInvigilatorAssignment";

// AcademicSection Master Forms
import ClassCommencementForm from "./pages/forms/academicSectionMaster/ClassCommencementForm";
import SessionStudentAssignmentIndex from "./containers/indeces/academicMaster/SessionStudentAssignmentIndex";
import SessionCourseAndDateMappingIndex from "./containers/indeces/academicMaster/SessionCourseAndDateMappingIndex";

//Time Table Reports
import FacultyWorkload from "./pages/forms/timeTableMaster/FacultyWorkload";
import FacultyWorkloadDaywise from "./pages/forms/timeTableMaster/FacultyWorkloadDaywise";

//Course Subjective Master
import CourseObjectiveForm from "./pages/forms/courseMaster/CourseObjectiveForm";
import CourseOutcomeForm from "./pages/forms/courseMaster/CourseOutcomeForm";
import SyllabusForm from "./pages/forms/academicMaster/SyllabusForm";

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
              <Route exact path="/ChartsTest" element={<ChartsTest />} />

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
                  "/InstituteMaster/Graduations",
                  "/InstituteMaster/Visions",
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

                <Route
                  exact
                  path="/InstituteMaster/Graduation/New"
                  element={<GraduationForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Graduation/Update/:id"
                  element={<GraduationForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/SchoolVision/New"
                  element={<SchoolVisionForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/SchoolVision/Update/:id"
                  element={<SchoolVisionForm />}
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
                  path="/SalaryMaster/SalaryStructureAssignment/Update/:id"
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
                  "/AcademicMaster/Internal",
                  "/AcademicMaster/VisionMissions",
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
                <Route
                  exact
                  path="/AcademicMaster/VisionMission/New"
                  element={<VisionMissionForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/VisionMission/Update/:id"
                  element={<VisionMissionForm />}
                />

                <Route
                  exact
                  path="/SessionAssignmentForm"
                  element={<SessionAssignmentForm />}
                />
                <Route
                  exact
                  path="/SessionAssignmentForm/Update/:id"
                  element={<SessionAssignmentForm />}
                />
                <Route
                  exact
                  path="/SessionAssignmentIndex"
                  element={<SessionAssignmentIndex />}
                />
                <Route
                  exact
                  path="/SessionRoomInvigilatorAssignment/Assign/:id"
                  element={<SessionRoomInvigilatorAssignment />}
                />
                <Route
                  exact
                  path="/SessionStudentAssignmentIndex"
                  element={<SessionStudentAssignmentIndex />}
                />
                <Route
                  excat
                  path="/SessionCourseAndDateMappingIndex"
                  element={<SessionCourseAndDateMappingIndex />}
                />
                <Route
                  exact
                  path="/InternalTimetablePdf/:id"
                  element={<InternalTimetablePdf />}
                />
                <Route
                  exact
                  path="/SessionMarksEntryForm"
                  element={<SessionMarksEntryForm />}
                />
                <Route
                  exact
                  path="/SessionMarksEntry/:acYearId/:schoolId/:programSpeId/:programId/:yearsemId/:sectionId/:courseId/:internalId"
                  element={<SessionMarksEntry />}
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
              {/* Job Portal  */}
              <>
                <Route exact path="/UserIndex" element={<UserIndex />} />
                <Route exact path="/UserForm" element={<UserForm />} />
                <Route exact path="/JobPortal" element={<JobPortalIndex />} />
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
                <Route exact path="/ResultForm/:id" element={<ResultForm />} />
                <Route
                  exact
                  path="/SalaryBreakupForm/New/:id"
                  element={<SalaryBreakupForm />}
                />
                <Route
                  exact
                  path="/SalaryBreakupForm/Update/:id/:offerId"
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
                  exact
                  path="/HodComments"
                  element={<HodCommentsIndex />}
                />
                <Route
                  exact
                  path="/EmployeeIndex"
                  element={<EmployeeIndex />}
                />
                <Route
                  exact
                  path="/EmployeeUpdateForm/:id"
                  element={<EmployeeUpdateForm />}
                />
              </>
              {/* Candidate Walkin  */}
              <Route
                exact
                path="/CandidateWalkinIndex"
                element={<CandidateWalkinIndex />}
              />
              <Route
                exact
                path="/CandidateWalkinForm"
                element={<CandidateWalkinForm />}
              />
              <Route
                exact
                path="/PreAdmissionProcessForm/:id"
                element={<PreAdmissionProcessForm />}
              />
              <Route
                exact
                path="/PreScholarshipApproverIndex"
                element={<PreScholarshipApproverIndex />}
              />
              <Route
                exact
                path="/PreScholarshipApproverForm/:id"
                element={<PreScholarshipApproverForm />}
              />
              <Route
                exact
                path="/PreScholarshipVerifierIndex"
                element={<PreScholarshipVerifierIndex />}
              />
              <Route
                exact
                path="/PreScholarshipVerifierForm/:id"
                element={<PreScholarshipVerifierForm />}
              />
              <Route
                exact
                path="/offerletterview/:id"
                element={<OfferLetterView />}
              />
              <Route exact path="/AuidForm/:id" element={<AuidForm />} />
              <Route
                exact
                path="/DirectScholarshipForm"
                element={<DirectScholarshipForm />}
              />
              <Route
                exact
                path="/ScholarshipApproverForm/:studentId/:scholarshipId"
                element={<ScholarshipApproverForm />}
              />
              <Route
                exact
                path="/ScholarshipApproverIndex"
                element={<ScholarshipApproverIndex />}
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
                    <Navigate replace to="/TranscriptMaster/Transcripts" />
                  }
                />
                {[
                  "/TranscriptMaster/Transcripts",
                  "/TranscriptMaster/Assignments",
                  "/TranscriptMaster/Universitys",
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
                <Route
                  exact
                  path="/TranscriptMaster/University/New"
                  element={<UniversityForm />}
                />
                <Route
                  exact
                  path="/TranscriptMaster/University/Update/:id"
                  element={<UniversityForm />}
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
                  "/CourseMaster/Category",
                  "/CourseMaster/Type",
                  "/CourseMaster/Pattern",
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
                <Route
                  exact
                  path="/CourseMaster/Student/New"
                  element={<CourseStudentAssignment />}
                />
                <Route
                  exact
                  path="/CourseMaster/Student/Update/:id"
                  element={<CourseStudentAssignment />}
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
                  path="/CoursePatternIndex"
                  element={<CoursePatternIndex />}
                />
                <Route
                  exact
                  path="/CourseassignmentIndex"
                  element={<CourseassignmentIndex />}
                />
                <Route
                  exact
                  path="/CourseStudentAssignmentIndex"
                  element={<CourseStudentAssignmentIndex />}
                />
              </>

              {/*Course Subjective */}
              <>
                <Route
                  exact
                  path={"/CourseSubjectiveMaster"}
                  element={
                    <Navigate replace to="/CourseSubjectiveMaster/Objective" />
                  }
                />
                {[
                  "/CourseSubjectiveMaster/Objective",
                  "/CourseSubjectiveMaster/Outcome",
                  "/CourseSubjectiveMaster/Syllabus",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<CourseSubjectiveMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/CourseSubjectiveMaster/CourseObjective/New"
                  element={<CourseObjectiveForm />}
                />
                <Route
                  exact
                  path="/CourseSubjectiveMaster/CourseObjective/Update/:id"
                  element={<CourseObjectiveForm />}
                />

                <Route
                  exact
                  path="/CourseSubjectiveMaster/CourseOutcome/New"
                  element={<CourseOutcomeForm />}
                />
                <Route
                  exact
                  path="/CourseSubjectiveMaster/CourseOutcome/Update/:id"
                  element={<CourseOutcomeForm />}
                />
                <Route
                  exact
                  path="/CourseSubjectiveMaster/Syllabus/New"
                  element={<SyllabusForm />}
                />
                <Route
                  exact
                  path="/CourseSubjectiveMaster/Syllabus/Update/:id"
                  element={<SyllabusForm />}
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
                  "/CategoryTypeMaster/CommencementTypes",
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
                <Route
                  exact
                  path="/CategoryTypeMaster/CommencementType/New"
                  element={<CommencementTypeForm />}
                />
                <Route
                  exact
                  path="/CategoryTypeMaster/CommencementType/Update/:id"
                  element={<CommencementTypeForm />}
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
                  "/LeavePatternMaster/CopyPattern",
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
                  "/HostelMaster/StandardAccessories",
                  "/HostelMaster/GridView",
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
                  path="/HostelMaster/StandardAccessories/New"
                  element={<StandardAccessoriesForm />}
                />
                <Route
                  exact
                  path="/HostelMaster/StandardAccessories/Update/:id"
                  element={<StandardAccessoriesForm />}
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
              {/* Hostel Fee Master */}
              <>
                <Route
                  exact
                  path={"/HostelFeeMaster"}
                  element={
                    <Navigate replace to="/HostelFeeMaster/HostelFees" />
                  }
                />
                {["/HostelFeeMaster/HostelFees"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<HostelFeeMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/HostelFeeMaster/HostelFee/New"
                  element={<HostelFeeForm />}
                />
                <Route
                  exact
                  path="/HostelFeeMaster/HostelFee/View/:id"
                  element={<ViewFeeTemplate />}
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
              {/*Student Master */}
              <>
                <Route
                  exact
                  path="/StudentMaster/LessonplanForm"
                  element={<LessonplanForm />}
                />
                <Route
                  exact
                  path="/StudentMaster/ReferencebookForm"
                  element={<Referencebookform />}
                />
                <Route
                  exact
                  path="/StudentMaster/ReferencebookForm/Update/:id"
                  element={<Referencebookform />}
                />
                <Route
                  exact
                  path="/StudentMaster/LessonplanIndex"
                  element={<LessonplanIndex />}
                />
                <Route
                  exact
                  path="/StudentMaster/ReferencebookIndex"
                  element={<ReferencebookIndex />}
                />
              </>
              {/*Section Master*/}
              <>
                <Route
                  exact
                  path={"/SectionMaster"}
                  element={<Navigate replace to="/SectionMaster/Sections" />}
                />
                {[
                  "/SectionMaster/Sections",
                  "/SectionMaster/Batches",
                  "/SectionMaster/CourseAssign",
                  "/SectionMaster/IntervalTypes",
                  "/SectionMaster/Internal",
                  "/SectionMaster/Timetable/Batch",
                  "/SectionMaster/Timeslot",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<SectionMaster />}
                  />
                ))}
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

                <Route
                  exact
                  path="/SectionMaster/SectionAssignmentForm/New"
                  element={<SectionAssignmentForm />}
                />

                <Route
                  exact
                  path="/SectionMaster/SectionAssignmentUpdate/:id"
                  element={<SectionAssignmentForm />}
                />

                <Route
                  exact
                  path="/SectionMaster/Promote/:id"
                  element={<StudentPromote />}
                />
                <Route
                  exact
                  path="/SectionMaster/TimeSlots/New"
                  element={<TimeSlotsForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/TimeSlots/New"
                  element={<TimeSlotsForm />}
                />

                <Route
                  exact
                  path="/SectionMaster/TimeSlots/Update/:id"
                  element={<TimeSlotsForm />}
                />

                <Route
                  exact
                  path="/SectionMaster/intervaltype/New"
                  element={<TimeIntervalTypesForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/intervaltype/Update/:id"
                  element={<TimeIntervalTypesForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/Internal/New"
                  element={<InternalCreationForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/Internal/Update/:id"
                  element={<InternalCreationForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/timeslots/New"
                  element={<TimeSlotsForm />}
                />
                <Route
                  exact
                  path="/SectionMaster/timeslots/Update/:id"
                  element={<TimeSlotsForm />}
                />
              </>
              {/*Exit Form Master */}
              <>
                <Route
                  exact
                  path={"/ExitFormMaster"}
                  element={
                    <Navigate replace to="/ExitFormMaster/ExitQuestions" />
                  }
                />
                {[
                  "/ExitFormMaster/ExitQuestions",
                  "/ExitFormMaster/ExitForms",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<ExitFormMaster />}
                  />
                ))}
                <Route />
                <Route
                  exact
                  path="/ExitFormMaster/exitquestion/New"
                  element={<ExitQuestionsForm />}
                />
                <Route
                  exact
                  path="/ExitFormMaster/exitquestion/Update/:id"
                  element={<ExitQuestionsForm />}
                />
                <Route
                  exact
                  path="/ExitFormMaster/ExitForm/New"
                  element={<ExitForm />}
                />
              </>
              {/*Student Feedback Master */}
              <>
                <Route
                  exact
                  path={"/StudentFeedbackMaster"}
                  element={
                    <Navigate replace to="/StudentFeedbackMaster/Questions" />
                  }
                />
                {["/StudentFeedbackMaster/Questions"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<StudentFeedbackMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/StudentFeedbackMaster/Feedback/New"
                  element={<StudentFeedbackForm />}
                />
                <Route
                  exact
                  path="/StudentFeedbackMaster/Feedback/Update/:id"
                  element={<StudentFeedbackForm />}
                />
              </>
              {/* Time Table Master */}
              <>
                <Route
                  exact
                  path={"/TimeTableMaster"}
                  element={<Navigate replace to="/TimeTableMaster/Course" />}
                />
                {[
                  "/TimeTableMaster/Course",
                  "/TimeTableMaster/Section",
                  "/TimeTableMaster/Batchassignment",
                  "TimeTableMaster/Timetable",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<TimeTableMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/TimeTableMaster/sectionassignmentform/New"
                  element={<SectionAssignmentForm />}
                />
                <Route
                  exact
                  path="/TimeTableMaster/SectionAssignmentUpdate/:id"
                  element={<SectionAssignmentForm />}
                />
                <Route
                  exact
                  path="/TimeTableMaster/Timetable/Section/New"
                  element={<TimetableForSectionForm />}
                />
                <Route
                  exact
                  path="/TimeTableMaster/Timetable/Batch/New"
                  element={<TimetableForBatchForm />}
                />
                <Route
                  exact
                  path="/TimeTableMaster/timeslots/Update/:id"
                  element={<TimeSlotsForm />}
                />
                <Route
                  exact
                  path="/TimeTableMaster/batchassignment/New"
                  element={<BatchAssignmentForm />}
                />
                <Route
                  exact
                  path="/TimeTableMaster/batchassignment/Update/:id"
                  element={<BatchAssignmentForm />}
                />

                <Route
                  exact
                  path="/TimeTableMaster/CourseAssignment/New"
                  element={<CourseAssignmentForm />}
                />
                <Route
                  exact
                  path="/TimeTableMaster/CourseAssignment/Update/:id"
                  element={<CourseAssignmentForm />}
                />

                <Route
                  exact
                  path="/TimeTableMaster/TimeTableView"
                  element={<TimeTabeleView />}
                />

                <Route
                  exact
                  path="/TimeTableViewDateWise/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
                  element={<TimeTableViewDateWise />}
                />

                <Route
                  exact
                  path="/TimeTableDateWisePDF/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
                  element={<TimeTableDateWisePDF />}
                />

                <Route
                  exact
                  path="/TimeTableViewForCourse/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:courseId/:programType"
                  element={<TimeTableViewForCourse />}
                />

                <Route
                  exact
                  path="/TimeTableViewWeekWise/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
                  element={<TimeTableViewWeekWise />}
                />

                <Route
                  exact
                  path="/TimeTableFacultyViewPDF/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:courseId/:programType"
                  element={<TimeTableFacultyViewPDF />}
                />

                <Route
                  exact
                  path="/TimeTableViewWeekWisePdf/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
                  element={<TimeTableViewWeekWisePdf />}
                />
              </>
              {/*  StudentTranscriptMaster*/}
              <>
                <Route
                  exact
                  path={"/StudentTranscriptMaster"}
                  element={
                    <Navigate
                      replace
                      to="/StudentTranscriptMaster/StudentTranscript"
                    />
                  }
                />
                {["/StudentTranscriptMaster/StudentTranscript"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<StudentTranscriptMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/StudentTranscriptMaster/DocumentCollection/:id"
                  element={<StudentTranscriptForm />}
                />
              </>
              {/* Student Details Master */}
              <>
                <Route
                  exact
                  path={"/StudentDetailsMaster"}
                  element={
                    <Navigate
                      replace
                      to="/StudentDetailsMaster/StudentsDetails"
                    />
                  }
                />
                {["/StudentDetailsMaster/StudentsDetails"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<StudentDetailsMaster />}
                  />
                ))}

                <Route
                  exact
                  path="/StudentDetailsMaster/ProvisionCertificate/View/:id"
                  element={<ProvisionCertificate />}
                />
                <Route
                  exact
                  path="/ProvisionCertificatePDF"
                  element={<ProvisionCertificatePDF />}
                />
              </>
              {/*Bank Master */}
              <>
                <Route
                  exact
                  path={"/BankMaster"}
                  element={<Navigate replace to="/BankMaster/Bank" />}
                />
                {["/BankMaster/Bank"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<BankMaster />}
                  />
                ))}
                <Route />
                <Route
                  exact
                  path="/BankMaster/Bank/New"
                  element={<BankForm />}
                />
                <Route
                  exact
                  path="/BankMaster/Bank/Update/:id"
                  element={<BankForm />}
                />
              </>
              {/*Student Intake */}
              <Route
                exact
                path={"/StudentIntakeMaster"}
                element={
                  <Navigate replace to="/StudentIntakeMaster/Studentintake" />
                }
              />
              {[
                "/StudentIntakeMaster/Studentintake",
                "StudentIntakeMaster/Summary",
                "StudentIntakeMaster/Grid",
              ].map((path) => (
                <Route
                  exact
                  key={path}
                  path={path}
                  element={<StudentIntakeMaster />}
                />
              ))}
              <>
                <Route
                  exact
                  path="/StudentIntakeForm"
                  element={<StudentIntakeForm />}
                />
                <Route
                  exact
                  path="/StudentIntakeSelection"
                  element={<StudentIntakeSelection />}
                />

                <Route
                  exact
                  path="/Summary"
                  element={<StudentIntakeSummary />}
                />
              </>

              {/*Event Master */}
              <>
                <Route
                  exact
                  path={"/EventMaster"}
                  element={<Navigate replace to="/EventMaster/Events" />}
                />
                {["/EventMaster/Events"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<EventMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/EventMaster/Event/New"
                  element={<EventCreationForm />}
                />
                <Route
                  exact
                  path="/EventMaster/Event/Update/:id"
                  element={<EventCreationForm />}
                />
              </>

              {/*Academic Section Master */}
              <>
                <Route
                  exact
                  path={"/AcademicSectionMaster"}
                  element={
                    <Navigate
                      replace
                      to="/AcademicSectionMaster/ClassCommencement"
                    />
                  }
                />
                {["/AcademicSectionMaster/ClassCommencement"].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<AcademicSectionMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/AcademicSectionMaster/commencement/New"
                  element={<ClassCommencementForm />}
                />
                <Route
                  exact
                  path="/AcademicSectionMaster/commencement/Update/:id"
                  element={<ClassCommencementForm />}
                />
              </>
              {/*Report Master */}
              <>
                <Route
                  exact
                  path="/ReportMaster"
                  element={<Navigate replace to="/ReportMaster/Report" />}
                />
                {[
                  "/ReportMaster/Report",
                  "/ReportMaster/Eligible",
                  "/ReportMaster/Promote",
                  "/ReportMaster/History",
                ].map((path) => (
                  <Route
                    exact
                    key={path}
                    path={path}
                    element={<ReportMaster />}
                  />
                ))}
                <Route
                  exact
                  path="/ReportMaster/Report"
                  element={<ReportForm />}
                />
                <Route
                  exact
                  path="/ReportMaster/Report/:schoolId/:programId/:acYearId/:yearsemId/:currentYearSem"
                  element={<ReportIndex />}
                />
                <Route
                  exact
                  path="/ReportMaster/Eligible"
                  element={<StudentEligibleForm />}
                />

                <Route
                  exact
                  path="/ReportMaster/Eligible/:schoolId/:programId/:yearsemId/:currentYearSem"
                  element={<StudentEligibleIndex />}
                />
                <Route
                  exact
                  path="/ReportMaster/Promote"
                  element={<StudentPromoteForm />}
                />
                <Route
                  exact
                  path="/ReportMaster/Promote/:schoolId/:programId/:yearsemId/:currentYearSem"
                  element={<StudentPromoteIndex />}
                />
                <Route
                  exact
                  path="/ReportMaster/History"
                  element={<StudentHistory />}
                />

                <Route
                  exact
                  path="/ReportMaster/History/:schoolId/:programId/:yearsemId/:currentYearSem"
                  element={<StudentHistoryIndex />}
                />

                {/* Time Table Reports  */}
                <Route
                  exact
                  path="/FacultyWorkload"
                  element={<FacultyWorkload />}
                />

                <Route
                  exact
                  path="/FacultyWorkloadDaywise/:empId/:year/:month"
                  element={<FacultyWorkloadDaywise />}
                />
              </>
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
            <Route
              exact
              path="/StudentDocumentCollectionPdf/:id"
              element={<StudentDocumentCollectionPdf />}
            />

            <Route
              exact
              path="/CandidateOfferLetterPdf/:id"
              element={<CandidateOfferLetterPdf />}
            />
          </Routes>
        </Router>
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
