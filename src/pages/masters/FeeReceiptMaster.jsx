import React, { useState, useEffect,lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const StudentFeereceiptIndex = lazy(()=>import("../../containers/indeces/studentMaster/StudentFeereceiptIndex"));
const StudentCancelledFeereceiptIndex = lazy(()=>import("../../containers/indeces/studentMaster/CancelReceiptIndex"))

const tabsData = [
  {
    label: "Fee Receipt",
    value: "daybook",
    component: StudentFeereceiptIndex,
  },
  {
    label:  "Void Receipt",
    value: "cancel",
    component: StudentCancelledFeereceiptIndex,
  },
];

const FeeReceiptMaster = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "daybook";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setCrumbs([]);
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "daybook"
    );
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/feereceipt-create-${newValue}`);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange} style={{display:"block"}}>
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

export default FeeReceiptMaster;
