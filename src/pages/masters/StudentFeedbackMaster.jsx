import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFeedbackIndex from "../../containers/indeces/studentFeedbackMaster/StudentFeedbackIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function StudentFeedbackMaster() {
  const [tab, setTab] = useState("Questions");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Student Feedback" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/questions")) setTab("Questions");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentFeedbackMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Questions" label="" />
      </Tabs>
      {tab === "Questions" && <StudentFeedbackIndex />}
    </>
  );
}

export default StudentFeedbackMaster;
