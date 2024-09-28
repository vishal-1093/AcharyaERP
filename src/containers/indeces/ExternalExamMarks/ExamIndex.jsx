import { useState, useEffect, lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
const ExternalExamMark = lazy(() => import("./ExternalExamMark"));
const ReportIndex = lazy(() => import("./ReportIndex"));

const tabsData = [
  { label: "Exam Marks", value: "index", component: ExternalExamMark },
  { label: "Report", value: "report", component: ReportIndex },
];

const ExamIndex = () => {
  const setCrumbs = useBreadcrumbs();
  const navigation = useNavigate();
  const { pathname } = useLocation();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "index";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "index"
    );
    setCrumbs([{ name: "External Exam Mark" }]);
  }, [pathname || tab]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigation(`/external-exam-mark-${newValue}`);
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
};

export default ExamIndex;
