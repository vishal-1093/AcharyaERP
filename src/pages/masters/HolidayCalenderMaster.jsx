import { useState, useEffect } from "react";
import { Tab } from "@mui/material";
import HolidayCalenderIndex from "../../containers/indeces/holidayCalenderMaster/HolidayCalenderIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";

function HolidayCalenderMaster() {
  const [tab, setTab] = useState("HolidayCalenders");
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "HolidayCalender Master" }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/holidaycalenders"))
      setTab("HolidayCalenders");
  }, [pathname]);

  return (
    <>
      <Tab value="HolidayCalenders" />

      {tab === "HolidayCalenders" && <HolidayCalenderIndex />}
    </>
  );
}

export default HolidayCalenderMaster;
