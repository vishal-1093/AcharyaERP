import { useState, useEffect } from "react";
import { Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import LeaveTypeIndex from "../../containers/indeces/LeaveMaster/LeaveTypeIndex";
import { useNavigate, useLocation } from "react-router-dom";

function LeaveMaster() {
  const [tab, setTab] = useState("LeaveTypes");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase().includes("/leavetypes")) setTab("LeaveTypes");
  }, [pathname]);

  useEffect(() => setCrumbs([{ name: "Leave Master" }]));

  return (
    <>
      <Tab value={tab} />

      {tab === "LeaveTypes" && <LeaveTypeIndex />}
    </>
  );
}

export default LeaveMaster;
