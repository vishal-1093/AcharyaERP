import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import TdsIndex from "../../containers/indeces/deductionMaster/TdsIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import AdvanceDeductionIndex from "../indeces/AdvanceDeductionIndex";
import ExtraRemunerationIndex from "../indeces/ExtraRemunerationIndex";

const tabsData = [
  {
    label: "TDS",
    value: "Tds",
    component: TdsIndex,
  },
  {
    label: "Advance",
    value: "Advance",
    component: AdvanceDeductionIndex,
  },
  // {
  //   label: "Extra Remuneration",
  //   value: "Remuneration",
  //   component: ExtraRemunerationIndex,
  // },
];

function DeductionMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "Tds";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "Tds"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Deduction Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (e, newValue) => {
    navigate("/DeductionMaster/" + newValue);
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

export default DeductionMaster;
