import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import PrintIndex from "../../containers/indeces/StaffIdCard/PrintIndex";
import HistoryIndex from "../../containers/indeces/StaffIdCard/HistoryIndex";

const tabsData = [
  { label: "Print", value: "Print", component: PrintIndex },
  { label: "History", value: "History", component: HistoryIndex },
];

function StaffIdCardIndex() {
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "Print";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setCrumbs([{ name: "ID Card Print", link:'/IdCardPrint'},{ name: "Staff ID Card" }, { name: tab }]);
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value
    );
  }, [pathname || tab]);

  const handleChange = (event, newValue) => {
    navigate(`/StaffIdCard/${newValue}`);
    setTab(newValue)
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

export default StaffIdCardIndex;
