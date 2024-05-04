import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import RefreshmentApproverIndex from "./RefreshmentApproverIndex";
import RefreshmentMailBox from "./RefreshmentMailBox";
import RefreshmentRequestReport from "../RefreshmentRequestReport";

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
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/RefreshmentDetails/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="RefreshmentApproverIndex" label="Indents" />
        <Tab value="RefreshmentMailBox" label="Mail Box" />
        <Tab value="ApprovedReport" label="Approved Report" />
        <Tab value="RefreshmentRequestReport" label="Cancelled Report" />
      </Tabs>
      {tab === "RefreshmentApproverIndex" && <RefreshmentApproverIndex />}
      {tab === "RefreshmentMailBox" && <RefreshmentMailBox />}
      {tab === "ApprovedReport" && <RefreshmentRequestReport />}
      {tab === "RefreshmentRequestReport" && <RefreshmentRequestReport />}
    </>
  );
}
export default RefreshmentDetailsMaster;
