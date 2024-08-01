import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  MemoryRouter as MRouter,
} from "react-router-dom";
import OverlayLoader from "./components/OverlayLoader";
import CreateRefreshmentRequest from "./pages/forms/cateringMaster/refreshmentApprover/CreateRefreshmentRequest.jsx";
import RefreshmentMaster from "./pages/forms/cateringMaster/refreshmentReport/RefreshmentMaster.jsx";
import AttendServiceMaster from "./pages/forms/myRequest/AttendServiceMaster.jsx";
import AttendServiceHistory from "./pages/forms/myRequest/AttendServiceHistory.jsx";
import AttendRequestMaster from "./pages/forms/myRequest/RequestMasterReport.jsx";
import ServiceRequestGraph from "./pages/forms/myRequest/graphView/ServiceRequestGraph.jsx";
import StoreIndentRequests from "./containers/indeces/inventoryMaster/StoreIndentRequests.jsx";
import RestrictWindowMaster from "./pages/masters/RestrictWindow.jsx";
import PaysliplockCreate from "./containers/indeces/restrictwindowMaster/paysliplock/createpaysliploack.jsx";
import PaysliplockEdit from "./containers/indeces/restrictwindowMaster/paysliplock/editpaysliploack.jsx";
import EventForm from "./containers/indeces/dailyPlanner/eventCreation.jsx";
import TaskList from "./containers/indeces/dailyPlanner/taskList.jsx";

const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FormExample = lazy(() => import("./containers/examples/FormExample"));
const NavigationLayout = lazy(() => import("./layouts/NavigationLayout"));
const SchedulerMaster = lazy(() => import("./components/SchedulerMaster.jsx"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

// Master pages
const CourseMaster = lazy(() => import("./pages/masters/CourseMaster"));
const BankMaster = lazy(() => import("./pages/masters/BankMaster.jsx"));
const NavigationMaster = lazy(() => import("./pages/masters/NavigationMaster"));
const InstituteMaster = lazy(() => import("./pages/masters/InstituteMaster"));
const InventoryMaster = lazy(() => import("./pages/masters/InventoryMaster"));
const TimeTableMaster = lazy(() =>
  import("./pages/masters/TimeTableMaster.jsx")
);
const PublicationReport = lazy(() =>
  import("./pages/masters/ProfessionalReport.jsx")
);

// Navigation Master
const ModuleForm = lazy(() =>
  import("./pages/forms/navigationMaster/ModuleForm")
);
const MenuForm = lazy(() => import("./pages/forms/navigationMaster/MenuForm"));
const SubmenuForm = lazy(() =>
  import("./pages/forms/navigationMaster/SubmenuForm")
);
const RoleForm = lazy(() => import("./pages/forms/navigationMaster/RoleForm"));

// User Creation
const UserForm = lazy(() => import("./pages/forms/UserForm"));
const UserIndex = lazy(() => import("./pages/indeces/UserIndex"));

// Institute Master
const OrganizationForm = lazy(() =>
  import("./pages/forms/instituteMaster/OrganizationForm")
);
const SchoolForm = lazy(() =>
  import("./pages/forms/instituteMaster/SchoolForm")
);
const JobtypeForm = lazy(() =>
  import("./pages/forms/instituteMaster/JobtypeForm")
);
const EmptypeForm = lazy(() =>
  import("./pages/forms/instituteMaster/EmptypeForm")
);
const GraduationForm = lazy(() =>
  import("./pages/forms/instituteMaster/GraduationForm")
);
const SchoolVisionForm = lazy(() =>
  import("./pages/forms/instituteMaster/SchoolVisionForm")
);

// Shift
const ShiftMaster = lazy(() => import("./pages/masters/ShiftMaster"));
const ShiftForm = lazy(() => import("./pages/forms/shiftMaster/ShiftForm"));

//PO

const ApproverCreation = lazy(() =>
  import("./pages/forms/inventoryMaster/ApproverCreation.jsx")
);

const ApproverIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/ApproverIndex.jsx")
);

const DirectPOCreation = lazy(() =>
  import("./pages/forms/inventoryMaster/DirectPOCreation")
);

const DraftPoView = lazy(() =>
  import("./pages/forms/inventoryMaster/DraftPoView.jsx")
);

const PoMaster = lazy(() => import("./pages/masters/PoMaster.jsx"));

const CreateGrn = lazy(() =>
  import("./pages/forms/inventoryMaster/CreateGrn.jsx")
);

const AssignPoApprover = lazy(() =>
  import("./containers/indeces/inventoryMaster/AssignPoApprover.jsx")
);

const PoAssignedData = lazy(() =>
  import("./containers/indeces/inventoryMaster/PoAssignedData.jsx")
);

const DirectPOPdf = lazy(() =>
  import("./pages/forms/inventoryMaster/DirectPOPdf.jsx")
);

const PoPdf = lazy(() => import("./pages/forms/inventoryMaster/PoPdf.jsx"));

const PoUpdate = lazy(() =>
  import("./pages/forms/inventoryMaster/PoUpdate.jsx")
);

const CreatedGRN = lazy(() => import("./components/CreatedGRN.jsx"));

const GrnIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/GrnIndex.jsx")
);

const GrnPdf = lazy(() => import("./pages/forms/inventoryMaster/GrnPdf.jsx"));

//Inventory Master
const StoreForm = lazy(() => import("./pages/forms/inventoryMaster/StoreForm"));
const MeasureForm = lazy(() =>
  import("./pages/forms/inventoryMaster/MeasureForm")
);
const VendorForm = lazy(() =>
  import("./pages/forms/inventoryMaster/VendorForm")
);

const ItemCreation = lazy(() =>
  import("./pages/forms/inventoryMaster/ItemCreation.jsx")
);

const ItemIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/ItemIndex.jsx")
);

const ItemAssignemnt = lazy(() =>
  import("./pages/forms/inventoryMaster/ItemAssignment.jsx")
);

const ItemAssignmentIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/ItemInstoreIndexNew.jsx")
);

const View = lazy(() => import("./pages/forms/inventoryMaster/View.jsx"));

//Event Master
const EventMaster = lazy(() => import("./pages/masters/EventMaster"));

const EventCreationForm = lazy(() =>
  import("./pages/forms/eventMaster/EventCreationForm")
);

// Candidate Walkin
const CandidateWalkinForm = lazy(() =>
  import("./pages/forms/candidateWalkin/CandidateWalkinForm")
);
const CandidateWalkinIndex = lazy(() =>
  import("./pages/indeces/CandidateWalkinIndex")
);
const PreAdmissionProcessForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreAdmissionProcessForm")
);
const PreGrantApproveMaster = lazy(() =>
  import("./pages/masters/PreGrantApproveMaster")
);
const PreScholarshipApproverForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreScholarshipApproverForm")
);
const PreGrantVerifyMaster = lazy(() =>
  import("./pages/masters/PreGrantVerifyMaster")
);
const PreScholarshipVerifierForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreScholarshipVerifierForm")
);
const OfferLetterView = lazy(() =>
  import("./pages/forms/candidateWalkin/OfferLetterView")
);
const AuidForm = lazy(() => import("./pages/forms/candidateWalkin/AuidForm"));

const MyProfile = lazy(() => import("./components/MyProfile"));

// Academic Calendar
const AcademicCalendars = lazy(() =>
  import("./pages/masters/AcademicCalendars")
);
const AcademicyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/AcademicyearForm")
);
const CalenderyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/CalenderyearForm")
);
const FinancialyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/FinancialyearForm")
);

