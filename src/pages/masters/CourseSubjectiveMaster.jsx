import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import CourseObjectiveIndex from "../../containers/indeces/CourseMaster/CourseObjectiveIndex";
import CourseOutcomeIndex from "../../containers/indeces/CourseMaster/CourseOutcomeIndex";
import SyllabusIndex from "../../containers/indeces/academicMaster/SyllabusIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";

function CourseSubjectiveMaster() {
  const [tab, setTab] = useState("Objective");
  const setCrumbs = useBreadcrumbs();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(
    () => setCrumbs([{ name: "Course Subjective Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/objective")) setTab("Objective");
    if (pathname.toLowerCase().includes("/outcome")) setTab("Outcome");
    if (pathname.toLowerCase().includes("/syllabus")) setTab("Syllabus");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CourseSubjectiveMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Objective" label="Course Objective" />
        <Tab value="Outcome" label="Course Outcome" />
        <Tab value="Syllabus" label="Syllabus" />
      </Tabs>
      {tab === "Objective" && <CourseObjectiveIndex />}
      {tab === "Outcome" && <CourseOutcomeIndex />}
      {tab === "Syllabus" && <SyllabusIndex />}
    </>
  );
}

export default CourseSubjectiveMaster;
