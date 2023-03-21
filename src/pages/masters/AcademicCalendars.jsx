import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AcademicYearIndex from "../../containers/indeces/academicCalendars/AcademicYearIndex";
import FinancialYearIndex from "../../containers/indeces/academicCalendars/FinancialyearIndex";
import CalenderYearIndex from "../../containers/indeces/academicCalendars/CalenderyearIndex";
import CommencementTypeIndex from "../../containers/indeces/academicCalendars/CommencementTypeIndex";
import ClassCommencementIndex from "../../containers/indeces/academicCalendars/ClassCommencementIndex";
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
    else if (pathname.toLowerCase().includes("/commencementtypes"))
      setTab("CommencementTypes");
    else if (pathname.toLowerCase().includes("/classcommencement"))
      setTab("ClassCommencement");
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
        <Tab value="CommencementTypes" label="Commencement Types" />
        <Tab value="ClassCommencement" label="Class Commencement" />
      </Tabs>
      {tab === "AcademicYear" && <AcademicYearIndex />}
      {tab === "FinancialYear" && <FinancialYearIndex />}
      {tab === "CalendarYear" && <CalenderYearIndex />}
      {tab === "CommencementTypes" && <CommencementTypeIndex />}
      {tab === "ClassCommencement" && <ClassCommencementIndex />}
    </>
  );
}

export default AcademicCalendars;
