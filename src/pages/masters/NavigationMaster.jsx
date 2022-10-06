import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ModuleIndex from "../../containers/indeces/ModuleIndex";
import MenuIndex from "../../containers/indeces/MenuIndex";
import SubmenuIndex from "../../containers/indeces/SubmenuIndex";
import RoleIndex from "../../containers/indeces/RoleIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function NavigationMaster() {
  const [tab, setTab] = useState(2);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "NavigationMaster" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Module" />
        <Tab value={1} label="Menu" />
        <Tab value={2} label="Submenu" />
        <Tab value={3} label="Role" />
      </Tabs>

      {tab === 0 && <ModuleIndex />}
      {tab === 1 && <MenuIndex />}
      {tab === 2 && <SubmenuIndex />}
      {tab === 3 && <RoleIndex />}
    </>
  );
}

export default NavigationMaster;
