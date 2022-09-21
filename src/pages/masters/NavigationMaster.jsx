import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ModuleIndex from "../../containers/indeces/ModuleIndex";
import MenuIndex from "../../containers/indeces/MenuIndex";
// import SubmenuIndex from "../containers/SubmenuIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function NavigationMaster() {
  const [value, setValue] = useState(1);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "NavigationMaster" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab value={0} label="Module" />
        <Tab value={1} label="Menu" />
        {/* <Tab value={2} label="Submenu" /> */}
      </Tabs>

      {value === 0 && <ModuleIndex />}
      {value === 1 && <MenuIndex />}
      {/* {value === 2 && <SubmenuIndex />} */}
    </>
  );
}

export default NavigationMaster;
