import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import FacultytimetableSchoolIndex from "../../containers/indeces/timeTableMaster/FacultytimetableSchoolIndex";
import FacultySectionAssignmentIndex from "../forms/FacultyScreens/FacultySectionAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function FacultyMaster() {
  const [tab, setTab] = useState("Timetable");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Faculty Master School" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/timetable")) setTab("Timetable");
    if (pathname.toLowerCase().includes("/section")) setTab("Section");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/FacultyMaster/School/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Timetable" label="Timetable" />
        <Tab value="Section" label="Section" />
      </Tabs>
      {tab === "Timetable" && <FacultytimetableSchoolIndex />}
      {tab === "Section" && <FacultySectionAssignmentIndex />}
    </>
  );
}

export default FacultyMaster;
