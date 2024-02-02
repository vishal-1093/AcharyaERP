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
        </Route>
      </Routes>
    </Router>
  );
}

export default RouteConfig;
