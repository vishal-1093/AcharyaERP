import { useNavigate } from "react-router-dom";

const useRoleBasedNavigation = () => {
  const navigate = useNavigate();
  const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

  const handleNavigation = () => {
    if (roleId) {
      switch (roleId) {
        case 3:
          navigate("/employee-dashboard", { replace: true });
          break;
        case 4:
          navigate("/hod-dashboard", { replace: true });
          break;
        case 16:
          navigate("/principal-dashboard", { replace: true });
          break;
        case 18:
          navigate("/employee-dashboard", { replace: true });
          break;
        default:
          navigate("/Dashboard", { replace: true });
      }
    } else {
      navigate("/Login");
    }
  };

  return handleNavigation;
};

export default useRoleBasedNavigation;
