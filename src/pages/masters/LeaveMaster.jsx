import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import LeaveTypeIndex from "../../containers/indeces/LeaveMaster/LeaveTypeIndex";

function LeaveMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "Leave Master" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Leave Type" />
      </Tabs>

      {tab === 0 && <LeaveTypeIndex />}
    </>
  );
}

export default LeaveMaster;
