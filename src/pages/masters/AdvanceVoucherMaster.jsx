import { useState, useEffect, lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

const AdvancePaymentVoucherIndex = lazy(() =>
  import("../../containers/indeces/accountMaster/AdvancePaymentVoucherIndex")
);

const PaidPaymentVoucherIndex = lazy(() =>
  import("../../containers/indeces/accountMaster/PaidPaymentVoucherIndex")
);

function AdvanceVoucherMaster() {
  const [tab, setTab] = useState("Advance");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setCrumbs([{ name: "Voucher Master" }]);
  }, [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/advance")) setTab("Advance");
    if (pathname.toLowerCase().includes("/paid")) setTab("Paid");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/AdvanceVoucherMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Advance" label="Advance" />
        <Tab value="Paid" label="Paid" />
      </Tabs>
      {tab === "Advance" && <AdvancePaymentVoucherIndex />}
      {tab === "Paid" && <PaidPaymentVoucherIndex />}
    </>
  );
}

export default AdvanceVoucherMaster;
