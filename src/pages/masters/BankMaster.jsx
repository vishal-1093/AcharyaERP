import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import BankIndex from "../../containers/indeces/bankMaster/BankIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function BankMaster() {
  const [tab, setTab] = useState("Bank");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "BankMaster" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/bank")) setTab("Bank");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/BankMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Bank" label="Bank" />
      </Tabs>
      {tab === "Bank" && <BankIndex />}
    </>
  );
}

export default BankMaster;
