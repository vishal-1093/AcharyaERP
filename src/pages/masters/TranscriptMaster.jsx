import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import TranscriptIndex from "../../containers/indeces/transcriptMaster/TranscriptIndex";
import TranscriptProgramIndex from "../../containers/indeces/transcriptMaster/TranscriptProgramIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function TranscriptMaster() {
  const [tab, setTab] = useState("Transcript");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Transcript Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/assignment")) setTab("Assignment");
    else if (pathname.toLowerCase().includes("/transcript"))
      setTab("Transcript");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/TranscriptMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Transcript" label="Transcript" />
        <Tab value="Assignment" label="Assignment" />
      </Tabs>
      {tab === "Transcript" && <TranscriptIndex />}
      {tab === "Assignment" && <TranscriptProgramIndex />}
    </>
  );
}

export default TranscriptMaster;
