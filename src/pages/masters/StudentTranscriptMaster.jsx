import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import StudentTranscriptIndex from "../../containers/indeces/studentTranscriptsMaster/StudentTranscriptIndex";

function StudentTranscriptMaster() {
  const [tab, setTab] = useState("StudentsTranscripts");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Student Details" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/studentstranscripts"))
      setTab("StudentsTranscripts");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentTranscriptMaster/" + newValue);
  };

  return (
    <>
      {/* <Tabs value={tab} onChange={handleChange}> */}
      <Tab value="StudentsTranscripts" label="" />
      {/* </Tabs> */}
      {tab === "StudentsTranscripts" && <StudentTranscriptIndex />}
    </>
  );
}

export default StudentTranscriptMaster;
