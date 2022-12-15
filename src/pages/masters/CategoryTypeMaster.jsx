import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import CategoryTypeIndex from "../../containers/indeces/CategoryTypeMaster/CategoryTypeIndex";
import CategoryDetailsIndex from "../../containers/indeces/CategoryTypeMaster/CategoryDetailsIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function CategoryTypeMaster() {
  const [tab, setTab] = useState("Category");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "CategoryType Master " }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/details")) setTab("Details");
    else if (pathname.toLowerCase().includes("/category")) setTab("Category");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CategoryTypeMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Category" label="Category Type" />
        <Tab value="Details" label="Category Details" />
      </Tabs>
      {tab === "Category" && <CategoryTypeIndex />}
      {tab === "Details" && <CategoryDetailsIndex />}
    </>
  );
}

export default CategoryTypeMaster;