// Academic Master
const AcademicMaster = lazy(() => import("./pages/masters/AcademicMaster"));
const DepartmentForm = lazy(() =>
  import("./pages/forms/academicMaster/DepartmentForm")
);
const DepartmentAssignmentForm = lazy(() =>
  import("./pages/forms/academicMaster/DepartmentAssignmentForm")
);
const ProgramForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramForm")
);
const ProgramAssignmentForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramAssignmentForm")
);
const ProgramSpecializationForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramSpecializationForm")
);
const VisionMissionForm = lazy(() =>
  import("./pages/forms/academicMaster/VisionMissionForm")
);
const InternalAssignmentForm = lazy(() =>
  import("./pages/forms/academicMaster/InternalAssignmentForm")
);

// Course Pattern

const CourseForm = lazy(() => import("./pages/forms/courseMaster/CourseForm"));

const CourseTypeForm = lazy(() =>
  import("./pages/forms/courseMaster/CourseTypeForm")
);
const CourseCategoryForm = lazy(() =>
  import("./pages/forms/courseMaster/CourseCategoryForm")
);
const CourseStudentAssignment = lazy(() =>
  import("./pages/forms/courseMaster/CourseStudentAssignment")
);
const CourseStudentAssignmentIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseStudentAssignmentIndex")
);

const Courseassignmentstudentindex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseAssignmentStudentIndex")
);

const CoursePatternIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CoursePatternIndex")
);
const CoursePatternForm = lazy(() =>
  import("./pages/forms/courseMaster/CoursePatternForm")
);

// CategoryType Master Forms

const CommencementTypeForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CommencementTypeForm")
);

// Course Assignment
const CourseassignmentIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseassignmentIndex")
);
const CourseAssignment = lazy(() =>
  import("./pages/forms/courseMaster/CourseAssignment")
);

// Admission Master
const AdmissionMaster = lazy(() => import("./pages/masters/AdmissionMaster"));
const AdmCategoryForm = lazy(() =>
  import("./pages/forms/admissionMaster/AdmCategoryForm")
);
const AdmSubCategoryForm = lazy(() =>
  import("./pages/forms/admissionMaster/AdmSubcategoryForm")
);
const BoardForm = lazy(() => import("./pages/forms/admissionMaster/BoardForm"));
const CurrencytypeForm = lazy(() =>
  import("./pages/forms/admissionMaster/CurrencyForm")
);
const ProgramtypeForm = lazy(() =>
  import("./pages/forms/admissionMaster/ProgramtypeForm")
);

//Consumables

const Consumables = lazy(() => import("./pages/masters/Consumables.jsx"));

const ConsumablesReport = lazy(() =>
  import("./containers/indeces/inventoryMaster/Expenditure.jsx")
);

const ClosingstockReport = lazy(() =>
  import("./components/ClosingstockReport.jsx")
);

// Fee Template
const FeetemplateMaster = lazy(() =>
  import("./pages/masters/FeetemplateMaster")
);
const FeeTemplate = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeeTemplate")
);
const FeetemplateSubamount = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateSubamount")
);
const FeetemplateLateral = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateLateral.jsx")
);

const FeetemplateApprovalIndex = lazy(() =>
  import("./containers/indeces/feetemplateMaster/FeetemplateApprovalIndex")
);
const ViewFeetemplateSubAmount = lazy(() =>
  import("./pages/forms/feetemplateMaster/ViewFeetemplateSubAmount")
);
const FeetemplateAttachmentView = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateAttachmentView")
);
const FeetemplateSubAmountHistory = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateSubAmountHistory")
);
const FeetemplateApproval = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateApproval")
);

const FeetemplatePdf = lazy(() =>
  import("./containers/indeces/feetemplateMaster/FeetemplatePdf.jsx")
);

// Account Master
const AccountMaster = lazy(() => import("./pages/masters/AccountMaster"));
const TallyHeadForm = lazy(() =>
  import("./pages/forms/accountMaster/TallyheadForm.jsx")
);
const VoucherForm = lazy(() =>
  import("./pages/forms/accountMaster/VoucherForm")
);
const VoucherAssignmentForm = lazy(() =>
  import("./pages/forms/accountMaster/VoucherAssignmentForm")
);
const GroupForm = lazy(() => import("./pages/forms/accountMaster/GroupForm"));
const LedgerForm = lazy(() => import("./pages/forms/accountMaster/LedgerForm"));
const OpeningBalanceUpdateForm = lazy(() =>
  import("./pages/forms/accountMaster/OpeningBalanceUpdateForm")
);

//Bank Master

const BankGroup = lazy(() => import("./pages/forms/bankMaster/BankGroup.jsx"));

const BankForm = lazy(() => import("./pages/forms/bankMaster/BankForm"));
const BankImport = lazy(() => import("./pages/forms/bankMaster/BankImport"));
const BankClearedHistory = lazy(() =>
  import("./containers/indeces/bankMaster/BankImportClearedHistory")
);
const BankIndex = lazy(() =>
  import("./containers/indeces/bankMaster/BankIndex.jsx")
);

const DollartoInrForm = lazy(() =>
  import("./pages/forms/bankMaster/DollartoInrForm.jsx")
);

const DollartoInrIndex = lazy(() =>
  import("./containers/indeces/bankMaster/DollartoInr.jsx")
);

// Category Type Master
const CategoryTypeMaster = lazy(() =>
  import("./pages/masters/CategoryTypeMaster")
);
const CategoryTypeForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CategoryTypeForm")
);
const CategoryDetailsForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CategoryDetailsForm")
);

// Job Portal
const JobPortalIndex = lazy(() => import("./pages/indeces/JobPortalIndex"));
const InterView = lazy(() => import("./pages/forms/jobPortal/InterView"));
const ResultForm = lazy(() => import("./pages/forms/jobPortal/ResultForm"));
const SalaryBreakupForm = lazy(() =>
  import("./pages/forms/jobPortal/SalaryBreakupForm")
);
const OfferForm = lazy(() => import("./pages/forms/jobPortal/OfferForm"));
const RecruitmentForm = lazy(() =>
  import("./pages/forms/jobPortal/RecruitmentForm")
);
const HodCommentsIndex = lazy(() => import("./pages/indeces/HodCommentsIndex"));
const OfferLetterPrint = lazy(() =>
  import("./pages/forms/jobPortal/OfferLetterPrint")
);
const SalaryBreakupPrint = lazy(() =>
  import("./pages/forms/jobPortal/SalaryBreakupPrint")
);
const OfferAccepted = lazy(() =>
  import("./pages/forms/jobPortal/OfferAccepted")
);

// Desgination Master
const DesignationMaster = lazy(() =>
  import("./pages/masters/DesignationMaster")
);
const DesignationForm = lazy(() =>
  import("./pages/forms/designationMaster/DesignationForm")
);

// Salary Master
const SalaryMaster = lazy(() => import("./pages/masters/SalaryMaster"));
const SalaryStructureForm = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureForm")
);
const SalaryStructureHeadForm = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureHeadForm")
);
const SalaryStructureAssignment = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureAssignment")
);
const SlabStructureForm = lazy(() =>
  import("./pages/forms/salaryMaster/SlabStructureForm")
);

