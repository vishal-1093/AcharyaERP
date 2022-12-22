import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import CourseIndex from "../../containers/indeces/CourseMaster/CourseIndex";
import CourseassignmentIndex from "../../containers/indeces/CourseMaster/CourseassignmentIndex";
import CoursePatternIndex from "../../containers/indeces/CourseMaster/CoursePatternIndex";

import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";

function CourseMaster() {
  const [tab, setTab] = useState("Course");
  const setCrumbs = useBreadcrumbs();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setCrumbs([{ name: "CourseMaster" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/assignment")) setTab("Assignment");
    else if (pathname.toLowerCase().includes("/course")) setTab("Course");
    if (pathname.toLowerCase().includes("/pattern")) setTab("Pattern");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CourseMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Course" label="Course" />
        <Tab value="Assignment" label="Course Assign" />
        <Tab value="Pattern" label="Course Pattern" />
      </Tabs>
      {tab === "Course" && <CourseIndex />}
      {tab === "Assignment" && <CourseassignmentIndex />}
      {tab === "Pattern" && <CoursePatternIndex />}
    </>
  );
}

export default CourseMaster;
