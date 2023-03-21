import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import StudentIntakeIndex from "../../containers/indeces/studentIntake/StudentIntakeIndex";
import StudentIntakeSummary from "../forms/studentIntake/StudentIntakeSummary";
import StudentIntakeGrid from "../forms/studentIntake/StudentIntakeGrid";

function StudentIntakeMaster() {
  const [tab, setTab] = useState("Studentintake");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Student Intake Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/studentintake"))
      setTab("Studentintake");
    if (pathname.toLowerCase().includes("/summary")) setTab("Summary");
    if (pathname.toLowerCase().includes("/grid")) setTab("Grid");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentIntakeMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Studentintake" label="Student Intake" />
        <Tab value="Summary" label="Summary" />
        <Tab value="Grid" label="Grid View" />
      </Tabs>
      {tab === "Studentintake" && <StudentIntakeIndex />}
      {tab === "Summary" && <StudentIntakeSummary />}
      {tab === "Grid" && <StudentIntakeGrid />}
    </>
  );
}

export default StudentIntakeMaster;
