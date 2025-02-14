import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ProctorStudentHistory from "../../containers/indeces/mentorMaster/ProctorStudentHistory";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import ProctorStudentAssignmentIndexInst from "../../containers/indeces/mentorMaster/ProctorStudentAssignmentIndexInst";

function MentorMasterSchool() {
  const [tab, setTab] = useState("Inst");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Mentor Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/inst")) setTab("Inst");
    if (pathname.toLowerCase().includes("/history")) setTab("History");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate(`/MentorMaster/Inst`);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Inst" label="Mentor Assignment" />
        <Tab value="History" label="History" />
      </Tabs>
      {tab === "Inst" && <ProctorStudentAssignmentIndexInst />}
      {tab === "History" && <ProctorStudentHistory />}
    </>
  );
}

export default MentorMasterSchool;
