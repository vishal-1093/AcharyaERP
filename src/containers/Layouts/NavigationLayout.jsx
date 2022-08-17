import CustomBreadcrumbs from "../../components/CustomBreadcrumbs";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";

function NavigationLayout() {
  return (
    <>
      <Header />
      <CustomBreadcrumbs />
      <Outlet />
    </>
  );
}

export default NavigationLayout;
