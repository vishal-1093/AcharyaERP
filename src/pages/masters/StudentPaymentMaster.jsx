import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFee from "../forms/StudentPaymentMaster/StudentFee";
import StudentExamFee from "../forms/StudentPaymentMaster/StudentExamFee";
import StudentPromoteForm from "../forms/studentReportingMaster/StudentPromoteForm";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function StudentPaymentMaster() {
  const [tab, setTab] = useState("Fee");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Fee Payment" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/college")) setTab("College");
    if (pathname.toLowerCase().includes("/misc")) setTab("Misc");
    else if (pathname.toLowerCase().includes("/exam")) setTab("Exam");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentPaymentMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="College" label="College" />
        <Tab value="Misc" label="Misc" />
        <Tab value="Exam" label="Exam" />
        <Tab value="Uniform" label="Uniform" />
      </Tabs>
      {tab === "College" && <StudentFee />}
      {tab === "Misc" && <StudentPromoteForm />}
      {tab === "Exam" && <StudentExamFee />}
      {tab === "Uniform" && <StudentExamFee />}
    </>
  );
}

export default StudentPaymentMaster;
