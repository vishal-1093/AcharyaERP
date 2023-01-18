import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SectionIndex from "../../containers/indeces/SectionMaster/SectionIndex";
import BatchIndex from "../../containers/indeces/SectionMaster/BatchIndex";
import SectionAssignmentIndex from "../../containers/indeces/SectionMaster/SectionAssignmentIndex";
import TimeSlotsIndex from "../../containers/indeces/SectionMaster/TimeSlotsIndex";
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
    else if (pathname.toLowerCase().includes("/assign")) setTab("Assign");
    else if (pathname.toLowerCase().includes("/timeslot")) setTab("TimeSlot");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/SectionMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Sections" label="Section" />
        <Tab value="Batches" label="Batch" />
        <Tab value="Assign" label="Section Assignment" />
        <Tab value="TimeSlot" label="Time Slots" />
      </Tabs>
      {tab === "Sections" && <SectionIndex />}
      {tab === "Batches" && <BatchIndex />}
      {tab === "Assign" && <SectionAssignmentIndex />}

      {tab === "TimeSlot" && <TimeSlotsIndex />}
    </>
  );
}

export default SectionMaster;
