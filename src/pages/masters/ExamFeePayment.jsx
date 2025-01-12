import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentExamFee from "../forms/StudentPaymentMaster/StudentExamFee";
import StudentMiscFee from "../forms/StudentPaymentMaster/StudentMiscFee";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function StudentPaymentMaster() {
  const [tab, setTab] = useState("Miscellanous");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Fee Payment" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/miscellanous"))
      setTab("Miscellanous");
    else if (pathname.toLowerCase().includes("/exam")) setTab("Exam");
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
        <Tab value="Miscellanous" label="Misc" />
        <Tab value="Exam" label="Exam" />
      </Tabs>
      {tab === "Miscellanous" && <StudentMiscFee />}
      {tab === "Exam" && <StudentExamFee />}
    </>
  );
}

export default StudentPaymentMaster;