// Mentor Master
const ProctorheadForm = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorheadForm")
);
const ProctorStudentAssignmentForm = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentAssignmentForm")
);
const ProctorStudentAssignmentIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentAssignmentIndex")
);
const ProctorStudentHistory = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentHistory.jsx")
);
const ProctorMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorMeeting.jsx")
);
const ProctorStudentMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentMeeting.jsx")
);
const ProctorStudentMeetingIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentMeetingIndex.jsx")
);
const ProctorStudentMaster = lazy(() =>
  import("./pages/masters/ProctorStudentMaster.jsx")
);
const ProctorStudentsMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentsMeeting.jsx")
);
const MentorMaster = lazy(() => import("./pages/masters/MentorMaster"));

//Timetable Master

// TimeTable Master Forms

const SectionAssignmentForm = lazy(() =>
  import("./pages/forms/sectionMaster/SectionAssignmentForm")
);
const BatchAssignmentForm = lazy(() =>
  import("./pages/forms/timeTableMaster/BatchAssignmentForm")
);
const TimetableForSectionForm = lazy(() =>
  import("./pages/forms/timeTableMaster/TimetableForSectionForm")
);
const TimetableForBatchForm = lazy(() =>
  import("./pages/forms/timeTableMaster/TimetableForBatchForm")
);
const CourseAssignmentForm = lazy(() =>
  import("./pages/forms/timeTableMaster/CourseAssignmentForm")
);
const TimeTabeleView = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableView")
);
const TimeTableViewDateWise = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewDateWise")
);
const TimeTableDateWisePDF = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableDateWisePDF")
);
const TimeTableViewForCourse = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewForCourse")
);
const TimeTableViewWeekWise = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewWeekWise")
);
const TimeTableFacultyViewPDF = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableFacultyViewPDF")
);
const TimeTableViewWeekWisePdf = lazy(() =>
  import("./pages/forms/timeTableMaster/TimeTableViewWeekWisePdf")
);

// Employee Master
const EmployeeIndex = lazy(() => import("./pages/indeces/EmployeeIndex"));
const EmployeeUpdateForm = lazy(() =>
  import("./pages/forms/jobPortal/EmployeeUpdateForm")
);
const ContractEmployeePaymentHistory = lazy(() =>
  import("./pages/indeces/ContractEmployeePaymentHistory")
);
const ContractPaymentHistory = lazy(() =>
  import("./pages/indeces/ContractPaymentHistory")
);
const ConsultantPaySheet = lazy(() =>
  import("./pages/indeces/ConsultantPaySheet")
);
const EmployeeDetailsView = lazy(() =>
  import("./components/EmployeeDetailsView")
);
const EmpAttendanceTrigger = lazy(() =>
  import("./pages/forms/employeeMaster/EmpAttendanceTrigger")
);
const ImportBioTrans = lazy(() =>
  import("./pages/forms/employeeMaster/ImportBioTranse")
);
const EmpAttendanceFilterForm = lazy(() =>
  import("./pages/forms/employeeMaster/EmpAttendanceFilterForm")
);
const EmployeeDetailsMaster = lazy(() =>
  import("./pages/masters/EmployeeDetailsMaster.jsx")
);
const EmpDetailsMaster = lazy(() =>
  import("./pages/masters/EmpDetailsMaster.jsx")
);
const EmployeeSalaryApprovalIndex = lazy(() =>
  import("./pages/indeces/EmployeeSalaryApproverIndex.jsx")
);
const EmployeeDetailsHistory = lazy(() =>
  import("./pages/indeces/EmployeeDetailsHistory.jsx")
);
const EmpResignationForm = lazy(() =>
  import("./pages/forms/employeeMaster/EmpResignationForm")
);
const EmployeeResignationIndex = lazy(() =>
  import("./pages/indeces/EmployeeResignationIndex")
);

const EmployeeCalendar = lazy(() => import("./components/employeeCalendar"));

const PaySlip = lazy(() => import("./components/payslip.jsx"));
const MasterSalary = lazy(() => import("./components/masterSalary"));
const PayreportPdf = lazy(() => import("./components/payreportPdf.jsx"));
const DeductionMaster = lazy(() => import("./pages/masters/DeductionMaster"));
const TdsForm = lazy(() => import("./pages/forms/employeeMaster/TdsForm"));
const AdvanceDeductionForm = lazy(() =>
  import("./pages/forms/employeeMaster/AdvanceDeductionForm.jsx")
);
const ExtraRemuneration = lazy(() =>
  import("./pages/forms/employeeMaster/ExtraRemuneration")
);
const ExtraRemunerationIndex = lazy(() =>
  import("./pages/indeces/ExtraRemunerationIndex")
);
const EmployeeUserwiseMaster = lazy(() =>
  import("./pages/masters/EmployeeUserwiseMaster")
);
const EmployeeProfile = lazy(() => import("./components/EmployeeProfile.jsx"));
const NoduesApproverIndex = lazy(() =>
  import("./pages/indeces/NoduesApproverIndex")
);
const NoduesApproverHistoryIndex = lazy(() =>
  import("./pages/indeces/NoduesApproverHistoryIndex")
);

// Catering Master
const AssignmentDetailsMaster = lazy(() =>
  import("./pages/forms/cateringMaster/AssignmentDetailsMaster")
);
const RefreshmentDetailsMaster = lazy(() =>
  import(
    "./pages/forms/cateringMaster/refreshmentApprover/RefreshmentMasterDetails"
  )
);
const RefreshmentTypeForm = lazy(() =>
  import("./pages/forms/cateringMaster/CreateRefreshmentForm")
);
const MessAssignmentForm = lazy(() =>
  import("./pages/forms/cateringMaster/MessAssignmentForm.jsx")
);
const MealAssignmentForm = lazy(() =>
  import("./pages/forms/cateringMaster/MealAssignmentForm")
);
const RefreshmentRequestForm = lazy(() =>
  import(
    "./pages/forms/cateringMaster/refreshmentRequest/RefreshmentRequestForm"
  )
);

// Service Request
const ServiceMaster = lazy(() =>
  import("./pages/forms/myRequest/ServiceMaster")
);
const ServiceTypeForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceTypeForm")
);
const ServiceAssignmentForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceAssignmentForm")
);
const ServiceRequestIndex = lazy(() =>
  import("./pages/forms/myRequest/CreateServiceRequestIndex")
);
const CreateServiceReqForm = lazy(() =>
  import("./pages/forms/myRequest/CreateServiceRequest")
);
const AttendServiceRequest = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceRequest")
);
const AttendServiceRendorIndex = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceRequestRendorIndex")
);

const ServiceRequestDept = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestDept.jsx")
);

const ServiceRequestDeptWise = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestDeptWise.jsx")
);

const ServiceRequestTransport = lazy(() =>
  import("./pages/forms/myRequest/ServiceRequestTransport.jsx")
);

const ServiceTransportView = lazy(() =>
  import("./pages/forms/myRequest/ServiceTransportView.jsx")
);

// Store Indent
const StoreIndentApproverIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentApproverIndex.jsx")
);
const StoreIndentHistory = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentHistory.jsx")
);
const StoreIndent = lazy(() =>
  import("./pages/forms/inventoryMaster/StoreIndent.jsx")
);
const StoreIndentIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentIndex.jsx")
);

const Pojspdf = lazy(() => import("./pages/forms/inventoryMaster/Pojspdf.jsx"));

const StockIssuePdf = lazy(() =>
  import("./pages/forms/inventoryMaster/StockIssuePdf.jsx")
);

