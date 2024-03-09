import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StoreIndex from "../../containers/indeces/inventoryMaster/StoreIndex";
import MeasureIndex from "../../containers/indeces/inventoryMaster/MeasureIndex";
import VendorIndex from "../../containers/indeces/inventoryMaster/VendorIndex";
import ItemIndex from "../../containers/indeces/inventoryMaster/ItemIndex";
import ItemAssignmentIndex from "../../containers/indeces/inventoryMaster/ItemAssignmentIndex";
import ItemsInStoresIndex from "../../containers/indeces/inventoryMaster/ItemsInStoresIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import LibraryDetailsIndex from "../../containers/indeces/inventoryMaster/LibraryDetailsIndex";

function InventoryMaster() {
  const [tab, setTab] = useState("Stores");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Inventory Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/stores")) setTab("Stores");
    else if (pathname.toLowerCase().includes("/measures")) setTab("Measures");
    else if (pathname.toLowerCase().includes("/vendor")) setTab("Vendor");
    else if (pathname.toLowerCase().includes("/item")) setTab("Item");
    else if (pathname.toLowerCase().includes("/assignment"))
      setTab("Assignment");
    else if (pathname.toLowerCase().includes("/library")) setTab("Library");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/InventoryMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Stores" label="Stores" />
        <Tab value="Measures" label="Measures" />
        <Tab value="Vendor" label="Vendor" />
        <Tab value="Item" label="Item" />
        <Tab value="Assignment" label="Assignment" />
        <Tab value="Library" label="Library" />
      </Tabs>
      {tab === "Stores" && <StoreIndex />}
      {tab === "Measures" && <MeasureIndex />}
      {tab === "Vendor" && <VendorIndex />}
      {tab === "Item" && <ItemIndex />}
      {tab === "Assignment" && <ItemsInStoresIndex />}
      {tab === "Library" && <LibraryDetailsIndex />}
    </>
  );
}

export default InventoryMaster;
