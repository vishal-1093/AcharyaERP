import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFee from "../forms/StudentPaymentMaster/StudentFee";
import StudentHostelPayment from "../forms/StudentPaymentMaster/StudentHostelPayment";
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
    else if (pathname.toLowerCase().includes("/hostel")) setTab("Hostel");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentPaymentMaster/" + newValue);
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
        <Tab value="College" label="College" />
        {/* <Tab value="Hostel" label="Hostel" /> */}
      </Tabs>
      {tab === "College" && <StudentFee />}
      {/* {tab === "Hostel" && <StudentHostelPayment />} */}
    </>
  );
}

export default StudentPaymentMaster;
