import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SectionAssignmentIndex from "../../containers/indeces/timeTableMaster/SectionAssignmentIndex";
import TimeSlotsIndex from "../../containers/indeces/timeTableMaster/TimeSlotsIndex";
import BatchAssignmentIndex from "../../containers/indeces/timeTableMaster/BatchAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function TimeTableMaster() {
  const [tab, setTab] = useState("Assign");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Time Table Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/assign")) setTab("Assign");
    else if (pathname.toLowerCase().includes("/timeslot")) setTab("TimeSlot");
    else if (pathname.toLowerCase().includes("/batchassignments"))
      setTab("BatchAssignments");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/TimeTableMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Assign" label="Section Assignment" />
        <Tab value="TimeSlot" label="Time Slot" />
        <Tab value="BatchAssignments" label="Batch Assignment" />
      </Tabs>
      {tab === "Assign" && <SectionAssignmentIndex />}
      {tab === "TimeSlot" && <TimeSlotsIndex />}
      {tab === "BatchAssignments" && <BatchAssignmentIndex />}
    </>
  );
}

export default TimeTableMaster;
