import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import FacultytimetableDeptwiseIndex from "../../containers/indeces/timeTableMaster/FacultytimetableDeptwiseIndex";
import FacultySectionAssignmentIndex from "../forms/FacultyScreens/FacultySectionAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import FacultyBatchAssignmentIndex from "../forms/FacultyScreens/FacultyBatchAssignmentIndex";

function FacultyMasterDept() {
  const [tab, setTab] = useState("Timetable");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Faculty Master Dept" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/timetable")) setTab("Timetable");
    if (pathname.toLowerCase().includes("/section")) setTab("Section");
    if (pathname.toLowerCase().includes("/batch")) setTab("Batch");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/FacultyMaster/Dept/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Timetable" label="Timetable" />
        <Tab value="Section" label="Section" />
        <Tab value="Batch" label="Batch" />
      </Tabs>
      {tab === "Timetable" && <FacultytimetableDeptwiseIndex />}
      {tab === "Section" && <FacultySectionAssignmentIndex />}
      {tab === "Batch" && <FacultyBatchAssignmentIndex />}
    </>
  );
}

export default FacultyMasterDept;
