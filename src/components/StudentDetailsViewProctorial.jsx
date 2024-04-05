import React from "react";
import { useState } from "react";
import { Grid, Tabs, Tab, styled } from "@mui/material";

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
  }
}));

const StudentDetailsViewDocuments = () => {
  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  const [subTab, setSubTab] = useState("Proctor Meetings");
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
            <CustomTab value="Proctor Meetings" label="Proctor Meetings" />
          </CustomTabs>
        </Grid>
      </Grid>
    </>
  );
};

export default StudentDetailsViewDocuments;
