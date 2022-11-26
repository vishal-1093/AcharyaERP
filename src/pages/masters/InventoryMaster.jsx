import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import StoreIndex from "../../containers/indeces/Inventory Master/StoreIndex";
import MeasureIndex from "../../containers/indeces/Inventory Master/MeasureIndex";

function InventoryMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "InventoryMaster" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Store" />
        <Tab value={1} label="Measurement" />
      </Tabs>

      {tab === 0 && <StoreIndex />}
      {tab === 1 && <MeasureIndex />}
    </>
  );
}

export default InventoryMaster;
