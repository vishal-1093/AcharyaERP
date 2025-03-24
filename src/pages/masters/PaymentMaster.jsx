import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import PaymentVoucherIndex from "../../containers/indeces/inventoryMaster/PaymentVoucherIndex";
import PaymentJournal from "../../containers/indeces/inventoryMaster/PaymentJournal";
import ContraIndexfrom from "../../containers/indeces/inventoryMaster/ContraIndex";

// import FundTransferComponent from './FundTransferComponent';
// import ContraComponent from './ContraComponent';
// import SalaryJournalComponent from './SalaryJournalComponent';

const tabsData = [
  { label: "Payment", value: "payment", component: PaymentVoucherIndex },
  { label: "Journal", value: "journal", component: PaymentJournal },
  { label: "Contra", value: "contra", component: ContraIndexfrom },
  { label: "Salary Journal", value: "salary", component: () => {} },
];

const PaymentMaster = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "payment";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "payment"
    );
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/PaymentMaster/${newValue}`);
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
};

export default PaymentMaster;
