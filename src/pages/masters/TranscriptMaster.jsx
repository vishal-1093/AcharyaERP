import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import TranscriptIndex from "../../containers/indeces/transcriptMaster/TranscriptIndex";
import TranscriptProgramIndex from "../../containers/indeces/transcriptMaster/TranscriptProgramIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import UniversityIndex from "../../containers/indeces/transcriptMaster/UniversityIndex";

function TranscriptMaster() {
  const [tab, setTab] = useState("Transcripts");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Transcript Master" }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/assignments")) setTab("Assignments");
    else if (pathname.toLowerCase().includes("/transcripts"))
      setTab("Transcripts");
    else if (pathname.toLowerCase().includes("/universitys"))
      setTab("Universitys");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/TranscriptMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Transcripts" label="Transcript" />
        <Tab value="Assignments" label="Assignment" />
        <Tab value="Universitys" label="University" />
      </Tabs>
      {tab === "Transcripts" && <TranscriptIndex />}
      {tab === "Assignments" && <TranscriptProgramIndex />}
      {tab === "Universitys" && <UniversityIndex />}
    </>
  );
}

export default TranscriptMaster;
