import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import DesignationIndex from "../../containers/indeces/DesignationMaster/DesignationIndex";

function DesignationMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "DesignationMaster" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="" />
      </Tabs>

      {tab === 0 && <DesignationIndex />}
    </>
  );
}

export default DesignationMaster;
