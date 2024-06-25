import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import PrintIndex from "../../containers/indeces/StudentIdCard/PrintIndex";
import HistoryIndex from "../../containers/indeces/StudentIdCard/HistoryIndex";

const tabsData = [
  { label: "Print", value: "Print", component: PrintIndex },
  { label: "History", value: "History", component: HistoryIndex },
];

function StudentIdCardIndex() {
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "Print";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "Print"
    );
  }, [pathname]);

  useEffect(() => {
    setCrumbs([{ name: "Student ID Card" }, { name: tab }]);
  }, [tab]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/StudentIdCard/${newValue}`);
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

export default StudentIdCardIndex;
