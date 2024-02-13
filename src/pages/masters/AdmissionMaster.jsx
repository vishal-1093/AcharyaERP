import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AdmCategoryIndex from "../../containers/indeces/admissionMaster/AdmCategoryIndex";
import AdmSubcategoryIndex from "../../containers/indeces/admissionMaster/AdmSubCategoryIndex";
import BoardIndex from "../../containers/indeces/admissionMaster/BoardIndex";
import CurrencytypeIndex from "../../containers/indeces/admissionMaster/CurrencytypeIndex";
import ProgramtypeIndex from "../../containers/indeces/admissionMaster/ProgramtypeIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

const tabsData = [
  {
    label: "Course Type",
    value: "Course",
    component: ProgramtypeIndex,
  },
  {
    label: "Board",
    value: "Board",
    component: BoardIndex,
  },
  {
    label: "Category",
    value: "Category",
    component: AdmCategoryIndex,
  },
  {
    label: "Sub Category",
    value: "Sub",
    component: AdmSubcategoryIndex,
  },
  {
    label: "Currency",
    value: "Currency",
    component: CurrencytypeIndex,
  },
];

function AdmissionMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "Course";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "Course"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Admission Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (e, newValue) => {
    navigate("/AdmissionMaster/" + newValue);
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

export default AdmissionMaster;
