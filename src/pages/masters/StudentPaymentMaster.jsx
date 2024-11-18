import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFee from "../forms/StudentPaymentMaster/StudentFee";
import StudentExamFee from "../forms/StudentPaymentMaster/StudentExamFee";
import StudentMiscFee from "../forms/StudentPaymentMaster/StudentMiscFee";
import StudentUniformFee from "../forms/StudentPaymentMaster/StudentUniformFee";
import StudentTranscriptDetails from "../forms/StudentPaymentMaster/StudentRazorPayTransaction";
import StudentPaymentReceipt from "../forms/StudentPaymentMaster/StudentPaymentReceipt";
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
    if (pathname.toLowerCase().includes("/miscellanous"))
      setTab("Miscellanous");
    else if (pathname.toLowerCase().includes("/exam")) setTab("Exam");
    else if (pathname.toLowerCase().includes("/uniform")) setTab("Uniform");
    else if (pathname.toLowerCase().includes("/transaction"))
      setTab("Transaction");
    else if (pathname.toLowerCase().includes("/receipt")) setTab("Receipt");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentPaymentMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="College" label="College" />
        <Tab value="Miscellanous" label="Misc" />
        <Tab value="Exam" label="Exam" />
        <Tab value="Uniform" label="Uniform" />
        <Tab value="Transaction" label="Transaction" />
        <Tab value="Receipt" label="Receipt" />
      </Tabs>
      {tab === "College" && <StudentFee />}
      {tab === "Miscellanous" && <StudentMiscFee />}
      {tab === "Exam" && <StudentExamFee />}
      {tab === "Uniform" && <StudentUniformFee />}
      {tab === "Transaction" && <StudentTranscriptDetails />}
      {tab === "Receipt" && <StudentPaymentReceipt />}
    </>
  );
}

export default StudentPaymentMaster;
