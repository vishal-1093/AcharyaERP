import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentFeedbackIndex from "../../containers/indeces/studentFeedbackMaster/StudentFeedbackIndex";
import StudentPercentageFreezeIndex from "../../containers/indeces/studentFeedbackMaster/StudentFeedbackFreezeIndex";
import StudentFeedbackWindowIndex from "../../containers/indeces/studentFeedbackMaster/StudentFeedbackWindowIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

const tabsData = [
  { label: "Questionaire", value: "Questions", component:StudentFeedbackIndex},
  { label: "Percentage Freeze", value: "freezepercentage", component:StudentPercentageFreezeIndex},
  { label: "Feedback Window", value: "feedbackwindow", component:StudentFeedbackWindowIndex}
];

function StudentFeedbackMaster() {
  const [tab, setTab] = useState("Questions");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Student Feedback" }]));

  useEffect(() => {
   // if (pathname.toLowerCase().includes("/questions")) setTab("Questions");
   const selectedTab = tabsData.find((tabItem) =>
    pathname.toLowerCase().includes(tabItem.value.toLowerCase())
  );
  if (selectedTab) {
    setTab(selectedTab.value);
  }
  }, [pathname]);

  const handleChange = (e, newValue) => {
    setTab(newValue);
    navigate("/StudentFeedbackMaster/" + newValue);
  };

  return (
    <>
      {/* <Tabs value={tab} onChange={handleChange}>
        <Tab value="Questions" label="Questionaire" />
      </Tabs>
      {tab === "Questions" && <StudentFeedbackIndex />} */}
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

export default StudentFeedbackMaster;
