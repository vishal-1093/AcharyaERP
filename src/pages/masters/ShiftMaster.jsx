import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ShiftIndex from "../../containers/indeces/shiftMaster/ShiftIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function ShiftMaster() {
  const [tab, setTab] = useState("Shifts");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Shift Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/shifts")) setTab("Shifts");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/ShiftMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Shifts" label="Shifts" />
      </Tabs>
      {tab === "Shifts" && <ShiftIndex />}
    </>
  );
}

export default ShiftMaster;
