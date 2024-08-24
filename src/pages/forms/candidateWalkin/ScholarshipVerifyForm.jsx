import { Fragment, useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useNavigate } from "react-router-dom";
import ScholarshipDetails from "./ScholarshipDetails";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = { remarks: "" };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function ScholarshipVerifyForm({ data, scholarshipId }) {
  const [values, setValues] = useState(initialValues);
  const [feeTemplateData, setFeeTemplateData] = useState(null);
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scholarshipData, setScholarshipData] = useState([]);
  const [expandData, setExpandData] = useState(null);
  const [verifiedTotal, setVerifiedTotal] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const maxLength = 100;

  useEffect(() => {
    getData();
  }, []);

  const getGrandTotal = () => {
    const { verifiedData } = values;

    if (verifiedData) {
      const sum = Object.values(verifiedData).reduce((sum, obj) => {
        const total = Object.values(obj).reduce(
          (a, b) => Number(a) + Number(b),
          0
        );
        return sum + total;
      }, 0);

      setVerifiedTotal(sum);
    }
  };

  useEffect(() => {
    getGrandTotal();
  }, [values.verifiedData]);

  const getData = async () => {
    try {
      const [feeTemplateResponse, subAmountResponse, scholarshipResponse] =
        await Promise.all([
          axios.get(
            `/api/finance/FetchAllFeeTemplateDetail/${data.fee_template_id}`
          ),
          axios.get(
            `/api/finance/FetchFeeTemplateSubAmountDetail/${data.fee_template_id}`
          ),
          axios.get(`/api/student/fetchScholarship2/${scholarshipId}`),
        ]);

      const feeTemplateData = feeTemplateResponse.data.data[0];
      const feeTemplateSubAmtData = subAmountResponse.data.data;
      const schData = scholarshipResponse.data.data[0];

      const yearSemesters = [];
      const scholarshipData = {};
      const totalYearsOrSemesters =
        data.program_type_name === "Yearly"
          ? data.number_of_years * 2
          : data.number_of_semester;

      for (let i = 1; i <= totalYearsOrSemesters; i++) {
        yearSemesters.push({ key: i, value: `Sem ${i}` });
        scholarshipData[`year${i}`] = "";
      }

      const expandTempData = {};
      const headwiseMapping = {};
      const headwiseSubAmount = {};

      feeTemplateSubAmtData.forEach((obj) => {
        expandTempData[obj.voucher_head_new_id] = false;
        headwiseMapping[obj.voucher_head_new_id] = scholarshipData;
        const subAmountMapping = {};
        yearSemesters.forEach((obj1) => {
          subAmountMapping["year" + obj1.key] = obj["year" + obj1.key + "_amt"];
        });
        headwiseSubAmount[obj.voucher_head_new_id] = subAmountMapping;
      });

      setFeeTemplateData(feeTemplateData);
      setFeeTemplateSubAmountData(feeTemplateSubAmtData);
      setNoOfYears(yearSemesters);
      setYearwiseSubAmount(headwiseSubAmount);
      setScholarshipData(schData);
      setExpandData(expandTempData);
      setValues((prev) => ({
        ...prev,
        verifiedData: headwiseMapping,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load fee template details!",
      });
      setAlertOpen(true);
    }
  };

  if (!feeTemplateData) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No Fee Template data available.
      </Typography>
    );
  }

  const handleExpandData = (id) => {
    setExpandData((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getYearwiseVerifiedTotal = (id) => {
    const { verifiedData } = values;
    return Object.values(verifiedData[id])
      .map((obj) => Number(obj) || 0)
      .reduce((a, b) => a + b, 0);
  };

  const handleChangeScholarship = (e) => {
    const { name, value } = e.target;
    const [key, field] = name.split("-");

    if (/^[A-Za-z]+$/.test(value)) return;

    const parsedValue = Number(value);

    const newValue = !isNaN(parsedValue)
      ? Math.min(parsedValue, yearwiseSubAmount[key][field])
      : 0;

    setValues((prev) => ({
      ...prev,
      verifiedData: {
        ...prev.verifiedData,
        [key]: {
          ...prev.verifiedData[key],
          [field]: newValue,
        },
      },
    }));
  };

  const handleChange = (e) => {
    if (e.target.value.length > maxLength) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const getVerifiedTotalTotal = (value) => {
    const { verifiedData } = values;
    return Object.values(verifiedData).reduce(
      (sum, obj) => sum + (Number(obj[value]) || 0),
      0
    );
  };

  const renderVerifiedTotal = (value, key) => (
    <TableCell key={key} align="right">
      <Typography variant="subtitle2">
        {getVerifiedTotalTotal(value)}
      </Typography>
    </TableCell>
  );

  const handleCreate = async () => {
    const { verifiedData, remarks } = values;
    try {
      setIsLoading(true);
      const postData = [];

      Object.keys(verifiedData).forEach((obj) => {
        noOfYears.forEach((yearSem) => {
          const amount = Number(verifiedData[obj][`year${yearSem.key}`]) || 0;
          if (amount > 0) {
            postData.push({
              active: true,
              amount: amount,
              scholarship_id: scholarshipData.scholarship_id,
              scholarship_year: Number(yearSem.key),
              voucher_head_new_id: Number(obj),
            });
          }
        });
      });

      const response = await axios.get(
        `/api/student/scholarshipapprovalstatus/${scholarshipData.scholarship_approved_status_id}`
      );
      const updateData = response.data.data;
      updateData.verified_by = userId;
      updateData.is_verified = "yes";
      updateData.verified_date = moment();
      updateData.verified_amount = verifiedTotal;
      updateData.verifier_remarks = remarks;

      noOfYears.forEach(({ key }) => {
        const total = Object.values(verifiedData).reduce(
          (sum, obj) => sum + (Number(obj[`year${key}`]) || 0),
          0
        );

        updateData[`year${key}_amount`] = total;
      });

      const scholarshipTemp = { sas: updateData };

      const [headwiseResponse, updateResponse] = await Promise.all([
        axios.post("/api/student/scholarshipHeadWiseAmountDetails", postData),
        axios.put(
          `/api/student/updateScholarshipStatus/${scholarshipData.scholarship_id}`,
          scholarshipTemp
        ),
      ]);

      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Scholarship verification completed successfully !!",
        });
        setAlertOpen(true);
        navigate("/verify-scholarship", { replace: true });
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to verify !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeaderCells = (label, key, align) => (
    <StyledTableCell key={key} align={align}>
      <Typography variant="subtitle2">{label}</Typography>
    </StyledTableCell>
  );

  const renderBodyCells = (label, key, align) => (
    <TableCell key={key} align={align}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </TableCell>
  );

  const renderIconCells = (id) => (
    <TableCell sx={{ width: "2% !important" }}>
      <IconButton
        onClick={() => handleExpandData(id)}
        sx={{ padding: 0, transition: "1s" }}
      >
        {expandData[id] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </IconButton>
    </TableCell>
  );

  const renderTextInput = (id) => (
    <TableRow>
      <TableCell />
      {noOfYears.map((obj, i) => {
        return (
          <TableCell key={i} align="right">
            <CustomTextField
              name={`${id}-year${obj.key}`}
              value={values.verifiedData[id][`year${obj.key}`]}
              handleChange={handleChangeScholarship}
              disabled={
                obj.key % 2 === 0 &&
                feeTemplateData.program_type_name === "Yearly"
              }
              sx={{
                "& .MuiInputBase-root": {
                  "& input": {
                    textAlign: "right",
                  },
                },
              }}
            />
          </TableCell>
        );
      })}
      <TableCell align="right">
        <Typography variant="subtitle2">
          {getYearwiseVerifiedTotal(id)}
        </Typography>
      </TableCell>
      <TableCell />
    </TableRow>
  );

  return (
    <Box>
      <Grid container rowSpacing={4} columnSpacing={4}>
        <Grid item xs={12}>
          <ScholarshipDetails scholarshipData={scholarshipData} />
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {renderHeaderCells("Particulars")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(obj.value, i, "right")
                  )}
                  {renderHeaderCells("Total", 0, "right")}
                  <StyledTableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {feeTemplateSubAmountData.map((obj, i) => {
                  return (
                    <Fragment key={i}>
                      <TableRow>
                        {renderBodyCells(obj.voucher_head)}
                        {noOfYears.map((cell, j) =>
                          renderBodyCells(
                            obj[`year${cell.key}_amt`],
                            j,
                            "right"
                          )
                        )}
                        {renderHeaderCells(obj.total_amt, 0, "right")}
                        {renderIconCells(obj.voucher_head_new_id)}
                      </TableRow>
                      {expandData[obj.voucher_head_new_id] &&
                        renderTextInput(obj.voucher_head_new_id)}
                    </Fragment>
                  );
                })}

                <TableRow>
                  {renderHeaderCells("Total")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(
                      feeTemplateSubAmountData[0][`fee_year${obj.key}_amt`],
                      i,
                      "right"
                    )
                  )}
                  {renderHeaderCells(
                    feeTemplateData.fee_year_total_amount,
                    0,
                    "right"
                  )}
                  <TableCell />
                </TableRow>

                <TableRow>
                  {renderHeaderCells("Requested")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(
                      scholarshipData[`year${obj.key}_amount`],
                      i,
                      "right"
                    )
                  )}
                  {renderHeaderCells(
                    scholarshipData.prev_approved_amount,
                    0,
                    "right"
                  )}
                  <TableCell />
                </TableRow>

                <TableRow>
                  {renderHeaderCells("Verified")}
                  {noOfYears.map((obj, i) =>
                    renderVerifiedTotal(`year${obj.key}`, i)
                  )}
                  <TableCell align="right">
                    <Typography variant="subtitle2">{verifiedTotal}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="remarks"
            label="Remarks"
            value={values.remarks}
            handleChange={handleChange}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "remarks"
            )}`}
            multiline
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            disabled={isLoading || values.remarks === ""}
            onClick={handleCreate}
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Verify"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ScholarshipVerifyForm;
