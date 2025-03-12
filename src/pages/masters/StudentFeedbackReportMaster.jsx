import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFeedbackReportIndex from "../../containers/indeces/studentFeedbackReportMaster/StudentFeedbackReportIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

const tabsData = [
  { label: "Students", value: "students", component:StudentFeedbackReportIndex},
];

function StudentFeedbackReport() {
  const [tab, setTab] = useState("students");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();


  useEffect(() => {
    const selectedTab = tabsData.find((tabItem) =>
      pathname.toLowerCase().includes(tabItem.value.toLowerCase())
    );
    if (selectedTab) {
      setTab(selectedTab.value);
    }
  }, [pathname]);

  const handleChange = (e, newValue) => {
    setTab(newValue);
    navigate("/StudentFeedbackReport/" + newValue);
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

export default StudentFeedbackReport;


