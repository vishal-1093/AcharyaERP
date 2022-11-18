import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AdmCategoryIndex from "../../containers/indeces/admissionMaster/AdmCategoryIndex";
import AdmSubcategoryIndex from "../../containers/indeces/admissionMaster/AdmSubCategoryIndex";
import BoardIndex from "../../containers/indeces/admissionMaster/BoardIndex";
import CurrencytypeIndex from "../../containers/indeces/admissionMaster/CurrencytypeIndex";
import ProgramtypeIndex from "../../containers/indeces/admissionMaster/ProgramtypeIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function AdmissionMaster() {
  const [value, setValue] = useState(0);
  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "AdmissionMaster" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Course Type" />
        <Tab label="Board" />
        <Tab label="Category" />
        <Tab label="Sub Category" />
        <Tab label="Currency" />
      </Tabs>
      {value === 0 && <ProgramtypeIndex />}
      {value === 1 && <BoardIndex />}
      {value === 2 && <AdmCategoryIndex />}
      {value === 3 && <AdmSubcategoryIndex />}
      {value === 4 && <CurrencytypeIndex />}
    </>
  );
}

export default AdmissionMaster;
