import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import LeaveTypeIndex from "../../containers/indeces/LeaveMaster/LeaveTypeIndex";

function LeaveMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "Leave Master" }]), []);

  return (
    <>
      <Tab value={0} />

      {tab === 0 && <LeaveTypeIndex />}
    </>
  );
}

export default LeaveMaster;