const PurchaseIndent = lazy(() =>
  import("./pages/forms/inventoryMaster/PurchaseIndent.jsx")
);

const PurchaseIndentIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentIndex.jsx")
);

const PurchaseIndentApprovalIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentApprovalIndex.jsx")
);

const PurchaseIndentIndexUserwise = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentIndexUserwise.jsx")
);

const PurchaseIndentHistory = lazy(() =>
  import("./containers/indeces/inventoryMaster/PurchaseIndentHistory.jsx")
);

// Leave Master
const LeaveMaster = lazy(() => import("./pages/masters/LeaveMaster"));
const LeaveTypeForm = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveTypeForm")
);
const LeavePatternForm = lazy(() =>
  import("./pages/forms/leavePatternMaster/LeavePatternForm")
);
const LeaveApplyForm = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveApplyForm")
);
const LeaveApplyIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApplyIndex")
);
const InitialLeave = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveApplyAdminForm")
);
const LeaveApproverIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApproverIndex")
);
const LeaveApprovedHistoryIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApprovedHistoryIndex")
);
const LeaveApplyAdminIndex = lazy(() =>
  import("./containers/indeces/leaveMaster/LeaveApplyAdminIndex")
);
const DeatilsByLeaveType = lazy(() =>
  import("./containers/indeces/leaveMaster/DetailsByLeaveType.jsx")
);
const InitiateLeaveAdmin = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveApplyHodForm")
);
// Infrastructure Master
const InfrastructureMaster = lazy(() =>
  import("./pages/masters/InfrastructureMaster")
);
const FacilityForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/FacilityForm")
);
const BlockForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/BlockForm")
);
const RoomForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/RoomForm")
);

const DocumentsRepo = lazy(() =>
  import("./pages/forms/documentrepo/index.jsx")
);
const DocumentList = lazy(() =>
  import("./pages/forms/documentrepo/documentsList")
);
const CustomTemplate = lazy(() =>
  import("./pages/forms/documentrepo/custom-template.jsx")
);

// Holiday Calendar Master
const HolidayCalenderMaster = lazy(() =>
  import("./pages/masters/HolidayCalenderMaster")
);
const HolidayCalenderForm = lazy(() =>
  import("./pages/forms/holidayCalenderMaster/HolidayCalenderForm")
);
const DeAssignDepartment = lazy(() =>
  import("./pages/forms/holidayCalenderMaster/DeAssignDepartment")
);

// Section Master
const SectionMaster = lazy(() => import("./pages/masters/SectionMaster"));
const SectionForm = lazy(() =>
  import("./pages/forms/sectionMaster/SectionForm")
);
const BatchForm = lazy(() => import("./pages/forms/sectionMaster/BatchForm"));
const TimeIntervalTypesForm = lazy(() =>
  import("./pages/forms/sectionMaster/TimeIntervalTypesForm")
);
const InternalCreationForm = lazy(() =>
  import("./pages/forms/academicMaster/InternalCreationForm")
);
const TimeSlotsForm = lazy(() =>
  import("./pages/forms/sectionMaster/TimeSlotsForm")
);

//  Research Profile
const ResearchProfileIndex = lazy(() =>
  import("./pages/indeces/ResearchProfileIndex.jsx")
);
const ResearchProfileForm = lazy(() =>
  import("./pages/forms/employeeMaster/ResearchProfileForm.jsx")
);

const ResearchProfileAttachmentView = lazy(() =>
  import("./pages/indeces/ResearchProfileAttachmentView.jsx")
);

const ResearchProfileReport = lazy(() =>
  import("./pages/indeces/ResearchProfileReport.jsx")
);

// Transcript Master
const TranscriptMaster = lazy(() => import("./pages/masters/TranscriptMaster"));
const StudentTranscriptMaster = lazy(() =>
  import("./pages/masters/StudentTranscriptMaster")
);
const TranscriptForm = lazy(() =>
  import("./pages/forms/transcriptMaster/TranscriptForm")
);
const TranscriptAssignmentForm = lazy(() =>
  import("./pages/forms/transcriptMaster/TranscriptAssignmentForm")
);
const UniversityForm = lazy(() =>
  import("./pages/forms/transcriptMaster/UniversityForm")
);
const StudentTranscriptForm = lazy(() =>
  import("./pages/forms/studentTranscriptsMaster/StudentTranscriptForm")
);

// Make Employee Permanent - Employee Index
const EmployeePermanentAttachmentView = lazy(() =>
  import("./components/EmployeePermanentAttachmentView.jsx")
);

//  ID Card
const IDCardPrint = lazy(() => import("./pages/indeces/IDCardPrint.jsx"));
const StudentIdCard = lazy(() =>
  import("./pages/indeces/StudentIdCardIndex.jsx")
);
const StaffIdCard = lazy(() => import("./pages/indeces/StaffIdCardIndex.jsx"));
const ViewStaffIdCard = lazy(() =>
  import("./containers/indeces/StaffIdCard/ViewStaffIDCard.jsx")
);
const ViewStudentIdCard = lazy(() =>
  import("./containers/indeces/StudentIdCard/ViewStudentIDCard.jsx")
);
// Student Master
const SpotAdmissionForm = lazy(() =>
  import("./pages/forms/studentDetailMaster/SpotAdmissionForm")
);
const StudentDetailsMaster = lazy(() =>
  import("./pages/masters/StudentDetailsMaster")
);
const InactiveStudentsIndex = lazy(() =>
  import("./containers/indeces/studentDetailMaster/InactiveStudentIndex")
);

// Salary Lock
const SalaryLockForm = lazy(() =>
  import("./pages/forms/employeeMaster/SalaryLockForm")
);

const FeeReceipt = lazy(() => import("./pages/forms/studentMaster/FeeReceipt"));
const StudentFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/StudentFeeReceipt")
);
const FeeReceiptDetails = lazy(() =>
  import("./pages/forms/studentMaster/FeeReceiptDetails")
);
const StudentFeeReceiptDetailsPDF = lazy(() =>
  import("./pages/forms/studentMaster/StudentFeeReceiptPDF.jsx")
);
const FeeReceiptDetailsPDF = lazy(() =>
  import("./pages/forms/studentMaster/FeeReceiptDetailsPDF")
);

const FeeReceiptIndex = lazy(() =>
  import("./containers/indeces/studentMaster/StudentFeereceiptIndex")
);

const BulkFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceipt")
);
const BulkFeeReceiptView = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceiptView")
);
const BulkFeeReceiptPdf = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceiptPdf")
);
const BulkFeeReceiptForm = lazy(() =>
  import("./pages/forms/studentMaster/BulkFeeReceiptForm")
);

const CancelFeeReceipt = lazy(() =>
  import("./pages/forms/studentMaster/CancelFeeReceipt")
);

const CancelFeeReceiptIndex = lazy(() =>
  import("./containers/indeces/studentMaster/CancelReceiptIndex.jsx")
);

//  Vacation Leave
const VacationLeaveIndex = lazy(() =>
  import("./containers/indeces/vacationLeaveMaster/VacationLeaveIndex.jsx")
);

const VacationLeaveForm = lazy(() =>
  import("./pages/forms/vacationLeave/VacationLeaveForm.jsx")
);

//  Tech Web
const TechWeb = lazy(() => import("./pages/forms/techWeb/TechWeb.jsx"));
//  ACERP Fee Template
const PaidAcerpAmountIndex = lazy(() =>
  import("./pages/indeces/PaidACERPAmountIndex.jsx")
);

