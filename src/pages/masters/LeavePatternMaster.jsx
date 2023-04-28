import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import LeavePatternIndex from "../../containers/indeces/leavePatternMaster/LeavePatternIndex";
import ViewReport from "../forms/leavePatternMaster/ViewReport";
import LeavePatternCopy from "../forms/leavePatternMaster/LeavePatternCopy";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function LeavePatternMaster() {
  const [tab, setTab] = useState("LeavePatterns");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "LeavePattern Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/leavepatterns"))
      setTab("LeavePatterns");
    else if (pathname.toLowerCase().includes("/viewreports"))
      setTab("ViewReports");
    else if (pathname.toLowerCase().includes("/copypattern"))
      setTab("CopyPattern");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/LeavePatternMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="LeavePatterns" label="LeavePatterns" />
        <Tab value="ViewReports" label="Grid View" />
        <Tab value="CopyPattern" label="Copy Pattern" />
      </Tabs>
      {tab === "LeavePatterns" && <LeavePatternIndex />}
      {tab === "ViewReports" && <ViewReport />}
      {tab === "CopyPattern" && <LeavePatternCopy />}
    </>
  );
}

export default LeavePatternMaster;
