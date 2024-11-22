import React, { useEffect } from "react";
import { useState } from "react";
import { Grid, Tabs, Tab, styled } from "@mui/material";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const EmployeeDetailsViewMentor = ({ data, state, type }) => {
  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
    // setIsEditing(false);
  };

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    if (state) {
      setCrumbs([
        {
          name: "Employee Index",
          link: type === "user" ? "/employee-userwiseindex" : "/EmployeeIndex",
        },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    } else {
      setCrumbs([
        { name: "Employee Profile" },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    }
  }, []);

  const [subTab, setSubTab] = useState("Procteedata");
  return (
    <>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Procteedata" label="Proctee Data" />
            <CustomTab value="Meeting" label="Meeting" />
          </CustomTabs>
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDetailsViewMentor;
