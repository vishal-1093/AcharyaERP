import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const allTest = {
  0: {
    uniform_dues_array: { 1: 0, 2: 0, 3: 2000, 4: 0, 5: 2000, 6: 0 },
    fee_template_amount_cma: {
      1: "0.0",
      2: "0.0",
      3: "2832.0",
      4: 0,
      5: 0,
      6: 0,
    },
    course_id: "6",
    student_id: "47772",
    no_of_years: "3",
    cp_ins: "31",
    remains_years: 1,
    total_amount: 168600,
    father_name: "Suresh Balraj",
    auid: "AGS23BACR010",
    mobile: "8296728807",
    student_name: "Thaniya",
    acerp_email: "thaniya.23.bacr@acharya.ac.in",
    current_year: "2",
    current_sem: "3",
    fee_template_amount: {
      1: "0.0",
      2: "0.0",
      3: "46300.0",
      4: 35000,
      5: 52300,
      6: 35000,
    },
    course_type: "2",
    latefee: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    discount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  },
  1: 200,
  fine_concession: 0,
  ac_year_id: "17",
  part_flag: null,
  creditap_status: 0,
  oldac: 0,
  current_due_amount: "46300.0",
  lock_till: "3",
  fee_course_type_id: "2",
  hostel_due: 0,
  transport_due: 0,
  hostel_details: [],
  transport_details: [],
  due_date: "2024-09-10",
  pay_flag: 1,
  headerStatus: 200,
};

const array = [];
Object.keys(allTest[0].uniform_dues_array).map((obj, i) => {
  const year = i + 1;
  Object.values(allTest[0].uniform_dues_array).map((obj1, j) => {
    Object.values(allTest[0].fee_template_amount_cma).map((obj2, k) => {
      Object.values(allTest[0].latefee).map((obj3, l) => {
        Object.values(allTest[0].fee_template_amount).map((obj4, m) => {
          if (i === j && j === k && k === l && l === m) {
            array.push({
              ["SEM" + year]: obj,
              uniform_due: obj1,
              balance_fee: obj2,
              late_fee: obj3,
              fee_template: obj4,
              active: false,
              checked: false,
              total_due:
                Number(obj1) + Number(obj2) + Number(obj3) + Number(obj4),
            });
          }
        });
      });
    });
  });
});

function StudentExamFee() {
  const [values, setValues] = useState(array);
  const [totalPay, setTotalPay] = useState([]);

  useEffect(() => {
    const temp = [];
    values.map((obj) => {
      if (obj.checked) {
        temp.push(obj.total_due);
      }
    });
    setTotalPay(temp);
  }, [values]);

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
                  style={{ width: "25%", borderRadius: "8px" }}
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
                  sx={{ padding: "12px", borderRadius: "8px" }}
                >
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    rowSpacing={1}
                  >
                    {values.map((obj, i) => {
                      const year = i + 1;
                      return (
                        <>
                          {obj.total_due > 0 ? (
                            <Grid item xs={12} key={i}>
                              <Accordion
                                sx={{
                                  background: "#F0F0F0",
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1-content"
                                  id="panel1-header"
                                >
                                  <Typography variant="subtitle2">
                                    {"SEM" + year}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Grid
                                    container
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    rowSpacing={1}
                                  >
                                    <Grid item xs={12}>
                                      <CustomTextField label="Misc" />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField label="Exam Fee" />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField label="Reval Fee" />
                                    </Grid>
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            </Grid>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} mt={2}>
                <CustomTextField
                  name="totalPaying"
                  label="Total Paying"
                  value={totalPay.reduce((a, b) => Number(a) + Number(b), 0)}
                />
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
export default StudentExamFee;
