import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import LeaveTypeIndex from "../../containers/indeces/leaveMaster/LeaveTypeIndex";
import LeavePatternIndex from "../../containers/indeces/leavePatternMaster/LeavePatternIndex";
import ViewReport from "../forms/leavePatternMaster/ViewReport";
import LeavePatternCopy from "../forms/leavePatternMaster/LeavePatternCopy";
import GraduationIndex from "../../containers/indeces/instituteMaster/GraduationIndex";
import SchoolVisionIndex from "../../containers/indeces/instituteMaster/SchoolVisionIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import InfoModal from "../../components/InfoModal";
import SchoolInfo from "../../docs/schoolInfo/SchoolInfo";

const tabsData = [
  {
    label: "Leave Type",
    value: "LeaveType",
    component: LeaveTypeIndex,
  },
  {
    label: "Leave Pattern",
    value: "LeavePattern",
    component: LeavePatternIndex,
  },
  {
    label: "Leave Pattern Copy",
    value: "Copy",
    component: LeavePatternCopy,
  },
  { label: "View Report", value: "ViewReport", component: ViewReport },
];

function LeaveMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "LeaveType";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "LeaveType"
    );
  }, [pathname]);

  useEffect(() => setCrumbs([{ name: "Leave Master" }, { name: tab }]), [tab]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/LeaveMaster/${newValue}`);
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

export default LeaveMaster;
