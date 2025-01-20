import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentProctorIndex from "../../containers/indeces/mentorMaster/StudentProctorIndex";
import StudentProctorHistoryIndex from "../../containers/indeces/mentorMaster/StudentProctorHistoryIndex";
import ProctorStudentMeetingIndex from "../../containers/indeces/mentorMaster/ProctorStudentMeetingIndex";
import ProctorStudentReport from "../forms/mentorMaster/ProctorStudentReport";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function ProctorStudentMaster() {
  const [tab, setTab] = useState("Proctor");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // useEffect(
  //   () => setCrumbs([{ name: "Proctor Master" }, { name: tab }]),
  //   [tab]
  // );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/proctor")) setTab("Proctor");
    // if (pathname.toLowerCase().includes("/history")) setTab("History");
    if (pathname.toLowerCase().includes("/meeting")) setTab("Meeting");
    // if (pathname.toLowerCase().includes("/report")) setTab("Report");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/ProctorStudentMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Proctor" label="My Mentee" />
        {/* <Tab value="History" label="History" /> */}
        <Tab value="Meeting" label="Meeting" />
        {/* <Tab value="Report" label="Academic Report" /> */}
      </Tabs>
      {tab === "Proctor" && <StudentProctorIndex />}
      {/* {tab === "History" && <StudentProctorHistoryIndex />} */}
      {tab === "Meeting" && <ProctorStudentMeetingIndex />}
      {/* {tab === "Report" && <ProctorStudentReport />} */}
    </>
  );
}

export default ProctorStudentMaster;
