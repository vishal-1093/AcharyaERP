import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import HostelBlockIndex from "../../containers/indeces/hostelCreationMaster/HostelBlockIndex";
import HostelRoomIndex from "../../containers/indeces/hostelCreationMaster/HostelRoomIndex";
import HostelBedIndex from "../../containers/indeces/hostelCreationMaster/HostelBedIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const tabsData = [
  {
    label: "Hostel Block",
    value: "HostelBlock",
    component: HostelBlockIndex,
  },
  { label: "Hostel Room", value: "HostelRoom", component: HostelRoomIndex },
  { label: "Hostel Bed", value: "HostelBed", component: HostelBedIndex },
];

function HostelCreationMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value ||
    "Hostel Block";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value ||
        "Hostel Block"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Hostel Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (event, newValue) => {
    console.log(newValue,"newValue");
    setTab(newValue);
    navigate(`/HostelCreationMaster/${newValue}`);
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

export default HostelCreationMaster;
