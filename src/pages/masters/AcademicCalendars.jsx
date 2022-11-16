import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AcademicYearIndex from "../../containers/indeces/academicCalendars/AcademicYearIndex";
import FinancialYearIndex from "../../containers/indeces/academicCalendars/FinancialyearIndex";
import CalenderYearIndex from "../../containers/indeces/academicCalendars/CalenderyearIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
function AcademicCalendars() {
  const [value, setValue] = useState(0);
  const setCrumbs = useBreadcrumbs();
  useEffect(() => setCrumbs([{ name: "AcademicCalendars" }]), []);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Academic Year" />
        <Tab label="Financial Year" />
        <Tab label="CalendarYear" />
      </Tabs>
      {value === 0 && <AcademicYearIndex />}
      {value === 1 && <FinancialYearIndex />}
      {value === 2 && <CalenderYearIndex />}
    </>
  );
}

export default AcademicCalendars;
