import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Profile from "../assets/Profile.jpg";

function StudentProfileView() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box m={4}>
      <Grid container columnSpacing={4} rowSpacing={2}>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ borderRadius: 4, padding: 4 }}>
            <Grid container rowSpacing={1}>
              <Grid item xs={12} align="center">
                {/* <Avatar
                  alt="Profile"
                  src={Profile}
                  sx={{ width: 90, height: 90 }}
                /> */}
                <img src={Profile} alt="Profile" width="100" />
              </Grid>
              <Grid item xs={12} align="center">
                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  Sreelakshmi Jyothish
                </Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ fontSize: 12 }}
                >
                  ACP25APHD001
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                      SCHOOl
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 12 }}
                    >
                      Acharya Institute Of Technology
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                      PROGRAM
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 12 }}
                    >
                      BE - Computer Science
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                      CURRENT YEAR/SEM
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 12 }}
                    >
                      2/4
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                      Date Of Admission
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 12 }}
                    >
                      19-12-2024
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                      ADDRESS
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 12, textAlign: "justify" }}
                    >
                      Building 105, Street 59, Amwaj, Block 257, Muharraq, Al
                      Muharraq, Muharraq Governorate, Bahrain
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                      ADDRESS
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mb={1}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 12, textAlign: "justify" }}
                    >
                      Building 105, Street 59, Amwaj, Block 257, Muharraq, Al
                      Muharraq, Muharraq Governorate, Bahrain
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper elevation={4} sx={{ borderRadius: 2, padding: 2 }}>
            <Grid container>
              <Grid item xs={12}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="fullWidth"
                  sx={{
                    "& .MuiTab-root": {
                      paddingBottom: "0px", // Remove padding under the label for all tabs
                    },
                    "& .Mui-selected": {
                      paddingBottom: "2px", // Ensure space is reduced when tab is selected
                      borderBottom: "2px solid",
                    },
                  }}
                >
                  <Tab value="1" label="Reporting" />
                  <Tab value="2" label="Course" />
                  <Tab value="3" label="Attendance" />
                  <Tab value="4" label="Marks" />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                {(value === "1" ||
                  value === "2" ||
                  value === "3" ||
                  value === "4") && <Box sx={{ padding: 31 }}>Testing</Box>}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentProfileView;
