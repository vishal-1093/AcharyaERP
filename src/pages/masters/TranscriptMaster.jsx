import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";

import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import TranscriptIndex from "../../containers/indeces/Transcript Master/TranscriptIndex";
import TranscriptProgramIndex from "../../containers/indeces/Transcript Master/TranscriptProgramIndex";

function TranscriptMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "TranscriptMaster" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Transcript" />
        <Tab value={1} label="Transcript Assignment" />
      </Tabs>

      {tab === 0 && <TranscriptIndex />}
      {tab === 1 && <TranscriptProgramIndex />}
    </>
  );
}

export default TranscriptMaster;
