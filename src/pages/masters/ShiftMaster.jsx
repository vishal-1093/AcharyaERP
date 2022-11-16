import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ShiftIndex from "../../containers/indeces/ShiftMaster/ShiftIndex";

function ShiftMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "ShiftMaster" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Shift" />
      </Tabs>

      {tab === 0 && <ShiftIndex />}
    </>
  );
}

export default ShiftMaster;
