import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ClassCommencementIndex from "../../containers/indeces/academicSectionMaster/ClassCommencementIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function AcademicSectionMaster() {
  const [tab, setTab] = useState("CategoryTypes");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Calendar Academic" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/classcommencement"))
      setTab("ClassCommencement");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CalendarAcademic/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="ClassCommencement" label="Calendar Academic" />
      </Tabs>
      {tab === "ClassCommencement" && <ClassCommencementIndex />}
    </>
  );
}

export default AcademicSectionMaster;
