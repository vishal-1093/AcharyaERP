import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import CourseIndex from "../../containers/indeces/CourseMaster/CourseIndex";
import CourseassignmentIndex from "../../containers/indeces/CourseMaster/CourseassignmentIndex";
import CoursePatternIndex from "../../containers/indeces/CourseMaster/CoursePatternIndex";
import CourseTypeIndex from "../../containers/indeces/CourseMaster/CourseTypeIndex";
import CourseCategoryIndex from "../../containers/indeces/CourseMaster/CourseCategoryIndex";
import CourseStudentAssignmentIndex from "../../containers/indeces/CourseMaster/CourseStudentAssignmentIndex";
import CourseObjectiveIndex from "../../containers/indeces/CourseMaster/CourseObjectiveIndex";

import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";

function CourseMaster() {
  const [tab, setTab] = useState("Course");
  const setCrumbs = useBreadcrumbs();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setCrumbs([{ name: "CourseMaster" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/course")) setTab("Course");
    if (pathname.toLowerCase().includes("/bucket")) setTab("Bucket");
    if (pathname.toLowerCase().includes("/type")) setTab("Type");
    if (pathname.toLowerCase().includes("/assignment")) setTab("Assignment");
    if (pathname.toLowerCase().includes("/category")) setTab("Category");
    if (pathname.toLowerCase().includes("/student")) setTab("Student");
    if (pathname.toLowerCase().includes("/courseobjectives"))
      setTab("CourseObjectives");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CourseMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Course" label="Course" />
        <Tab value="Type" label="Course Type" />
        <Tab value="Category" label="Course Category" />
        <Tab value="Assignment" label="Course Assign" />
        <Tab value="Bucket" label="Course Bucket" />
        <Tab value="Student" label="Course Mapping" />
        <Tab value="CourseObjectives" label="Course Objective" />
      </Tabs>
      {tab === "Course" && <CourseIndex />}
      {tab === "Type" && <CourseTypeIndex />}
      {tab === "Category" && <CourseCategoryIndex />}
      {tab === "Assignment" && <CourseassignmentIndex />}
      {tab === "Bucket" && <CoursePatternIndex />}
      {tab === "Student" && <CourseStudentAssignmentIndex />}
      {tab === "CourseObjectives" && <CourseObjectiveIndex />}
    </>
  );
}

export default CourseMaster;
