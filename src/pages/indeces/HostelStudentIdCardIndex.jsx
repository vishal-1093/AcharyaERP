import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import PrintIndex from "../../containers/indeces/HostelStudentIdCard/PrintIndex";
import HistoryIndex from "../../containers/indeces/HostelStudentIdCard/HistoryIndex";

const tabsData = [
  { label: "Print", value: "print", component: PrintIndex },
  { label: "History", value: "history", component: HistoryIndex },
];

function StudentIdCardIndex() {
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "print";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "print"
    );
    setCrumbs([{ name: "ID Card", link:'/IdCardPrint'},{ name: "Hostel Student" }, { name: (tab).charAt(0).toUpperCase() + (tab).slice(1).toLowerCase() }]);
  }, [pathname || tab]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/idcard-hostelstudent-${newValue}`);
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
