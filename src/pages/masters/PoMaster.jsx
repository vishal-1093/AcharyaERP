import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AllPoList from "../../containers/indeces/inventoryMaster/AllPoList";
import CancelledPoList from "../../containers/indeces/inventoryMaster/CancelledPoList";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function PoMaster() {
  const [tab, setTab] = useState("Active");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Po Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/active")) setTab("Active");
    if (pathname.toLowerCase().includes("/inactive")) setTab("Inactive");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/Pomaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Active" label="Active" />
        <Tab value="Inactive" label="Inactive" />
      </Tabs>
      {tab === "Active" && <AllPoList />}
      {tab === "Inactive" && <CancelledPoList />}
    </>
  );
}

export default PoMaster;
