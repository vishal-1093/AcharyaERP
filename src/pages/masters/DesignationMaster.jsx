import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import DesignationIndex from "../../containers/indeces/designationMaster/DesignationIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function DesignationMaster() {
  const [tab, setTab] = useState("Designations");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Designation Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/designations"))
      setTab("Designations");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/DesignationMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Designations" label="Designations" />
      </Tabs>
      {tab === "Designations" && <DesignationIndex />}
    </>
  );
}

export default DesignationMaster;
