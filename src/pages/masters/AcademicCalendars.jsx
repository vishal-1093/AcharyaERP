import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AcademicYearIndex from "../../containers/indeces/academicCalendars/AcademicYearIndex";
import FinancialYearIndex from "../../containers/indeces/academicCalendars/FinancialyearIndex";
import CalenderYearIndex from "../../containers/indeces/academicCalendars/CalenderyearIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function AcademicCalendars() {
  const [tab, setTab] = useState("AcademicYear");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Academic Calendars" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/academicyear"))
      setTab("AcademicYear");
    else if (pathname.toLowerCase().includes("/financialyear"))
      setTab("FinancialYear");
    else if (pathname.toLowerCase().includes("/calendaryear"))
      setTab("CalendarYear");
  }, [pathname]);
  const handleChange = (e, newValue) => {
    navigate("/AcademicCalendars/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="AcademicYear" label="Academic Year" />
        <Tab value="FinancialYear" label="Financial Year" />
        <Tab value="CalendarYear" label="Calendar Year" />
      </Tabs>
      {tab === "AcademicYear" && <AcademicYearIndex />}
      {tab === "FinancialYear" && <FinancialYearIndex />}
      {tab === "CalendarYear" && <CalenderYearIndex />}
    </>
  );
}

export default AcademicCalendars;
