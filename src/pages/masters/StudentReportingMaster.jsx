import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentReportingForm from "../forms/studentReportingMaster/ReportingForm";
import StudentPromoteForm from "../forms/studentReportingMaster/StudentPromoteForm";
import StudentHistory from "../forms/studentReportingMaster/StudentHistory";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function ReportMaster() {
  const [tab, setTab] = useState("Report");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Report Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/report")) setTab("Reporting");
    if (pathname.toLowerCase().includes("/eligible")) setTab("Eligible");
    else if (pathname.toLowerCase().includes("/promote")) setTab("Promote");
    else if (pathname.toLowerCase().includes("/history")) setTab("History");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/ReportMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Reporting" label="Student Report" />
        {/* <Tab value="Eligible" label="Student Eligible" /> */}
        <Tab value="Promote" label="Student Promote" />
        <Tab value="History" label="Student History" />
      </Tabs>
      {tab === "Reporting" && <StudentReportingForm />}
      {/* {tab === "Eligible" && <StudentEligibleForm />} */}
      {tab === "Promote" && <StudentPromoteForm />}
      {tab === "History" && <StudentHistory />}
    </>
  );
}

export default ReportMaster;
