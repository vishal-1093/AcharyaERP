import { useState, useEffect, lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

const JournalGrnIndex = lazy(() => import("../indeces/JournalGrnIndex"));
const DirectDemandIndex = lazy(() => import("../indeces/DirectDemandIndex"));

function JournalMaster() {
  const [tab, setTab] = useState("Grn");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Journal Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/grn")) setTab("Grn");
    else if (pathname.toLowerCase().includes("/demand")) setTab("Demand");
    else if (pathname.toLowerCase().includes("/vendor")) setTab("Vendor");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/JournalMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Grn" label="Grn" />
        <Tab value="Demand" label="Demand" />
      </Tabs>
      {tab === "Grn" && <JournalGrnIndex />}
      {tab === "Demand" && <DirectDemandIndex />}
    </>
  );
}

export default JournalMaster;
