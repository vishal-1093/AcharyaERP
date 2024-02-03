import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import OrganizationIndex from "../../containers/indeces/instituteMaster/OrganizationIndex";
import SchoolIndex from "../../containers/indeces/instituteMaster/SchoolIndex";
import JobtypeIndex from "../../containers/indeces/instituteMaster/JobtypeIndex";
import EmptypeIndex from "../../containers/indeces/instituteMaster/EmptypeIndex";
import GraduationIndex from "../../containers/indeces/instituteMaster/GraduationIndex";
import SchoolVisionIndex from "../../containers/indeces/instituteMaster/SchoolVisionIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import InfoModal from "../../components/InfoModal";
import SchoolInfo from "../../docs/schoolInfo/SchoolInfo";

const tabsData = [
  {
    label: "Organization",
    value: "Organization",
    component: OrganizationIndex,
  },
  { label: "School", value: "School", component: SchoolIndex },
  { label: "Job Type", value: "JobType", component: JobtypeIndex },
  { label: "EMP Type ", value: "EmpType", component: EmptypeIndex },
  { label: "Graduation", value: "Graduation", component: GraduationIndex },
  { label: "School Vision", value: "Visions", component: SchoolVisionIndex },
];

function InstituteMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value ||
    "Organization";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value ||
        "Organization"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Institute Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/InstituteMaster/${newValue}`);
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

export default InstituteMaster;
