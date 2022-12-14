import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import GroupIndex from "../../containers/indeces/accountMaster/GroupIndex";
import LedgerIndex from "../../containers/indeces/accountMaster/LedgerIndex";
import TallyheadIndex from "../../containers/indeces/accountMaster/TallyheadIndex";
import VoucherIndex from "../../containers/indeces/accountMaster/VoucherIndex";
import VoucherAssignmentIndex from "../../containers/indeces/accountMaster/VoucherAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function AccountMaster() {
  const [tab, setTab] = useState("Group");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "AccountMaster" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/group")) setTab("Group");
    else if (pathname.toLowerCase().includes("/ledger")) setTab("Ledger");
    else if (pathname.toLowerCase().includes("/tallyhead")) setTab("Tallyhead");
    else if (pathname.toLowerCase().includes("/voucherhead"))
      setTab("Voucherhead");
    else if (pathname.toLowerCase().includes("/assignment"))
      setTab("Assignment");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/AccountMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Group" label="Group" />
        <Tab value="Ledger" label="Ledger" />
        <Tab value="Tallyhead" label="Tallyhead" />
        <Tab value="Voucherhead" label="Voucher Head" />
        <Tab value="Assignment" label="Assignment" />
      </Tabs>

      {tab === "Group" && <GroupIndex />}
      {tab === "Ledger" && <LedgerIndex />}
      {tab === "Tallyhead" && <TallyheadIndex />}
      {tab === "Voucherhead" && <VoucherIndex />}
      {tab === "Assignment" && <VoucherAssignmentIndex />}
    </>
  );
}

export default AccountMaster;
