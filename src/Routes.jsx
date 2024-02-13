import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  MemoryRouter,
} from "react-router-dom";
import OverlayLoader from "./components/OverlayLoader";

const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NavigationLayout = lazy(() => import("./layouts/NavigationLayout"));
const SchedulerMaster = lazy(() => import("./components/SchedulerMaster.jsx"));

// Master pages
const NavigationMaster = lazy(() => import("./pages/masters/NavigationMaster"));
const InstituteMaster = lazy(() => import("./pages/masters/InstituteMaster"));

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

// Candidate Walkin
const CandidateWalkinForm = lazy(() =>
  import("./pages/forms/candidateWalkin/CandidateWalkinForm")
);

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

function RouteConfig() {
  const token = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.token;

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
        </Route>
      </Routes>
    </Router>
  );
}

export default RouteConfig;
