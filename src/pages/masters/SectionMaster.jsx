import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SectionIndex from "../../containers/indeces/SectionMaster/SectionIndex";
import BatchIndex from "../../containers/indeces/SectionMaster/BatchIndex";
import TimeIntervalTypesIndex from "../../containers/indeces/SectionMaster/TimeIntervalTypesIndex";
import CourseAssignmentIndex from "../../containers/indeces/SectionMaster/CourseAssignmentIndex";
import TimetableForSectionIndex from "../../containers/indeces/SectionMaster/TimetableForSectionIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function SectionMaster() {
  const [tab, setTab] = useState("Sections");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Section Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/sections")) setTab("Sections");
    else if (pathname.toLowerCase().includes("/batches")) setTab("Batches");
    else if (pathname.toLowerCase().includes("/intervaltypes"))
      setTab("IntervalTypes");
    else if (pathname.toLowerCase().includes("/courseassign"))
      setTab("CourseAssign");
    else if (pathname.toLowerCase().includes("/timetable")) setTab("Timetable");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/SectionMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Sections" label="Section" />
        <Tab value="Batches" label="Batch" />
        <Tab value="IntervalTypes" label="Interval Type" />
        <Tab value="CourseAssign" label="Course Assignment" />
        <Tab value="Timetable" label="Time Table" />
      </Tabs>
      {tab === "Sections" && <SectionIndex />}
      {tab === "Batches" && <BatchIndex />}
      {tab === "IntervalTypes" && <TimeIntervalTypesIndex />}
      {tab === "CourseAssign" && <CourseAssignmentIndex />}
      {tab === "Timetable" && <TimetableForSectionIndex />}
    </>
  );
}

export default SectionMaster;
