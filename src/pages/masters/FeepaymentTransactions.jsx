import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentTranscriptDetails from "../forms/StudentPaymentMaster/StudentRazorPayTransaction";
import StudentPaymentReceipt from "../forms/StudentPaymentMaster/StudentPaymentReceipt";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function StudentPaymentMaster() {
  const [tab, setTab] = useState("Receipt");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Fee Payment" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/receipt")) setTab("Receipt");
    else if (pathname.toLowerCase().includes("/transaction"))
      setTab("Transaction");
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
        <Tab value="Receipt" label="Receipt" />
        <Tab value="Transaction" label="Transaction" />
      </Tabs>
      {tab === "Receipt" && <StudentPaymentReceipt />}
      {tab === "Transaction" && <StudentTranscriptDetails />}
    </>
  );
}

export default StudentPaymentMaster;
