import { useState, useEffect, lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
const PermissionIndex = lazy(() => import("./StudentPermissionIndex"));
const FineConcession = lazy(() => import("./FineConcessionIndex"));

const tabsData = [
  { label: "Permission Index", value: "index", component: PermissionIndex },
  { label: "Fine Concession Index", value: "fineconcession", component: FineConcession },
];

function Index() {
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "index";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "index"
    );
    setCrumbs([]);
  }, [pathname || tab]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/permission-${newValue}`);
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
