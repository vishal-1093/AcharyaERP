import { useState, useEffect, lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
const SchoolIndex = lazy(() => import("./CounterSummarySchoolIndex"));
const UserIndex = lazy(() => import("./CounterSummaryUserIndex"));

const tabsData = [
  { label: "User", value: "user", component: UserIndex },
  { label: "School", value: "school", component: SchoolIndex },
];

function Index() {
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "user";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "user"
    );
    setCrumbs([]);
  }, [pathname || tab]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/counter-summary-${newValue}`);
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

export default Index;
