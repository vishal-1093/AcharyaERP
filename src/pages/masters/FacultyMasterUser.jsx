import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import FacultytimetableUserwiseIndex from "../../containers/indeces/timeTableMaster/FacultytimetableUserwiseIndex";
import FacultySectionAssignmentIndex from "../forms/FacultyScreens/FacultySectionAssignmentIndex";
import FacultyBatchAssignmentIndex from "../forms/FacultyScreens/FacultyBatchAssignmentIndex";
import FacultySubjectAssignmentIndex from "../forms/FacultyScreens/FacultySubjectAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function FacultyMasterUser() {
  const [tab, setTab] = useState("Timetable");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Faculty Master User" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/timetable")) setTab("Timetable");
    if (pathname.toLowerCase().includes("/section")) setTab("Section");
    if (pathname.toLowerCase().includes("/batch")) setTab("Batch");
    if (pathname.toLowerCase().includes("/subject")) setTab("Subject");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/FacultyMaster/User/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Timetable" label="Timetable" />
        <Tab value="Section" label="Section" />
        <Tab value="Batch" label="Batch" />
        <Tab value="Subject" label="Subject Assignment" />
      </Tabs>
      {tab === "Timetable" && <FacultytimetableUserwiseIndex />}
      {tab === "Section" && <FacultySectionAssignmentIndex />}
      {tab === "Batch" && <FacultyBatchAssignmentIndex />}
      {tab === "Subject" && <FacultySubjectAssignmentIndex />}
    </>
  );
}

export default FacultyMasterUser;
