import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import ApprovalPublicationReportIndex from "../indeces/ApprovalPublicationReportIndex";
import ApprovalConferenceReportIndex from "../indeces/ApprovalConferenceReportIndex";
import ApprovalBookChapterReportIndex from "../indeces/ApprovalBookChapterReportIndex";
import ApprovalMembershipReportIndex from "../indeces/ApprovalMembershipReportIndex";
import ApprovalGrantReportIndex from "../indeces/ApprovalGrantReportIndex";
import ApprovalPatentReportIndex from "../indeces/ApprovalPatentReportIndex";
import { useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const tabsData = [
  {
    label: "Publication",
    value: "Publication",
    component: ApprovalPublicationReportIndex,
  },
  {
    label: "Conference",
    value: "Conference",
    component: ApprovalConferenceReportIndex,
  },
  {
    label: "Book Chapter",
    value: "Book",
    component: ApprovalBookChapterReportIndex,
  },
  {
    label: "Membership",
    value: "Membership",
    component: ApprovalMembershipReportIndex,
  },
  {
    label: "Grant",
    value: "Grant",
    component: ApprovalGrantReportIndex,
  },

  {
    label: "Patent",
    value: "Patent",
    component: ApprovalPatentReportIndex,
  },
];

function ProfessionalReport() {
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value ||
    "Publication";

  useEffect(() => {
    setCrumbs([]);
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
