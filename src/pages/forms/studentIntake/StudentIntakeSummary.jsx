import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTable from "../../../components/CustomTable";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "8px",
    textAlign: "center",
    borderRadius: 4,
  },
  border: {
    borderRight: "1px solid rgba(0,0,0,0.2)",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const tableHeaders = ["Name", "AUID"];

function StudentIntakeSummary({}) {
  const [values, setValues] = useState({ acYearId: null });
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [academicYearName, setAcademicYearName] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [total, setTotal] = useState();
  const [studentslistOpen, setStudentslistOpen] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]);

  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/studentintakemaster/summary") {
      setCrumbs([
        { name: "Student Intake", link: "/StudentIntakeMaster/Summary" },
      ]);
    }
    getAcademicYearOptions();
    getIntakeSummaryData();
  }, [values.acYearId]);

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getIntakeSummaryData = async () => {
    if (values.acYearId)
      await axios
        .get(
          `/api/academic/intakeAssignmentAndPermitDetails/${values.acYearId}`
        )
        .then((res) => {
          const add = [];
          let sum = 0;
          setSummaryData(res.data.data);
          res.data.data.forEach((obj) => {
            add.push(obj.intake_permit);
          });
          add.forEach((item) => {
            sum = sum + item;
          });
          setTotal(sum);
        })
        .catch((error) => console.error(error));
  };

  const handleChangeAdvance = async (name, newValue) => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.ac_year_id === newValue) {
            setAcademicYearName(obj.ac_year);
          }
        });
      })
      .catch((error) => console.error(error));
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleOpen = async (obj) => {
    setStudentslistOpen(true);

    await axios
      .get(
        `/api/academic/getAssignedIntakeStudentDetails/${obj.fee_admission_sub_category_id}`
      )
      .then((res) => {
        const temp = [];
        res.data.data.forEach((obj) => {
          temp.push({
            ["student_name"]: obj.student_name,
            ["auid"]: obj.auid,
          });
        });
        setStudentOptions(temp);
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box component="form" p={1}>
        <ModalWrapper
          title="Student List"
          maxWidth={600}
          open={studentslistOpen}
          setOpen={setStudentslistOpen}
        >
          <Grid container justifyContent="flex-start" alignItems="center">
            <Grid item xs={12}>
              <CustomTable
                tableHeaders={tableHeaders}
                tableBody={studentOptions}
              />
            </Grid>
          </Grid>
        </ModalWrapper>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={3} textAlign="center">
              <CustomAutocomplete
                name="acYearId"
                label="Academic Year"
                value={values.acYearId}
                options={academicYearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-start">
            {values.acYearId ? (
              <>
                <Grid item xs={12} md={12} mt={4}>
                  <Typography variant="h6" className={classes.bg}>
                    Admission Category Master {academicYearName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} mt={2}>
                  <TableContainer component={Paper} className={classes.border}>
                    <Table size="small">
                      <TableHead className={classes.bg}>
                        <StyledTableRow>
                          <StyledTableCell sx={{ color: "white" }}>
                            SL.No
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: "white" }}>
                            Sub Category
                          </StyledTableCell>

                          <StyledTableCell sx={{ color: "white" }}>
                            Intake
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: "white" }}>
                            Admitted
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: "white" }}>
                            Vacant
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {summaryData.map((obj, i) => {
                          return (
                            <StyledTableRow key={i}>
                              <StyledTableCell>{i + 1}</StyledTableCell>
                              <StyledTableCell>
                                {obj.fee_admission_sub_category_name}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{
                                  color: (theme) => theme.palette.primary.main,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleOpen(obj)}
                              >
                                {obj.intake_permit}
                              </StyledTableCell>
                              <StyledTableCell>
                                {obj.admitted ? obj.admitted : 0}
                              </StyledTableCell>
                              <StyledTableCell>
                                {obj.vacant ? obj.vacant : 0}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                        <StyledTableRow>
                          <StyledTableCell colSpan={2}>Total</StyledTableCell>
                          <StyledTableCell>{total}</StyledTableCell>
                          <StyledTableCell>0</StyledTableCell>
                          <StyledTableCell>0</StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default StudentIntakeSummary;
