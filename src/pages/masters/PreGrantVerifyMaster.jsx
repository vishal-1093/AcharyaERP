import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PreScholarshipVerifierIndex from "../indeces/PreScholarshipVerifierIndex";
import PreScholarshipVerifierHistory from "../indeces/PreScholarshipVerifierHistory";

const tabsData = [
  {
    label: "Approve",
    value: "approve",
    component: PreScholarshipVerifierIndex,
  },
  {
    label: "History",
    value: "history",
    component: PreScholarshipVerifierHistory,
  },
];

function PreGrantVerifyMaster() {
  const { pathname } = useLocation();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "approve";

  const [tab, setTab] = useState(initialTab);

  const navigate = useNavigate();

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "approve"
    );
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/PreGrantVerifyMaster/${newValue}`);
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

export default PreGrantVerifyMaster;
