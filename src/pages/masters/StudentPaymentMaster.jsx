import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFee from "../forms/StudentPaymentMaster/StudentFee";
import StudentEligibleForm from "../forms/studentReportingMaster/StudentEligibleForm";
import StudentPromoteForm from "../forms/studentReportingMaster/StudentPromoteForm";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function StudentPaymentMaster() {
  const [tab, setTab] = useState("Fee");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Report Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/fee")) setTab("Fee");
    if (pathname.toLowerCase().includes("/bulk")) setTab("Bulk");
    else if (pathname.toLowerCase().includes("/exam")) setTab("Exam");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentPaymentMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Fee" label="Student Fee" />
        <Tab value="Bulk" label="Bulk Fee" />
        <Tab value="Exam" label="Exam Fee" />
      </Tabs>
      {tab === "Fee" && <StudentFee />}
      {tab === "Eligible" && <StudentEligibleForm />}
      {tab === "Promote" && <StudentPromoteForm />}
    </>
  );
}

export default StudentPaymentMaster;
