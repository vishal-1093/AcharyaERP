import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ProctorStudentAssignmentIndex from "../../containers/indeces/mentorMaster/ProctorStudentAssignmentIndex";
import ProctorStudentHistory from "../../containers/indeces/mentorMaster/ProctorStudentHistory";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function MentorMaster() {
  const [tab, setTab] = useState("Mentor");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Mentor Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/mentor")) setTab("Mentor");
    if (pathname.toLowerCase().includes("/history")) setTab("History");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    if (pathname.toLowerCase() === "/mentormaster/history-head" && newValue === "Mentor") {
      navigate("/MentorMaster/Mentor-head");
    } else if (pathname.toLowerCase() === "/mentormaster/mentor-head" && newValue === "History") {
      navigate("/MentorMaster/history-head");
    } else {
      navigate("/MentorMaster/" + newValue);
    }
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Mentor" label="Mentor Assignment" />
        <Tab value="History" label="History" />
      </Tabs>
      {tab === "Mentor" && <ProctorStudentAssignmentIndex />}
      {tab === "History" && <ProctorStudentHistory />}
    </>
  );
}

export default MentorMaster;
