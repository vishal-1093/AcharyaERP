import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import PublicationReport from "../indeces/PublicationReport";
import ConferenceReport from "../indeces/ConferenceReport";
import BookChapterReport from "../indeces/BookChapterReport";
import MembershipReport from "../indeces/MembershipReport";
import GrantReport from "../indeces/GrantReport";
import PatentReport from "../indeces/PatentReport";
import { useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const tabsData = [
  {
    label: "Publication",
    value: "Publication",
    component: PublicationReport,
  },
  {
    label: "Conference",
    value: "Conference",
    component: ConferenceReport,
  },
  {
    label: "Book Chapter",
    value: "Book",
    component: BookChapterReport,
  },
  {
    label: "Membership",
    value: "Membership",
    component: MembershipReport,
  },
  {
    label: "Grant",
    value: "Grant",
    component: GrantReport,
  },

  {
    label: "Patent",
    value: "Patent",
    component: PatentReport,
  },
];

function ProfessionalReport() {
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value ||
    "Publication";

  useEffect(() => {
    setCrumbs([{ name: "AddOn Report"}]);
  }, [tabsData]);
  const [tabs, setTabs] = useState(initialTab);

  const handleChange = (e, newValue) => {
    setTabs(newValue);
  };

  return (
    <>
      <Tabs value={tabs} onChange={handleChange}>
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
          {tabs === tabItem.value && <tabItem.component />}
        </div>
      ))}
    </>
  );
}

export default ProfessionalReport;
