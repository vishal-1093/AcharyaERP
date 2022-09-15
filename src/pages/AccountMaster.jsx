import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import GroupIndex from "../containers/Group/GroupIndex";
import LedgerIndex from "../containers/Ledger/LedgerIndex";
import TallyheadIndex from "../containers/TallyHead/TallyheadIndex";
import FinancialyearIndex from "../containers/FinancialYear/FinancialyearIndex";

function AccountMaster() {
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Group" />
        <Tab label="Ledger" />
        <Tab label="Tallyhead" />
        <Tab label="Financial Year " />
      </Tabs>

      {value === 0 && <GroupIndex />}
      {value === 1 && <LedgerIndex />}
      {value === 2 && <TallyheadIndex />}
      {value === 3 && <FinancialyearIndex />}
    </>
  );
}

export default AccountMaster;
