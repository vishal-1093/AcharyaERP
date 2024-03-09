import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MessAssignmentIndex from "./MessAssignmentIndex";
import MealAssignmentIndex from "./MealAssignmentIndex";
import CreateRefreshmentIndex from "./CreateRereshmentIndex";
import RefreshmentCalenderView from "./refreshmentRequest/RefreshmentCalenderView";

function AssignmentDetailsMaster() {
  const [tab, setTab] = useState("RefreshmentTypeIndex");

  const navigate = useNavigate();
  const { pathname } = useLocation();


  useEffect(() => {
    if (pathname.toLowerCase().includes("/refreshmenttypeindex"))setTab("RefreshmentTypeIndex");
    if (pathname.toLowerCase().includes("/messassignmentindex"))setTab("MessAssignmentIndex");
    if (pathname.toLowerCase().includes("/institutemealindex")) setTab("InstituteMealIndex");
    if (pathname.toLowerCase().includes("/refreshmentcalenderview"))setTab("RefreshmentCalenderView");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CateringMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
      <Tab value="RefreshmentTypeIndex" label="Meal Master" />
        <Tab value="InstituteMealIndex" label="Rate Mapping" />
        <Tab value="MessAssignmentIndex" label="Mess" />
        <Tab value="RefreshmentCalenderView" label="Mess Calender" />

      </Tabs>
      {tab === "RefreshmentTypeIndex" && <CreateRefreshmentIndex />}
      {tab === "MessAssignmentIndex" && <MessAssignmentIndex />}
      {tab === "InstituteMealIndex" && <MealAssignmentIndex />}
      {tab === "RefreshmentCalenderView" && <RefreshmentCalenderView />}
    </>
  );
}

export default AssignmentDetailsMaster;
