import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AdmCategoryIndex from "../../containers/indeces/admissionMaster/AdmCategoryIndex";
import AdmSubcategoryIndex from "../../containers/indeces/admissionMaster/AdmSubCategoryIndex";
import BoardIndex from "../../containers/indeces/admissionMaster/BoardIndex";
import CurrencytypeIndex from "../../containers/indeces/admissionMaster/CurrencytypeIndex";
import ProgramtypeIndex from "../../containers/indeces/admissionMaster/ProgramtypeIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function AdmissionMaster() {
  const [tab, setTab] = useState("Course");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "AdmissionMaster" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/course")) setTab("Course");
    else if (pathname.toLowerCase().includes("/board")) setTab("Board");
    else if (pathname.toLowerCase().includes("/category")) setTab("Category");
    else if (pathname.toLowerCase().includes("/sub")) setTab("Sub");
    else if (pathname.toLowerCase().includes("/currency")) setTab("Currency");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/AdmissionMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Course" label="Course Type" />
        <Tab value="Board" label="Board" />
        <Tab value="Category" label="Category" />
        <Tab value="Sub" label="Sub Category" />
        <Tab value="Currency" label="Currency" />
      </Tabs>
      {tab === "Course" && <ProgramtypeIndex />}
      {tab === "Board" && <BoardIndex />}
      {tab === "Category" && <AdmCategoryIndex />}
      {tab === "Sub" && <AdmSubcategoryIndex />}
      {tab === "Currency" && <CurrencytypeIndex />}
    </>
  );
}

export default AdmissionMaster;
