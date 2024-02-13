import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import DepartmentIndex from "../../containers/indeces/academicMaster/DepartmentIndex";
import DepartmentAssignmentIndex from "../../containers/indeces/academicMaster/DepartmentAssignmentIndex";
import ProgramIndex from "../../containers/indeces/academicMaster/ProgramIndex";
import ProgramAssIndex from "../../containers/indeces/academicMaster/ProgramAssIndex";
import ProgramSpecializationIndex from "../../containers/indeces/academicMaster/ProgramSpecializationIndex";
import VisionMissionIndex from "../../containers/indeces/academicMaster/VisionMissionIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";

const tabsData = [
  {
    label: "Department",
    value: "Department",
    component: DepartmentIndex,
  },
  {
    label: "Dept Assign",
    value: "Assignment",
    component: DepartmentAssignmentIndex,
  },
  {
    label: "Program",
    value: "Program",
    component: ProgramIndex,
  },
  {
    label: "Prog Assign",
    value: "Assign",
    component: ProgramAssIndex,
  },
  {
    label: "Specialization",
    value: "Specialization",
    component: ProgramSpecializationIndex,
  },
  {
    label: "Vision/Mission",
    value: "VisionMissions",
    component: VisionMissionIndex,
  },
];

function AcademicMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "Department";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value ||
        "Department"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Academic Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (e, newValue) => {
    navigate("/AcademicMaster/" + newValue);
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

export default AcademicMaster;
