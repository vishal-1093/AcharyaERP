import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ProctorheadIndex from "../../containers/indeces/mentorMaster/ProctorheadIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function MentorMaster() {
  const [tab, setTab] = useState("Mentor");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Mentor Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/mentor")) setTab("Mentor");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/MentorMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Mentor" label="Mentor Head" />
      </Tabs>
      {tab === "Mentor" && <ProctorheadIndex />}
    </>
  );
}

export default MentorMaster;
