import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import RefreshmentApproverIndex from "./RefreshmentApproverIndex";
import RefreshmentMailBox from "./RefreshmentMailBox";
import RefreshmentRequestReport from "../RefreshmentRequestReport";
import RefreshmentBilling from "./RefreshmentBilling";

function RefreshmentDetailsMaster() {
  const [tab, setTab] = useState("RefreshmentApprovertIndex");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase().includes("/refreshmentapproverindex"))
      setTab("RefreshmentApproverIndex");
    if (pathname.toLowerCase().includes("/refreshmentmailbox"))
      setTab("RefreshmentMailBox");
    if (pathname.toLowerCase().includes("/approvedreport"))
      setTab("ApprovedReport");
    if (pathname.toLowerCase().includes("/refreshmentrequestreport"))
      setTab("RefreshmentRequestReport");
    if (pathname.toLowerCase().includes("/billing")) setTab("Billing");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/RefreshmentDetails/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="RefreshmentApproverIndex" label="Indents" />
        <Tab value="RefreshmentMailBox" label="Mail Box" />
        <Tab value="ApprovedReport" label="Approved" />
        <Tab value="RefreshmentRequestReport" label="Cancelled" />
        <Tab value="Billing" label="Billing" />
      </Tabs>
      {tab === "RefreshmentApproverIndex" && <RefreshmentApproverIndex />}
      {tab === "RefreshmentMailBox" && <RefreshmentMailBox />}
      {tab === "ApprovedReport" && <RefreshmentRequestReport />}
      {tab === "RefreshmentRequestReport" && <RefreshmentRequestReport />}
      {tab === "Billing" && <RefreshmentBilling />}
    </>
  );
}
export default RefreshmentDetailsMaster;
