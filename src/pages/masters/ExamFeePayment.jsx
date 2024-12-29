import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentExamFee from "../forms/StudentPaymentMaster/StudentExamFee";
import StudentMiscFee from "../forms/StudentPaymentMaster/StudentMiscFee";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function StudentPaymentMaster() {
  const [tab, setTab] = useState("Fee");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Fee Payment" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/exam")) setTab("Exam");
    else if (pathname.toLowerCase().includes("/miscellanous"))
      setTab("Miscellanous");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/Feepayment/" + newValue);
  };

  return (
    <>
      <Tabs
        value={tab}
        onChange={handleChange}
        scrollable
        scrollButtons="auto"
        sx={{
          "& .MuiTabs-flexContainer": {
            display: "flex",
            flexWrap: "nowrap", // Prevent wrapping of tabs
            overflowX: "auto", // Allow horizontal scrolling
            WebkitOverflowScrolling: "touch", // Smooth scrolling for iOS
          },
          "& .MuiTab-root": {
            whiteSpace: "nowrap", // Prevent tab text from wrapping
          },
          "@media (max-width: 768px)": {
            "& .MuiTabs-flexContainer": {
              flex: 1, // Ensure it fills available width
            },
          },
        }}
        style={{ marginTop: 20 }}
      >
        <Tab value="Exam" label="Exam" />
        <Tab value="Miscellanous" label="Misc" />
      </Tabs>

      {tab === "Exam" && <StudentExamFee />}
      {tab === "Miscellanous" && <StudentMiscFee />}
    </>
  );
}

export default StudentPaymentMaster;
