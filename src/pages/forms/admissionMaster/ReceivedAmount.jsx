import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableHead,
} from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "1px solid #DCDCDC",
    textAlign: "center",
    // width: "33.33%",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const initialValues = {
  acYearId: "",
  yearSemId: "",
};

function ReceivedAmount() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [acYearOptions, setAcyearOptions] = useState([]);
  const [tableOpen, setTableOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    acYearId: [values.acYearId !== ""],
    yearSemId: [values.yearSemId !== ""],
  };
  const errorMessages = {
    acYearId: ["This field is required"],
    yearSemId: ["This field required"],
  };

  useEffect(() => {
    getAcYearData();
  }, []);

  const getAcYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        });

        setAcyearOptions(optionData);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      const response = await axios.get(
        `/api/finance/feeTemplateDetailsByAcademicYearAndYearSem/${values.acYearId}/${values.yearSemId}`
      );

      if (response.data.data.length > 0) {
        setTableOpen(true);
        setTableData(response.data.data);
      } else {
        setTableOpen(false);
      }

      console.log(response);
    } catch (err) {
      setTableOpen(false);
      setAlertMessage({ severity: "error", message: err });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            rowSpacing={{ xs: 2, md: 2 }}
            columnSpacing={{ xs: 2, md: 2 }}
            justifyContent="center"
            alignItems="center"
          >
            <>
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="acYearId"
                  label="Ac Year"
                  value={values.acYearId}
                  options={acYearOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.acYearId}
                  errorMessages={errorMessages.acYearId}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomSelect
                  name="yearSemId"
                  label="Year / Sem"
                  value={values.yearSemId}
                  items={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "5" },
                    { value: "6", label: "6" },
                    { value: "7", label: "7" },
                    { value: "8", label: "8" },
                    { value: "9", label: "9" },
                    { value: "10", label: "10" },
                    { value: "11", label: "11" },
                    { value: "12", label: "12" },
                  ]}
                  handleChange={handleChange}
                  required
                  checks={checks.yearSemId}
                  errorMessages={errorMessages.yearSemId}
                />
              </Grid>
              <Grid item xs={12} md={0.5}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                >
                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      <strong>{"SUBMIT"}</strong>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {tableData.length > 0 && tableOpen && (
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>SL No.</StyledTableCell>
                          <StyledTableCell>Fee Template</StyledTableCell>
                          <StyledTableCell>Board Name</StyledTableCell>
                          <StyledTableCell> Amount</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {tableData?.map((obj, i) => {
                          return (
                            <StyledTableRow key={i}>
                              <StyledTableCell>{i + 1}</StyledTableCell>
                              <StyledTableCell>
                                {obj.fee_template_name}
                              </StyledTableCell>
                              <StyledTableCell>
                                {obj.board_unique_name}
                              </StyledTableCell>
                              <TableCell
                                sx={{
                                  fontSize: 14,
                                  border: "1px solid #DCDCDC",
                                  textAlign: "right",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  navigate(`/paid-at-board-school-wise`, {
                                    state: obj.board_unique_id,
                                  })
                                }
                              >
                                <span style={{ color: "#0000FF" }}>
                                  {obj.templateAmount}
                                </span>
                              </TableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default ReceivedAmount;
