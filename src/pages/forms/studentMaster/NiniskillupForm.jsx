import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  Checkbox,
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  styled,
  tableCellClasses,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomModal from "../../../components/CustomModal";
import StudentDetails from "../../../components/StudentDetails";
import BankImportedDataById from "./BankImportedDataById";
import moment from "moment";

const label = { inputprops: { "aria-label": "Checkbox demo" } };

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "grey",
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = {
  auid: "",
  acYearId: null,
  schoolId: null,
  bankId: null,
  ddAmount: "",
  receivedIn: "INR",
  transactionType: "",
  receivedAmount: "",
  transactionAmount: "",
  narration: "",
  ddChequeNo: "",
  bankName: "",
  ddDate: null,
  bankImportedId: "",
  transactionDate: null,
  transactionNo: "",
  bankId: null,
  fromName: "",
  checkAuid: "",
};

const initialValuesOne = {
  voucherId: null,
  payingAmount: 0,
};

const requiredFields = [];

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "5px",
    borderRadius: "2px",
  },
  yearSem: {
    color: theme.palette.error.main,
    border: "1px solid rgba(0, 0, 0, 1)",
    padding: "2px",
    borderRadius: "2px",
  },

  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}));

function NiniskillupForm() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [auidOpen, setAuidOpen] = useState(false);
  const [minimumAmountValidation, setMinimumAmountValidation] = useState(false);
  const [data, setData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [year, setYear] = useState("");

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  const getStudentData = async () => {
    try {
      if (values.auid) {
        const studentResponse = await axios.get(
          `/api/student/studentDetailsByAuid/${values.auid}`
        );
        setStudentData(studentResponse.data.data[0]);
        if (studentResponse.data.data.length > 0) {
          setAuidOpen(true);
          setOpen(true);
          const niniskillUpResponse = await axios.get(
            `/api/finance/cmaDueAmountCalculationOnYearWiseForFeeReceipt/${studentResponse.data.data[0].auid}`
          );

          if (niniskillUpResponse.status === 200) {
            console.log(niniskillUpResponse);

            const years = [];

            if (
              studentResponse.data.data[0].program_type_name.toLowerCase() ===
              "yearly"
            ) {
              setYear(studentResponse.data.data[0].number_of_years);
              for (
                let i = 1;
                i <= studentResponse.data.data[0].number_of_years;
                i++
              ) {
                years.push({
                  key: i,
                  value: "year" + i,
                  label: `Year-${i}`,
                  payingAmount: 0,
                });
              }
            } else if (
              studentResponse.data.data[0].program_type_name.toLowerCase() ===
              "semester"
            ) {
              setYear(studentResponse.data.data[0].number_of_semester);
              for (
                let i = 1;
                i <= studentResponse.data.data[0].number_of_semester;
                i++
              ) {
                years.push({
                  key: i,
                  value: "sem" + i,
                  label: `Sem-${i}`,
                  payingAmount: 0,
                });
              }
            }
            setNoOfYears(years);

            setData(niniskillUpResponse.data.data);
          } else if (niniskillUpResponse.status !== 200) {
            setAuidOpen(false);
            setOpen(false);
            setAlertMessage({
              severity: "error",
              message: "No data found",
            });
            setAlertOpen(true);
          }
        } else {
          setAuidOpen(false);
          setOpen(false);
          setAlertMessage({
            severity: "error",
            message: "No data found",
          });
          setAlertOpen(true);
        }
      }
    } catch (error) {
      console.log(error);

      setAuidOpen(false);
      setOpen(false);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message
          ? error.response.data.message
          : "No data found",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeOne = async (e, i) => {
    const { name, value } = e.target;
    setNoOfYears((prev) =>
      prev.map((obj, index) => {
        if (i === index) return { ...obj, [name]: parseFloat(value) };
        return obj;
      })
    );
  };

  const handleChange = async (e, i) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    const payload = [];
    noOfYears.map((obj) => {
      if (obj.payingAmount > 0)
        payload.push({
          active: true,
          amount: obj.payingAmount,
          student_id: studentData?.student_id,
          school_id: studentData?.school_id,
          paid_year: obj.key,
          receipt_type: "Add On Fee",
          total_amount: noOfYears.reduce(
            (total, sum) => Number(total) + Number(sum.payingAmount),
            0
          ),
        });
    });
    try {
      const response = await axios.post(
        `/api/finance/createMultipleCmaFeeReceipt`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        console.log(response);
        navigate(`/NiniskillupPdf`, { state: { res: response.data.data[0] } });
        setAlertMessage({ severity: "success", message: "Created" });
        setAlertOpen(true);
      } else {
        setAlertMessage({ severity: "error", message: "Error Occured" });
        setAlertOpen(true);
      }
    } catch (error) {
      console.log(error);

      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} md={8}>
        <FormPaperWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={0}
            columnSpacing={{ xs: 2, md: 4 }}
            sx={{ width: "100%" }}
          >
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title={modalContent.title}
              message={modalContent.message}
              buttons={modalContent.buttons}
            />
            <Grid item xs={12} md={2.4}>
              <CustomTextField
                name="auid"
                label="AUID"
                value={values.auid}
                handleChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={getStudentData}
              >
                Submit
              </Button>
            </Grid>

            {open ? (
              <>
                <Grid item xs={12} mt={2}>
                  <StudentDetails id={studentData.auid} />{" "}
                </Grid>
                <Grid item xs={12} mt={2}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "left" }}
                          >
                            Year/Sem
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "left" }}
                          >
                            Total Amount
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "left" }}
                          >
                            Paid
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "left" }}
                          >
                            Due
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ width: 100, textAlign: "center" }}
                          >
                            Paying Now
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {noOfYears.length > 0 &&
                          noOfYears.map((year, i) => {
                            return (
                              <>
                                <TableRow key={i}>
                                  <StyledTableCell sx={{ height: "50px" }}>
                                    <Typography variant="subtitle2">
                                      {year.label}
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ height: "50px" }}>
                                    <Typography variant="subtitle2">
                                      {
                                        data?.["addOnFeeData"]?.[
                                          "addOnFeeSemWiseDueAmount"
                                        ]?.[year.value + "due"]
                                      }
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ height: "50px" }}>
                                    <Typography variant="subtitle2">
                                      {
                                        data?.["addOnFeeData"]?.[
                                          "addOnFeeSemWisePaidAmount"
                                        ]?.[year.value]
                                      }
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ height: "50px" }}>
                                    <Typography variant="subtitle2">
                                      {
                                        data?.["addOnFeeData"]?.[
                                          "addOnFeeSemWiseDueAmount"
                                        ]?.[year.value + "due"]
                                      }
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ width: "25%" }}>
                                    <CustomTextField
                                      name="payingAmount"
                                      inputProps={{
                                        style: { textAlign: "right" },
                                      }}
                                      label=""
                                      value={year.payingAmount}
                                      handleChange={(e) =>
                                        handleChangeOne(e, i)
                                      }
                                    />
                                  </StyledTableCell>
                                </TableRow>
                              </>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} mt={2} align="center">
                  {auidOpen || open ? (
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      // disabled={loading || !minimumAmountValidation}
                      onClick={handleCreate}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>{"Generate"}</strong>
                      )}
                    </Button>
                  ) : (
                    <></>
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </FormPaperWrapper>
      </Grid>
    </Grid>
  );
}

export default NiniskillupForm;
