import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ApplicationIndex from "../../containers/indeces/CandidateWalkinMaster/ApplicationIndex";
import FeeExcemptionIndex from "../../containers/indeces/CandidateWalkinMaster/FeeExcemptionIndex";

function CandidateWalkinMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "CandidateWalkinMaster" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Candidate Wakin Details" />
        <Tab value={1} label="Fee Excemption" />
      </Tabs>

      {tab === 0 && <ApplicationIndex />}
      {tab === 1 && <FeeExcemptionIndex />}
    </>
  );
}

export default CandidateWalkinMaster;
