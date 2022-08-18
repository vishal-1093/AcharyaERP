import { Outlet } from "react-router-dom";
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs";
// import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

function NavigationLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* <Header /> */}
      <div style={{ width: 87 }}>
        <Sidebar />
      </div>
      <div style={{ padding: "87px 41px 41px 0" }}>
        <CustomBreadcrumbs />
        <Outlet />
      </div>
    </div>
  );
}

export default NavigationLayout;
