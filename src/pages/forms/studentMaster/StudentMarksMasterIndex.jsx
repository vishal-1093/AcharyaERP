import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import StudentMarksIndex from "./StudentMarksIndex";
import StudentMarks from "./StudentMarks";

function StudentMarksMaster() {
  const [tab, setTab] = useState("ExamMarks");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase().includes("/exam")) setTab("Exam");
    if (pathname.toLowerCase().includes("/report")) setTab("Report");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/stdmarks/" + newValue);
  };


  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Exam" label="Exam Marks" />
        <Tab value="Report" label="Report"/>
      </Tabs>
      {tab === "Exam" && <StudentMarks />}
      {tab === "Report" && <StudentMarksIndex />}
    </>
  );
}

export default StudentMarksMaster;
