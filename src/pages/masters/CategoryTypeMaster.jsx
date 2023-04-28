import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import CategoryTypeIndex from "../../containers/indeces/categoryTypeMaster/CategoryTypeIndex";
import CategoryDetailsIndex from "../../containers/indeces/categoryTypeMaster/CategoryDetailsIndex";
import CommencementTypeIndex from "../../containers/indeces/categoryTypeMaster/CommencementTypeIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function CategoryTypeMaster() {
  const [tab, setTab] = useState("CategoryTypes");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "CategoryType Master " }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/categorytypes"))
      setTab("CategoryTypes");
    else if (pathname.toLowerCase().includes("/categorydetail"))
      setTab("CategoryDetail");
    else if (pathname.toLowerCase().includes("/commencementtypes"))
      setTab("CommencementTypes");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CategoryTypeMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="CategoryTypes" label="Category Types" />
        <Tab value="CategoryDetail" label="Category Details" />
        <Tab value="CommencementTypes" label="Commencement Types" />
      </Tabs>
      {tab === "CategoryTypes" && <CategoryTypeIndex />}
      {tab === "CategoryDetail" && <CategoryDetailsIndex />}
      {tab === "CommencementTypes" && <CommencementTypeIndex />}
    </>
  );
}

export default CategoryTypeMaster;
