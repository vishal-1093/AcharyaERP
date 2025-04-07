import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import ApprovalPublicationIndex from "../indeces/ApprovalPublicationIndex";
import ApprovalConferenceIndex from "../indeces/ApprovalConferenceIndex";
import ApprovalBookChapterIndex from "../indeces/ApprovalBookChapterIndex";
import ApprovalMembershipIndex from "../indeces/ApprovalMembershipIndex";
import ApprovalGrantIndex from "../indeces/ApprovalGrantIndex";
import ApprovalPatentIndex from "../indeces/ApprovalPatentIndex";
import { useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const tabsData = [
  {
    label: "Publication",
    value: "Publication",
    component: ApprovalPublicationIndex,
  },
  {
    label: "Conference",
    value: "Conference",
    component: ApprovalConferenceIndex,
  },
  {
    label: "Book Chapter",
    value: "Book",
    component: ApprovalBookChapterIndex,
  },
  {
    label: "Membership",
    value: "Membership",
    component: ApprovalMembershipIndex,
  },
  {
    label: "Grant",
    value: "Grant",
    component: ApprovalGrantIndex,
  },

  {
    label: "Patent",
    value: "Patent",
    component: ApprovalPatentIndex,
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
