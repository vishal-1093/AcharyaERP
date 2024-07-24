import { useEffect, useState } from "react";
import axios from "../services/Api";
import { Box, Grid, Tab, Tabs, styled } from "@mui/material";

const headerTabs = [
  { value: "Personal", label: "Personal" },
  { value: "Employment", label: "Employment" },
];

const CustomTabsHorizontal = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    display: "flex",
    width: "100%",
  },
});

const CustomTabHorizontal = styled(Tab)(({ theme }) => ({
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  flex: 1,
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
}));

function EmployeeProfile() {
  const [tab, setTab] = useState("Personal");

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <CustomTabsHorizontal
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            {headerTabs.map((obj, i) => {
              return (
                <CustomTabHorizontal
                  key={i}
                  value={obj.value}
                  label={obj.label}
                />
              );
            })}
          </CustomTabsHorizontal>
        </Grid>

        <Grid item xs={12}>
          {}
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeProfile;
