import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Fab from "@mui/material/Fab";
import { useState } from "react";
import CustomTextField from "../../../components/Inputs/CustomTextField";

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: "5px",
//     color: theme.palette.tableBg.main,
//   },
// }));

// const buttonSx = {
//   ...(success && {
//     bgcolor: green[500],
//     "&:hover": {
//       bgcolor: green[700],
//     },
//   }),
// };

const test = [
  { name: "test", value: 1, active: false, checked: true },
  { name: "test", value: 1, active: false, checked: false },
  { name: "test", value: 1, active: false, checked: false },
  { name: "test", value: 1, active: false, checked: false },
  { name: "test", value: 1, active: false, checked: false },
];

function StudentFee() {
  //   const classes = useStyles();

  const [values, setValues] = useState(test);

  const handleOpen = (index) => {
    setValues((prev) =>
      prev.map((obj, i) => {
        if (index == i) return { ...obj, ["active"]: true };
        return obj;
      })
    );
  };

  const handleClose = (index) => {
    setValues((prev) =>
      prev.map((obj, i) => {
        if (index == i) return { ...obj, ["active"]: false };
        return obj;
      })
    );
  };

  const handleCheckbox = (e, i) => {
    const allChecked = values.map((obj) => obj.checked);
    const newChecked = allChecked[i - 1];
    console.log(newChecked);
    if (e.target.checked === true) {
      setValues((prev) =>
        prev.map((obj, index) => {
          if (index === i) return { ...obj, ["checked"]: true };
          return obj;
        })
      );
    } else if (e.target.checked === false) {
      setValues((prev) =>
        prev.map((obj, index) => {
          if (index === i) return { ...obj, ["checked"]: false };
          return obj;
        })
      );
    }
  };

  console.log(values);

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "80%" }}
      >
        <Grid item xs={12} md={2.8}>
          <Paper
            elevation={4}
            sx={{
              padding: "20px",
              background: "	#F0F0F0",
              borderRadius: "15px",
            }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              //   rowSpacing={2}
            >
              <Grid item xs={12} align="center">
                <img
                  src={acharyaLogo}
                  style={{ width: "25%", borderRadius: "8px" }} // Inline styles can be used here
                />
              </Grid>
              <Grid item xs={12} align="center">
                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  Kaushal K V
                </Typography>
                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  AUID12345 (2 / 4)
                </Typography>
              </Grid>

              <Grid item xs={12} mt={2}>
                <Paper
                  elevation={4}
                  sx={{ padding: "10px", borderRadius: "8px" }}
                >
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    rowSpacing={1.2}
                  >
                    {values.map((obj, i) => {
                      return (
                        <>
                          <Grid item xs={12}>
                            <Paper
                              elevation={2}
                              sx={{
                                background: "#F0F0F0",
                                borderRadius: "20px",
                                padding: obj.active ? "10px" : "",
                              }}
                            >
                              <Grid
                                container
                                justifyContent="flex-start"
                                alignItems="center"
                                columnSpacing={1}
                              >
                                <Grid item xs={2} md={2} lg={2}>
                                  <Checkbox
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<CheckCircleIcon />}
                                    onChange={(e) => handleCheckbox(e, i)}
                                    checked={obj.checked}
                                    sx={{
                                      "& .MuiCheckbox-root": {
                                        borderRadius: "50%",
                                        border: "1px solid",
                                        color: "white",
                                        padding: 0,
                                        "&.Mui-checked": {
                                          backgroundColor: "white",
                                          color: "common.white",
                                        },
                                        "& .MuiSvgIcon-root": {
                                          fontSize: 10,
                                        },
                                      },
                                    }}
                                    color="default"
                                    inputProps={{
                                      "aria-label": "custom checkbox",
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={5} md={6} lg={6}>
                                  <Typography variant="subtitle2">
                                    SEM-1
                                  </Typography>
                                </Grid>
                                <Grid item xs={3} md={2} lg={2}>
                                  <Typography variant="subtitle2">
                                    500000
                                  </Typography>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                  {obj.active ? (
                                    <>
                                      <IconButton
                                        onClick={() => handleClose(i)}
                                      >
                                        <ArrowDropUpIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton onClick={() => handleOpen(i)}>
                                        <ArrowDropDownIcon />
                                      </IconButton>
                                    </>
                                  )}
                                </Grid>
                                {obj.active ? (
                                  <>
                                    <Grid item xs={2} md={2}></Grid>
                                    <Grid item xs={6} md={6}>
                                      <Typography variant="subtitle2">
                                        Balance Fee
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={4}>
                                      <Typography variant="subtitle2">
                                        50000
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={2} md={2}></Grid>
                                    <Grid item xs={6} md={6}>
                                      <Typography variant="subtitle2">
                                        Uniform & Stationary Fee
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={4}>
                                      <Typography variant="subtitle2">
                                        50000
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={2} md={2}></Grid>
                                    <Grid item xs={6} md={6}>
                                      <Typography variant="subtitle2">
                                        Special Fee
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={4}>
                                      <Typography variant="subtitle2">
                                        50000
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={2} md={2}></Grid>
                                    <Grid item xs={6} md={6}>
                                      <Typography variant="subtitle2">
                                        Late Fee
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={4}>
                                      <Typography variant="subtitle2">
                                        50000
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={2} md={2}></Grid>
                                    <Grid item xs={6} md={6}>
                                      <Typography variant="subtitle2">
                                        Net Amount
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={4}>
                                      <Typography variant="subtitle2">
                                        50000
                                      </Typography>
                                    </Grid>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </Grid>
                            </Paper>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} mt={2}>
                <CustomTextField name="totalPaying" label="Total Paying" />
              </Grid>
              <Grid item xs={12} mt={2}>
                <CustomTextField name="totalPaying" label="Mobile Number" />
              </Grid>
              <Grid item xs={12} mt={1}>
                <Button variant="contained" sx={{ width: "100%" }}>
                  Pay Now
                </Button>
              </Grid>
              <Grid item xs={12} mt={1}>
                <Button sx={{ width: "100%" }}>Back</Button>
              </Grid>

              <Grid item xs={12} mt={1} md={12} align="center">
                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  For any queries please mail / contact us :
                </Typography>

                <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                  accounts@acharya.ac.in / 6364883311
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentFee;
