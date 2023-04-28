import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SectionIndex from "../../containers/indeces/sectionMaster/SectionIndex";
import BatchIndex from "../../containers/indeces/sectionMaster/BatchIndex";
import TimeSlotsIndex from "../../containers/indeces/timeTableMaster/TimeSlotsIndex";
import TimeIntervalTypesIndex from "../../containers/indeces/sectionMaster/TimeIntervalTypesIndex";
import InternalTypeIndex from "../../containers/indeces/academicMaster/InternalTypeIndex";
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
    else if (pathname.toLowerCase().includes("/intervaltypes"))
      setTab("IntervalTypes");
    else if (pathname.toLowerCase().includes("/internal")) setTab("Internal");
    else if (pathname.toLowerCase().includes("/timeslot")) setTab("Timeslot");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/SectionMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Sections" label="Section" />
        <Tab value="Batches" label="Batch" />
        <Tab value="IntervalTypes" label="Interval Type" />
        <Tab value="Internal" label="Internal Type" />
        <Tab value="Timeslot" label="Time Slot" />
      </Tabs>
      {tab === "Sections" && <SectionIndex />}
      {tab === "Batches" && <BatchIndex />}
      {tab === "IntervalTypes" && <TimeIntervalTypesIndex />}
      {tab === "Internal" && <InternalTypeIndex />}
      {tab === "Timeslot" && <TimeSlotsIndex />}
    </>
  );
}

export default SectionMaster;
