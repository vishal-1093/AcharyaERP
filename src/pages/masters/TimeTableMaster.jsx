import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SectionAssignmentIndex from "../../containers/indeces/timeTableMaster/SectionAssignmentIndex";
import TimetableForSectionIndex from "../../containers/indeces/timeTableMaster/TimetableForSectionIndex";
import CourseAssignmentIndex from "../../containers/indeces/timeTableMaster/CourseAssignmentIndex";
import BatchAssignmentIndex from "../../containers/indeces/timeTableMaster/BatchAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function TimeTableMaster() {
  const [tab, setTab] = useState("Course");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Time Table Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/course")) setTab("Course");
    else if (pathname.toLowerCase().includes("/section")) setTab("Section");
    else if (pathname.toLowerCase().includes("/timetable")) setTab("Timetable");
    if (pathname.toLowerCase().includes("/batchassignment"))
      setTab("Batchassignment");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/TimeTableMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
      <Tab value="Timetable" label="Time Table" />
        <Tab value="Section" label="Section" />{" "}
        <Tab value="Batchassignment" label="Batch" />
        <Tab value="Course" label="Course" />
      </Tabs>
      {tab === "Timetable" && <TimetableForSectionIndex />}
      {tab === "Section" && <SectionAssignmentIndex />}
      {tab === "Batchassignment" && <BatchAssignmentIndex />}
      {tab === "Course" && <CourseAssignmentIndex />}
    </>
  );
}

export default TimeTableMaster;
