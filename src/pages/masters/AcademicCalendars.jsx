import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AcademicYearIndex from "../../containers/indeces/academicCalendars/AcademicYearIndex";
import FinancialYearIndex from "../../containers/indeces/academicCalendars/FinancialyearIndex";
import CalenderYearIndex from "../../containers/indeces/academicCalendars/CalenderyearIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

const tabsData = [
  {
    label: "Academic Year",
    value: "AcademicYear",
    component: AcademicYearIndex,
  },
  {
    label: "Financial Year",
    value: "FinancialYear",
    component: FinancialYearIndex,
  },
  {
    label: "Calendar Year",
    value: "CalendarYear",
    component: CalenderYearIndex,
  },
];

function AcademicCalendars() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value ||
    "AcademicYear";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value ||
        "AcademicYear"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Academic Calendars" }, { name: tab }]),
    [tab]
  );

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/AcademicCalendars/${newValue}`);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        {tabsData.map((tabItem) => (
          <Tab
            key={tabItem.value}
            value={tabItem.value}
            label={tabItem.label}
          />
        ))}
      </Tabs>
      {tabsData.map((tabItem) => (
        <div key={tabItem.value}>
          {tab === tabItem.value && <tabItem.component />}
        </div>
      ))}
    </>
  );
}

export default AcademicCalendars;
