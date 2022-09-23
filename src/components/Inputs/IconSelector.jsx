import { useState } from "react";
import { Box, Button, Paper, Grid, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import AirportShuttleRoundedIcon from "@mui/icons-material/AirportShuttleRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

const iconsList = [
  { name: "Home", icon: <HomeIcon fontSize="large" /> },
  { name: "Favorite", icon: <FavoriteIcon fontSize="large" /> },
  { name: "Star", icon: <StarRoundedIcon fontSize="large" /> },
  {
    name: "Time",
    icon: <AccessTimeFilledRoundedIcon fontSize="large" />,
  },
  {
    name: "User",
    icon: <AccountCircleRoundedIcon fontSize="large" />,
  },
  { name: "AC", icon: <AcUnitRoundedIcon fontSize="large" /> },
  {
    name: "Access",
    icon: <AccessibilityNewRoundedIcon fontSize="large" />,
  },
  {
    name: "Truck",
    icon: <AirportShuttleRoundedIcon fontSize="large" />,
  },
  {
    name: "Stars",
    icon: <AutoAwesomeRoundedIcon fontSize="large" />,
  },
];

function IconSelector({ value, onSelectIcon }) {
  const [filterText, setFilterText] = useState("");

  return (
    <Box sx={{ background: "white", p: 2, borderRadius: 2 }}>
      <Paper sx={{ position: "sticky", top: 80, mb: 3, zIndex: 1 }}>
        <InputBase
          startAdornment={<Search sx={{ marginRight: 1.3 }} />}
          placeholder="Search icons..."
          sx={{ px: 2, py: 1 }}
          fullWidth
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Paper>
      <Box>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          rowSpacing={2}
          columnGap={2}
        >
          {iconsList
            .filter((item) => item.name.toLowerCase().includes(filterText))
            .map((filteredItem) => {
              return (
                <Grid key={filteredItem.name} item>
                  <Button
                    variant={filteredItem.name === value ? "contained" : "text"}
                    color="blue"
                    onClick={() => onSelectIcon(filteredItem.name)}
                    sx={{
                      display: "block",
                      minWidth: 70,
                      textTransform: "capitalize",
                      px: 0,
                    }}
                  >
                    {filteredItem.icon}
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      {filteredItem.name}
                    </p>
                  </Button>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Box>
  );
}

export default IconSelector;
