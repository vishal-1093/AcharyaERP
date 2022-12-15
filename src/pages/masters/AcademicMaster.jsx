import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import DepartmentIndex from "../../containers/indeces/academicMaster/DepartmentIndex";
import DepartmentAssignmentIndex from "../../containers/indeces/academicMaster/DepartmentAssignmentIndex";
import ProgramIndex from "../../containers/indeces/academicMaster/ProgramIndex";
import ProgramAssIndex from "../../containers/indeces/academicMaster/ProgramAssIndex";
import ProgramSpecializationIndex from "../../containers/indeces/academicMaster/ProgramSpecializationIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";

function AcademicMaster() {
  const [tab, setTab] = useState("Department");
  const setCrumbs = useBreadcrumbs();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(
    () => setCrumbs([{ name: "AcademicMaster" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/department")) setTab("Department");
    else if (pathname.toLowerCase().includes("/assignment"))
      setTab("Assignment");
    else if (pathname.toLowerCase().includes("/program")) setTab("Program");
    else if (pathname.toLowerCase().includes("/assign")) setTab("Assign");
    else if (pathname.toLowerCase().includes("/specialization"))
      setTab("Specialization");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/AcademicMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Department" label="Department" />
        <Tab value="Assignment" label="Dept Assign" />
        <Tab value="Program" label="Program" />
        <Tab value="Assign" label="Prog Assign" />
        <Tab value="Specialization" label="Specialization" />
      </Tabs>
      {tab === "Department" && <DepartmentIndex />}
      {tab === "Assignment" && <DepartmentAssignmentIndex />}
      {tab === "Program" && <ProgramIndex />}
      {tab === "Assign" && <ProgramAssIndex />}
      {tab === "Specialization" && <ProgramSpecializationIndex />}
    </>
  );
}

export default AcademicMaster;
