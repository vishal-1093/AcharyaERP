import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import GroupIndex from "../../containers/indeces/accountMaster/GroupIndex";
import LedgerIndex from "../../containers/indeces/accountMaster/LedgerIndex";
import TallyheadIndex from "../../containers/indeces/accountMaster/TallyheadIndex";
import VoucherIndex from "../../containers/indeces/accountMaster/VoucherIndex";
import VoucherAssignmentIndex from "../../containers/indeces/accountMaster/VoucherAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const tabsData = [
  {
    label: "Group",
    value: "Group",
    component: GroupIndex,
  },
  {
    label: "Ledger",
    value: "Ledger",
    component: LedgerIndex,
  },
  {
    label: "Tallyhead",
    value: "Tallyhead",
    component: TallyheadIndex,
  },
  {
    label: "Voucher Head",
    value: "Voucherhead",
    component: VoucherIndex,
  },
  {
    label: "Assignment",
    value: "Assignment",
    component: VoucherAssignmentIndex,
  },
];

function AccountMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "Group";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "Group"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Account Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (e, newValue) => {
    navigate("/AccountMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        {tabsData.map((tabItem) => (
          <Tab
            key={tabItem.value}
            value={tabItem.value}
            label={tabItem.label}
          />
        ))}
      </Tabs>
      {tabsData.map((tabItem) => (
        <div key={tabItem.value}>
          {tab === tabItem.value && <tabItem.component />}
        </div>
      ))}
    </>
  );
}

export default AccountMaster;
