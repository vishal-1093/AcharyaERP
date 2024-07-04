import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import BankInactiveData from "../../containers/indeces/bankMaster/BankInactiveData";
import BankImportIndex from "../../containers/indeces/bankMaster/BankImportIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import BankGroupIndex from "../../containers/indeces/bankMaster/BankGroupIndex";

function BankMaster() {
  const [tab, setTab] = useState("Import");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "BankMaster" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/import")) setTab("Import");
    else if (pathname.toLowerCase().includes("/group")) setTab("Group");
    else if (pathname.toLowerCase().includes("/bank")) setTab("Bank");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/BankMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Import" label="Bank Import" />
        <Tab value="Group" label="Group" />
        <Tab value="Bank" label="Inactive" />
      </Tabs>
      {tab === "Import" && <BankImportIndex />}
      {tab === "Group" && <BankGroupIndex />}
      {tab === "Bank" && <BankInactiveData />}
    </>
  );
}

export default BankMaster;
