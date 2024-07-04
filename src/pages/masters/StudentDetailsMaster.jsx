import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentDetailsIndex from "../../containers/indeces/studentDetailMaster/StudentDetailsIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import InactiveStudentsIndex from "../../containers/indeces/studentDetailMaster/InactiveStudentIndex";

function StudentDetailsMaster() {
  const [tab, setTab] = useState("StudentsDetails");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Student Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/studentsdetails"))
      setTab("StudentsDetails");
    if (pathname.toLowerCase().includes("/inactivestudents"))
      setTab("InactiveStudents");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentDetailsMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="StudentsDetails" label="Student Details" />
        <Tab value="InactiveStudents" label="InActive" />
      </Tabs>
      {tab === "StudentsDetails" && <StudentDetailsIndex />}
      {tab === "InactiveStudents" && <InactiveStudentsIndex />}
    </>
  );
}

export default StudentDetailsMaster;
