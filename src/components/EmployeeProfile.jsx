import { Box, Tab, Tabs, styled } from "@mui/material";

const headerTabs = [
  { value: "Personal", label: "Personal" },
  { value: "Employment", label: "Employment" },
];

const CustomTabsHorizontal = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    display: "flex",
    width: "100%",
    border: "1px solid #ccc",
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
  return (
    <Box>
      <CustomTabsHorizontal value="Personal" variant="fullWidth">
        {headerTabs.map((obj, i) => {
          return (
            <CustomTabHorizontal key={i} value={obj.value} label={obj.label} />
          );
        })}
      </CustomTabsHorizontal>
    </Box>
  );
}

export default EmployeeProfile;
