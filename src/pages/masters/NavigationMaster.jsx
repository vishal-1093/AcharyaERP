import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import ModuleIndex from "../../containers/indeces/navigationMaster/ModuleIndex";
import MenuIndex from "../../containers/indeces/navigationMaster/MenuIndex";
import SubmenuIndex from "../../containers/indeces/navigationMaster/SubmenuIndex";
import RoleIndex from "../../containers/indeces/navigationMaster/RoleIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function NavigationMaster() {
  const [tab, setTab] = useState("Module");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Navigation Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/module")) setTab("Module");
    else if (pathname.toLowerCase().includes("/menu")) setTab("Menu");
    else if (pathname.toLowerCase().includes("/submenu")) setTab("Submenu");
    else if (pathname.toLowerCase().includes("/role")) setTab("Role");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/NavigationMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Module" label="Module" />
        <Tab value="Menu" label="Menu" />
        <Tab value="Submenu" label="Submenu" />
        <Tab value="Role" label="Role" />
      </Tabs>

      {tab === "Module" && <ModuleIndex />}
      {tab === "Menu" && <MenuIndex />}
      {tab === "Submenu" && <SubmenuIndex />}
      {tab === "Role" && <RoleIndex />}
    </>
  );
}

export default NavigationMaster;
