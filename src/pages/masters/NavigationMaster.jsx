import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import ModuleIndex from "../../containers/indeces/navigationMaster/ModuleIndex";
import MenuIndex from "../../containers/indeces/navigationMaster/MenuIndex";
import SubmenuIndex from "../../containers/indeces/navigationMaster/SubmenuIndex";
import RoleIndex from "../../containers/indeces/navigationMaster/RoleIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const tabsData = [
  { label: "Module", value: "Module", component: ModuleIndex },
  { label: "Menu", value: "Menu", component: MenuIndex },
  { label: "Submenu", value: "Submenu", component: SubmenuIndex },
  { label: "Role", value: "Role", component: RoleIndex },
];

function NavigationMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "Module";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "Module"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Navigation Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/NavigationMaster/${newValue}`);
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

export default NavigationMaster;
