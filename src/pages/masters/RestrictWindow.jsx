import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import PaysliplockIndex from "../../containers/indeces/restrictwindowMaster/paysliplock";
import SalaryLockIndex from "../indeces/SalaryLockIndex";
import { useLocation, useNavigate } from "react-router-dom";

const tabsData = [
  {
    label: "Payslip Lock",
    value: "paysliplock",
    component: PaysliplockIndex,
  },
  {
    label: "Salary Lock",
    value: "salary",
    component: SalaryLockIndex,
  },
];

function RestrictWindow() {
  const { pathname } = useLocation();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.toLowerCase().includes(tab.value))?.value ||
    "paysliplock";

  const [tab, setTab] = useState(initialTab);

  const navigate = useNavigate();

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value ||
        "paysliplock"
    );
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/RestrictWindow/${newValue}`);
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

export default RestrictWindow;
