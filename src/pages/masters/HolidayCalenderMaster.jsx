import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import HolidayCalenderIndex from "../../containers/indeces/HolidayCalenderMaster/HolidayCalenderIndex";

function HolidayCalenderMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "Holiday Calender Master" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Holiday Calender" />
      </Tabs>

      {tab === 0 && <HolidayCalenderIndex />}
    </>
  );
}

export default HolidayCalenderMaster;
