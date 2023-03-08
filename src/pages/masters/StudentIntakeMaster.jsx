import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentIntakeIndex from "../../containers/indeces/studentIntake/StudentIntakeIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

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
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentIntakeMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Studentintake" label="Student Intake" />
      </Tabs>
      {tab === "Studentintake" && <StudentIntakeIndex />}
    </>
  );
}

export default StudentIntakeMaster;
