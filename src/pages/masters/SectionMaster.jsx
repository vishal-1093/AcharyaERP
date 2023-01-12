import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SectionIndex from "../../containers/indeces/sectionMaster/SectionIndex";
import BatchIndex from "../../containers/indeces/sectionMaster/BatchIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function SectionMaster() {
  const [tab, setTab] = useState("Sections");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Section Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/sections")) setTab("Sections");
    else if (pathname.toLowerCase().includes("/batches")) setTab("Batches");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/SectionMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Sections" label="Section" />
        <Tab value="Batches" label="Batch" />
      </Tabs>
      {tab === "Sections" && <SectionIndex />}
      {tab === "Batches" && <BatchIndex />}
    </>
  );
}

export default SectionMaster;