const PaidAcerpAmountForm = lazy(() =>
  import("./pages/forms/paidAcerpAmount/PaidAcerpAmountForm.jsx")
);

function RouteConfig() {
  const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token;

  return (
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

        <Route
          exact
          path="/Login"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <Login />
            </Suspense>
          }
        ></Route>

        <Route
          exact
          path="/ForgotPassword"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ForgotPassword />
            </Suspense>
          }
        />

        <Route
          exact
          path="/ResetPassword"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ResetPassword />
            </Suspense>
          }
        />

        <Route
          element={
            <Suspense fallback={<OverlayLoader />}>
              <NavigationLayout />
            </Suspense>
          }
        >
          <Route
            exact
            path="/Dashboard"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchedulerMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FormExample"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FormExample />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ChangePassword"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ChangePassword />
              </Suspense>
            }
          />
          {/* Navigation Master  */}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <NavigationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/NavigationMaster/Module/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ModuleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Module/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ModuleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Menu/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Menu/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Submenu/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Submenu/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Role/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Role/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/documentsrepo"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DocumentsRepo />
              </Suspense>
            }
          />
          <Route
            exact
            path="/documentsrepo/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DocumentList />
              </Suspense>
            }
          />
          <Route
            exact
            path="/documentsrepo/custom-template"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CustomTemplate />
              </Suspense>
            }
          />
          {/* User Creation  */}
          <Route
            exact
            path="/UserIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UserIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/UserForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UserForm />
              </Suspense>
            }
          />
          {/* Institute Master  */}
          <Route
            exact
            path={"/InstituteMaster"}
            element={<Navigate replace to="/InstituteMaster/Organization" />}
          />
          {[
            "/InstituteMaster/Organization",
            "/InstituteMaster/School",
            "/InstituteMaster/JobType",
            "/InstituteMaster/EmpType",
            "/InstituteMaster/Graduation",
            "/InstituteMaster/Visions",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InstituteMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InstituteMaster/Organization/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OrganizationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Organization/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OrganizationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/School/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/School/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Jobtype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Jobtype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Emptype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmptypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Emptype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmptypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Graduation/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GraduationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Graduation/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GraduationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/SchoolVision/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolVisionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/SchoolVision/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolVisionForm />
              </Suspense>
            }
          />
          {/* Shift   */}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ShiftMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/ShiftMaster/Shifts/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ShiftForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ShiftMaster/Shifts/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ShiftForm />
              </Suspense>
            }
          />
          {/* Candidate Walkin  */}
          <Route
            exact
            path="/CandidateWalkinForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CandidateWalkinIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PreAdmissionProcessForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreAdmissionProcessForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/PrescholarshipapproverIndex"}
            element={<Navigate replace to="/PreGrantMaster/Approve" />}
          />
          {["/PreGrantMaster/Approve", "/PreGrantMaster/History"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <PreGrantApproveMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/PreScholarshipApproverForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreScholarshipApproverForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/PreGrantVerifyMaster"}
            element={<Navigate replace to="/PreGrantVerifyMaster/Approve" />}
          />
          {[
            "/PreGrantVerifyMaster/Approve",
            "/PreGrantVerifyMaster/History",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <PreGrantVerifyMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/PreScholarshipVerifierForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreScholarshipVerifierForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/offerletterview/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferLetterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AuidForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AuidForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MyProfile"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MyProfile />
              </Suspense>
            }
          />
          {/* Academic Calendar  */}
          <Route
            exact
            path={"/AcademicCalendars"}
            element={<Navigate replace to="/AcademicCalendars/AcademicYear" />}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AcademicCalendars />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AcademicCalendars/Academicyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcademicyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Academicyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcademicyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Financialyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FinancialyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Financialyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FinancialyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Calenderyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CalenderyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Calenderyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CalenderyearForm />
              </Suspense>
            }
          />
          {/*Consumables */}
          <Route
            exact
            path="/Consumables"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <Consumables />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Consumables/:groupName/:groupId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ConsumablesReport />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ClosingstockReport/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ClosingstockReport />
              </Suspense>
            }
          />

          {/* Academic Master  */}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AcademicMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AcademicMaster/Department/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Department/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/DepartmentAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/DepartmentAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Program/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Program/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramSpecialization/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramSpecializationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramSpecialization/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramSpecializationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/VisionMission/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VisionMissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/VisionMission/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VisionMissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InternalAssignment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalAssignmentForm />
              </Suspense>
            }
          />
          {/* Course Pattern */}
          <Route
            exact
            path="/CoursePatternIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CoursePatternForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CoursePatternForm/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternForm />
              </Suspense>
            }
          />

          {/*Course Master*/}

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
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <CourseMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/CourseForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseAssignment"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseAssignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseTypeForm/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseTypeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseTypeForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseTypeForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseCategoryForm/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseCategoryForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseCategoryForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseCategoryForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseMaster/Student/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseStudentAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseMaster/Student/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseStudentAssignment />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CoursePatternForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CoursePatternForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CoursePatternForm/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CoursePatternForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/CoursePatternIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CoursePatternIndex />
                </Suspense>
              }
            />
            <Route
              exact
              path="/CourseassignmentIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseassignmentIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/Courseassignmentstudentindex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <Courseassignmentstudentindex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/CourseStudentAssignmentIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseStudentAssignmentIndex />
                </Suspense>
              }
            />
          </>

          {/* Course Assignment  */}
          <Route
            exact
            path="/CourseassignmentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseassignmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CourseAssignment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseAssignment />
              </Suspense>
            }
          />
          {/* Admission Master  */}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AdmissionMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AdmissionMaster/AdmissionCategory/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionCategory/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionSubCategory/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmSubCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionSubCategory/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmSubCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Board/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BoardForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Board/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BoardForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Currencytype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CurrencytypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Currencytype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CurrencytypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Programtype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Programtype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramtypeForm />
              </Suspense>
            }
          />
          {/* Fee Template  */}
          <Route
            exact
            path="/FeetemplateMaster"
            element={<Navigate replace to="/FeetemplateMaster/Feetemplate" />}
          />
          {["/FeetemplateMaster/Feetemplate", "FeetemplateMaster/Route"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FeetemplateMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/FeetemplateMaster/Feetemplate/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeTemplate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateSubamount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateMaster/EditFeetemplateSubAmount/:id/1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />

          <Route
            exact
            path="/Feetemplatemaster/Feetemplatesubamount/:id/:yearsemId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateLateral />
              </Suspense>
            }
          />

          <Route
            exact
            path="/Feetemplatemaster/Editsubamount/:id/:yearsemId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateLateral />
              </Suspense>
            }
          />

          <Route
            exact
            path="/FeetemplateMaster/EditFeetemplateSubAmount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateApprovalIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateApprovalIndex />
              </Suspense>
            }
          />
          {/* Account Master  */}
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
            "/AccountMaster/OpeningBalance",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AccountMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AccountMaster/Tallyhead/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TallyHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Tallyhead/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TallyHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Voucher/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/VoucherAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/VoucherAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Group/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GroupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Group/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GroupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Ledger/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Ledger/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Voucher/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/OpeningBalanceUpdateForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OpeningBalanceUpdateForm />
              </Suspense>
            }
          />
          {/*Bank Master */}
          <>
            <Route
              exact
              path={"/BankMaster"}
              element={<Navigate replace to="/BankMaster/Import" />}
            />
            {[
              "/BankMaster/Import",
              "/BankMaster/Group",
              "/BankMaster/Bank",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <BankMaster />
                  </Suspense>
                }
              />
            ))}
            <Route />
            <Route
              exact
              path="/BankMaster/Bank/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/BankMaster/Bank/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankMaster/BankImport/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankImport />
                </Suspense>
              }
            />
            <Route
              exact
              path="/BankClearedHistory"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankClearedHistory />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankMaster/BankGroup"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankGroup />
                </Suspense>
              }
            />

            <Route
              exact
              path="/BankMaster/BankGroup/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BankGroup />
                </Suspense>
              }
            />

            <Route
              exact
              path="/DollartoInrForm"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DollartoInrForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/DollartoInrIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DollartoInrIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/DollartoInr/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DollartoInrForm />
                </Suspense>
              }
            />
          </>
          <Route
            exact
            path={"/DeductionMaster"}
            element={<Navigate replace to="/DeductionMaster/Tds" />}
          />
          {["/DeductionMaster/Tds", "/DeductionMaster/Advance"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DeductionMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/DeductionMaster/TdsForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TdsForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DeductionMaster/AdvanceDeductionForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdvanceDeductionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ViewFeetemplateSubAmount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ViewFeetemplateSubAmount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ViewFeetemplateSubAmount/:id/1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ViewFeetemplateSubAmount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateAttachmentView/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateAttachmentView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateMaster/Feetemplate/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeTemplate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateSubAmountHistory/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubAmountHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateApproval/:id/:yearsemId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateApproval />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplatePdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplatePdf />
              </Suspense>
            }
          />
          {/* Category Type Master  */}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CategoryTypeMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/CategoryTypeMaster/CategoryTypes/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CategoryTypeMaster/CategoryTypes/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CategoryTypeMaster/CategoryDetail/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryDetailsForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CategoryTypeMaster/CategoryDetail/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryDetailsForm />
              </Suspense>
            }
          />
          {/* Job Portal  */}
          <Route
            exact
            path="/JobPortal"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobPortalIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Interview/New/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Interview/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResultForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResultForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupForm/New/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupForm/Update/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupForm/New/:id/:offerId/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferForm/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Recruitment/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RecruitmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HodComments"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HodCommentsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferLetterPrint/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferLetterPrint />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupPrint/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupPrint />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferAccepted/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferAccepted />
              </Suspense>
            }
          />
          {/* Designation Master  */}
          <Route
            exact
            path="/DesignationMaster"
            element={<Navigate replace to="/DesignationMaster/Designations" />}
          />
          {["DesignationMaster/Designations"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DesignationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/DesignationMaster/Designations/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DesignationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DesignationMaster/Designations/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DesignationForm />
              </Suspense>
            }
          />
          {/* Salary Master  */}
          <Route
            exact
            path={"/SalaryMaster"}
            element={<Navigate replace to="/SalaryMaster/SalaryStructure" />}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SalaryMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/SalaryMaster/SalaryStructure/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructure/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureHead/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureHead/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureAssignment />
              </Suspense>
            }
          />
          <Route
            exact
            path="SlabStructureForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SlabStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="SlabStructureUpdate/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SlabStructureForm />
              </Suspense>
            }
          />
          {/* Mentor Master  */}
          <Route
            exact
            path={"/ProctorStudentMaster"}
            element={<Navigate replace to="/ProctorStudentMaster/Proctor" />}
          />
          {[
            "/ProctorStudentMaster/Proctor",
            "/ProctorStudentMaster/History",
            "/ProctorStudentMaster/Meeting",
            "/ProctorStudentMaster/Report",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ProctorStudentMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/ProctorMaster"}
            element={<Navigate replace to="/ProctorMaster/Proctor" />}
          />
          {[
            "/ProctorMaster/Proctor",
            "/ProctorMaster/History",
            "/ProctorMaster/Meeting",
            "/ProctorMaster/Report",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <MentorMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/MentorMaster/Mentor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorheadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorMaster/Mentor/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorheadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorMaster/Proctor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorAssignmentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentAssignmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Proctorstudenthistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorMeeting />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorStudentMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentMeeting />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorStudentsMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentsMeeting />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorStudentMeetingIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentMeetingIndex />
              </Suspense>
            }
          />
          {/* Employee Master  */}
          <Route
            exact
            path="/EmployeeIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeUpdateForm/:id/:offerId/:jobId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeUpdateForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ConsultantPaymentReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ContractPaymentHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ConsultantPay"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ConsultantPaySheet />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetailsView/:userId/:offerId/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/emp-resignation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeResignationIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/schedulertrigger"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceTrigger />
              </Suspense>
            }
          />
          <Route
            exact
            path="/biotransImport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ImportBioTrans />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Attendancesheet"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceFilterForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Newjoineeapprover"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeSalaryApprovalIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetailsHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmpDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpDetailsMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/payReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaySlip />
              </Suspense>
            }
          />
          <Route
            exact
            path="/masterSalary"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MasterSalary />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PayreportPdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PayreportPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeResignationIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeResignationIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/apply-resignation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpResignationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmpResignationForm/:type"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpResignationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ExtraRemuneration"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExtraRemuneration />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ExtraRemunerationIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ExtraRemunerationIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/EmployeeCalender"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeCalendar />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-userwiseindex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeUserwiseMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/employee-test"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeProfile />
              </Suspense>
            }
          />
          <Route
            exact
            path="/nodue-approver"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NoduesApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/nodue-history"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <NoduesApproverHistoryIndex />
              </Suspense>
            }
          />

          {/* Catering Master  */}
          <Route
            exact
            path={"/CateringMaster"}
            element={
              <Navigate replace to="/CateringMaster/RefreshmentTypeIndex" />
            }
          />
          {[
            "/CateringMaster/RefreshmentTypeIndex",
            "/CateringMaster/MessAssignmentIndex",
            "/CateringMaster/InstituteMealIndex",
            "/CateringMaster/RefreshmentCalenderView",
            "/CateringMaster/RefreshmentRequestIndex",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AssignmentDetailsMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/RefreshmentDetails"}
            element={
              <Navigate
                replace
                to="/RefreshmentDetails/RefreshmentApproverIndex"
              />
            }
          />
          {[
            "/RefreshmentDetails/RefreshmentApproverIndex",
            "/RefreshmentDetails/RefreshmentMailBox",
            "/RefreshmentDetails/RefreshmentRequestReport",
            "/RefreshmentDetails/ApprovedReport",
            "/RefreshmentDetails/Billing",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RefreshmentDetailsMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/CateringMaster/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentDetails/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateRefreshmentRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/RefreshmentTypeIndex/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MessAssign/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MessAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MessAssign/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MessAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MealAssign/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MealAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MealAssign/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MealAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/RefreshmentRequestIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentRequestForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentRequest/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentRequestForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/RefreshmentMaster"}
            element={
              <Navigate
                replace
                to="/RefreshmentMaster/RefreshmentRequestIndex"
              />
            }
          />
          {[
            "/RefreshmentMaster/RefreshmentRequestIndex",
            "/RefreshmentMaster/RefreshmentRequestReport",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RefreshmentMaster />
                </Suspense>
              }
            />
          ))}
          {/* Po Master */}
          <Route
            exact
            path={"/Pomaster"}
            element={<Navigate replace to="/Pomaster/Active" />}
          />
          {["/Pomaster/Active", "/Pomaster/Inactive"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <PoMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/DirectPOCreation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPOCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DirectPoCreation/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPOCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Draftpo"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssignPoApprover />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AssignPoApprover"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AssignPoApprover />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Approvepo"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoAssignedData />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CreateGrn/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateGrn />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DirectPOPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DirectPOPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DraftPoView/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DraftPoView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/POPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PoUpdate/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PoUpdate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ApproverCreation"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproverCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Approver/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproverCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ApproverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CreatedGRN"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreatedGRN />
              </Suspense>
            }
          />
          <Route
            exact
            path="/GrnIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GrnIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/GrnPdf/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GrnPdf />
              </Suspense>
            }
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
              "InventoryMaster/InStr",
              "/InventoryMaster/Assignment",
              "/InventoryMaster/Library",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <InventoryMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/InventoryMaster/Stores/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StoreForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Stores/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StoreForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Measures/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <MeasureForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Measures/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <MeasureForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Vendor/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <VendorForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/InventoryMaster/Vendor/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <VendorForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/VendorIndex/View/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <View />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ItemCreation"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemCreation />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ItemCreation/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemCreation />
                </Suspense>
              }
            />

            <Route
              exact
              path="/InventoryMaster/Assignment/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemAssignemnt />
                </Suspense>
              }
            />

            <Route
              exact
              path="/InventoryMaster/Assignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemAssignemnt />
                </Suspense>
              }
            />

            <Route
              exact
              path="/ItemAssignmentIndex"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ItemAssignmentIndex />
                </Suspense>
              }
            />

            <Route
              exact
              path="/StoreIndent"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StoreIndent />
                </Suspense>
              }
            />

            <Route
              exact
              path="/StoreIndentIndex"
              element={<StoreIndentIndex />}
            />
          </>
          {/*Event Master */}
          <>
            <Route
              exact
              path="/daily-planner"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TaskList />
                </Suspense>
              }
            />
            <Route
              exact
              path="/daily-planner/create"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventForm />
                </Suspense>
              }
            />
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
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <EventMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/EventMaster/Event/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventCreationForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/EventMaster/Event/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <EventCreationForm />
                </Suspense>
              }
            />
          </>
          {/* Service Request  */}
          <Route
            exact
            path={"/ServiceMaster"}
            element={<Navigate replace to="/ServiceMaster/ServiceTypes" />}
          />
          {[
            "/ServiceMaster/ServiceTypes",
            "/ServiceMaster/ServiceAssignment",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ServiceMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/ServiceRender"}
            element={<Navigate replace to="/ServiceRender/AttendRequest" />}
          />
          {["/ServiceRender/AttendRequest", "/ServiceRender/AttendHistory"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <AttendServiceMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/ServiceMaster/ServiceTypes/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMaster/ServiceTypes/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMaster/ServiceAssignment/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequest"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequest/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateServiceReqForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRender/attend"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRender/AttendRequest"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceRendorIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ServiceRequestDept"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestDept />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ServiceRequestDeptWise/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestDeptWise />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ServiceRequestTransport/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestTransport />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ServiceTransportView/:maintainenceId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTransportView />
              </Suspense>
            }
          />

          <Route
            exact
            path="/ServiceRender/AttendHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMasterReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendRequestMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMasterCharts"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestGraph />
              </Suspense>
            }
          />
          {/* Store Indent  */}
          <Route
            exact
            path="/StoreIndentApproverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StoreIndentHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StoreIndentRequests"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentRequests />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/StoreIndent/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndent />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/StoreIndentIndex"
            element={<StoreIndentIndex />}
          />

          <Route exact path="/Pojspdf" element={<Pojspdf />} />

          <Route
            exact
            path="/StockIssuePdf"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StockIssuePdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndent"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndent />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentApprovalIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentApprovalIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentIndexUserwise"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentIndexUserwise />
              </Suspense>
            }
          />

          <Route
            exact
            path="/PurchaseIndentHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PurchaseIndentHistory />
              </Suspense>
            }
          />

          <Route
            exact
            path="/InventoryMaster/StoreIndent/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndent />
              </Suspense>
            }
          />
          {/* Leave Master  */}
          <Route
            exact
            path={"/LeaveMaster"}
            element={<Navigate replace to="/LeaveMaster/LeaveType" />}
          />
          {[
            "/LeaveMaster/LeaveType",
            "/LeaveMaster/LeavePattern",
            "/LeaveMaster/ViewReport",
            "/LeaveMaster/Copy",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <LeaveMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/LeaveMaster/LeaveTypes/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveMaster/LeaveTypes/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeavePatternMaster/LeavePatterns/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeavePatternForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeavePatternMaster/LeavePatterns/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeavePatternForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApplyForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApplyForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InitiateLeave"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InitialLeave />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApplyIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApplyIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApproverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveApprovedHistoryIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApprovedHistoryIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveApplyAdminIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/LeaveDetails/:userId/:leaveId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DeatilsByLeaveType />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InitiateLeaveAdmin"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InitiateLeaveAdmin />
              </Suspense>
            }
          />
          {/* Infrastructure Master  */}
          <Route
            exact
            path={"/InfrastructureMaster"}
            element={<Navigate replace to="/InfrastructureMaster/Facility" />}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InfrastructureMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InfrastructureMaster/Facility/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacilityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Facility/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacilityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Block/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Block/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Rooms/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoomForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Rooms/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoomForm />
              </Suspense>
            }
          />

          {/* Time Table Master */}
          <>
            <Route
              exact
              path={"/TimeTableMaster"}
              element={<Navigate replace to="/TimeTableMaster/Timetable" />}
            />
            {[
              "TimeTableMaster/Timetable",
              "/TimeTableMaster/Course",
              "/TimeTableMaster/Section",
              "/TimeTableMaster/Batchassignment",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <TimeTableMaster />
                  </Suspense>
                }
              />
            ))}

            <Route
              exact
              path="/TimeTableMaster/sectionassignmentform/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SectionAssignmentForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/SectionAssignmentUpdate/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SectionAssignmentForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/Timetable/Section/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimetableForSectionForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/Timetable/Batch/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimetableForBatchForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/timeslots/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeSlotsForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/batchassignment/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BatchAssignmentForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/batchassignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <BatchAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableMaster/CourseAssignment/New"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignmentForm />
                </Suspense>
              }
            />
            <Route
              exact
              path="/TimeTableMaster/CourseAssignment/Update/:id"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CourseAssignmentForm />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableMaster/TimeTableView"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTabeleView />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewDateWise/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewDateWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableDateWisePDF/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableDateWisePDF />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewForCourse/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:courseId/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewForCourse />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewWeekWise/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewWeekWise />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableFacultyViewPDF/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:courseId/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableFacultyViewPDF />
                </Suspense>
              }
            />

            <Route
              exact
              path="/TimeTableViewWeekWisePdf/:acYearId/:schoolId/:programId/:programSpeId/:yearsemId/:sectionId/:date/:programType"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TimeTableViewWeekWisePdf />
                </Suspense>
              }
            />
          </>

          {/*Professional Report */}

          <Route exact path="/AddonReport" element={<PublicationReport />} />

          {/* Inventory Master  */}
          <Route
            exact
            path={"/InventoryMaster"}
            element={<Navigate replace to="/InventoryMaster/Stores" />}
          />
          {[
            "/InventoryMaster/Stores",
            "/InventoryMaster/Measures",
            "/InventoryMaster/Vendor",
            "/InventoryMaster/Item",
            "InventoryMaster/InStr",
            "/InventoryMaster/Assignment",
            "/InventoryMaster/Library",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InventoryMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InventoryMaster/Stores/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Stores/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Measures/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MeasureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Measures/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MeasureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Vendor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Item/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ItemIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Item/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Assignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemAssignemnt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Assignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemAssignemnt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/VendorIndex/View/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <View />
              </Suspense>
            }
          />

          {/*Timetable Master */}

          {/* Holiday Calendar Master  */}
          <Route
            exact
            path={"/HolidayCalenderMaster"}
            element={
              <Navigate replace to="/HolidayCalenderMaster/HolidayCalenders" />
            }
          />
          {["/HolidayCalenderMaster/HolidayCalenders"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <HolidayCalenderMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/HolidayCalenderMaster/HolidayCalenders/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HolidayCalenderForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HolidayCalenderMaster/HolidayCalenders/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HolidayCalenderForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HolidayCalenderMaster/DeAssignDepartments/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DeAssignDepartment />
              </Suspense>
            }
          />
          {/* Section Master  */}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SectionMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/SectionMaster/Section/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SectionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Section/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SectionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Batch/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BatchForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Batch/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BatchForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/intervaltype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeIntervalTypesForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/intervaltype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeIntervalTypesForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Internal/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalCreationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/Internal/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InternalCreationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/TimeSlots/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeSlotsForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SectionMaster/TimeSlots/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TimeSlotsForm />
              </Suspense>
            }
          />

          {/* Research Profile */}
          <Route
            exact
            path="/ResearchProfileIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResearchProfileForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResearchProfileAttachmentView"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileAttachmentView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResearchProfileReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResearchProfileReport />
              </Suspense>
            }
          />
          {/* Transcript Master  */}
          <Route
            exact
            path={"/TranscriptMaster"}
            element={<Navigate replace to="/TranscriptMaster/Transcripts" />}
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <TranscriptMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/TranscriptMaster/Transcript/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TranscriptForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/Transcript/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TranscriptForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/TranscriptAssignment/Assign"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <TranscriptAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/University/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UniversityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/TranscriptMaster/University/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UniversityForm />
              </Suspense>
            }
          />
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
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentTranscriptMaster />
                </Suspense>
              }
            />
          ))}

          <Route
            exact
            path="/StudentTranscriptMaster/DocumentCollection/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentTranscriptForm />
              </Suspense>
            }
          />

          {/* Make Employee Permanent - EmployeeIndex */}
          <Route
            exact
            path="/EmployeePermanentAttachmentView"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeePermanentAttachmentView />
              </Suspense>
            }
          />

          {/* Student Master  */}
          <Route
            exact
            path="/spotAdmission"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SpotAdmissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/StudentDetailsMaster"}
            element={
              <Navigate replace to="/StudentDetailsMaster/StudentsDetails" />
            }
          />
          {[
            "/StudentDetailsMaster/StudentsDetails",
            "/StudentDetailsMaster/InactiveStudents",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentDetailsMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/StudentDetailsMaster/inactivestudents"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InactiveStudentsIndex />
              </Suspense>
            }
          />

          {/* ID Card */}
          <Route
            exact
            path="/IdCardPrint"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <IDCardPrint />
              </Suspense>
            }
          />

          <Route
            exact
            path="/StudentFeeReceipt/:receiptType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentFeeReceipt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeeReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/FeeReceiptIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceiptIndex />
              </Suspense>
            }
          />

          <Route
            exact
            path="/FeeReceiptDetails/:auid/:studentId/:feeReceipt/:financialYearId/:transactionType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceiptDetails />
              </Suspense>
            }
          />
          <Route
            exact
            path="/stdFeeReceipt/:auid/:studentId/:feeReceipt/:financialYearId/:transactionType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StudentFeeReceiptDetailsPDF />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeeReceiptDetailsPDF/:auid/:studentId/:feeReceipt/:financialYearId/:transactionType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeReceiptDetailsPDF />
              </Suspense>
            }
          />

          <Route
            exact
            path="/BulkFeeReceiptForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceipt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BulkFeeReceipt/:receiptType"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceipt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BulkFeeReceiptView/:feeReceiptId/:transactionType/:financialYearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BulkFeeReceiptView/:studentId/:feeReceiptId/:transactionType/:financialYearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BulkFeeReceiptPdf/:feeReceiptId/:transactionType/:financialYearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptPdf />
              </Suspense>
            }
          />
          <Route
            exact
            path="/BulkFeeReceiptPdf/:studentId/:feeReceiptId/:transactionType/:financialYearId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BulkFeeReceiptPdf />
              </Suspense>
            }
          />

          <Route
            exact
            path="/CancelFeeReceipt"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelFeeReceipt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/CancelFeeReceiptIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CancelFeeReceiptIndex />
              </Suspense>
            }
          />

          {/* <Route
            exact
            path="/StaffIdCardIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StaffIdCardIndex />
              </Suspense>
            }
          /> */}

          <>
            <Route
              exact
              path={"/StudentDetailsMaster"}
              element={
                <Navigate replace to="/StudentDetailsMaster/StudentsDetails" />
              }
            />
            {[
              "/StudentDetailsMaster/StudentsDetails",
              "/StudentDetailsMaster/InactiveStudents",
            ].map((path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <StudentDetailsMaster />
                  </Suspense>
                }
              />
            ))}
            <Route
              exact
              path="/StudentDetailsMaster/inactivestudents"
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InactiveStudentsIndex />
                </Suspense>
              }
            />
          </>

          <Route
            exact
            path={"/StudentIdCard"}
            element={<Navigate replace to="/StudentIdCard/Print" />}
          />
          {["/StudentIdCard/Print", "/StudentIdCard/History"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StudentIdCard />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/StaffIdCard"}
            element={<Navigate replace to="/StaffIdCard/Print" />}
          />
          {["/StaffIdCard/Print", "/StaffIdCard/History"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <StaffIdCard />
                </Suspense>
              }
            />
          ))}
          {["/StaffIdCard/Print/view"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ViewStaffIdCard />
                </Suspense>
              }
            />
          ))}
          {["/StudentIdCard/Print/view"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ViewStudentIdCard />
                </Suspense>
              }
            />
          ))}

          {/* Restrict Window  */}
          <Route
            exact
            path={"/RestrictWindow"}
            element={<Navigate replace to="/RestrictWindow/paysliplock" />}
          />
          {["/RestrictWindow/paysliplock", "/RestrictWindow/salary"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <RestrictWindowMaster />
                  </Suspense>
                }
              />
            )
          )}

          <Route
            exact
            path="/restrictwindow/paysliplock/create"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaysliplockCreate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/restrictwindow/paysliplock/edit/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaysliplockEdit />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryLockForm/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryLockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryLockForm/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryLockForm />
              </Suspense>
            }
          />
          {/* Vacation Leave */}
          <Route
            exact
            path="/VacationLeaveIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VacationLeaveIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/VacationLeaveForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VacationLeaveForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PaidAcerpAmountIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAcerpAmountIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PaidAcerpAmountForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PaidAcerpAmountForm />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default RouteConfig;
