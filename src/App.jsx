import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ThemeContext from "./utils/ThemeContext";
import NavigationLayout from "./containers/Layouts/NavigationLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FormExample from "./containers/examples/FormExample";

function App() {
  return (
    <ThemeContext>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/login" />} />
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
          <Route exact path="/ResetPassword" element={<ResetPassword />} />
          <Route element={<NavigationLayout />}>
            <Route exact path="/FormExample" element={<FormExample />} />
            {/* add your routes here */}
          </Route>
        </Routes>
      </Router>
    </ThemeContext>
  );
}

export default App;
