import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import CourseIndex from "../../containers/indeces/courseMaster/CourseIndex";
import CourseTypeIndex from "../../containers/indeces/courseMaster/CourseTypeIndex";
import CoursePatternIndex from "../../containers/indeces/courseMaster/CoursePatternIndex";
import CourseCategoryIndex from "../../containers/indeces/courseMaster/CourseCategoryIndex";
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
    if (pathname.toLowerCase().includes("/type")) setTab("Type");
    if (pathname.toLowerCase().includes("/pattern")) setTab("Pattern");
    if (pathname.toLowerCase().includes("/category")) setTab("Category");
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
        <Tab value="Pattern" label="Course Pattern" />
      </Tabs>
      {tab === "Course" && <CourseIndex />}
      {tab === "Type" && <CourseTypeIndex />}
      {tab === "Category" && <CourseCategoryIndex />}
      {tab === "Pattern" && <CoursePatternIndex />}
    </>
  );
}

export default CourseMaster;
