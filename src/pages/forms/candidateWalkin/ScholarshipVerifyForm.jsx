import { Fragment, useCallback, useEffect, useState } from "react";
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
import CustomModal from "../../../components/CustomModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = { remarks: "", grandTotal: "" };

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
  const [isTotalExpand, setIsTotalExpand] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const maxLength = 150;

  useEffect(() => {
    getData();
  }, []);

  const getGrandTotal = useCallback(() => {
    const { verifiedData, id, year } = values;

    if (verifiedData) {
      let status = false;
      const yearlyTotals = {};
      Object.keys(year).forEach((year) => {
        const sum = Object.values(verifiedData).reduce(
          (acc, record) => Number(acc) + Number(record[year]),
          0
        );
        yearlyTotals[year] = sum;
        if (sum > scholarshipData[`${year}_amount`]) {
          status = true;
        }
      });

      const idTotals = {};
      Object.keys(id).forEach((id) => {
        const sum = Object.values(verifiedData[id]).reduce(
          (acc, value) => Number(acc) + Number(value),
          0
        );
        idTotals[id] = sum;
      });

      const grandTotal = Object.values(idTotals).reduce(
        (a, b) => Number(a) + Number(b)
      );

      if (status) {
        setAlertMessage({
          severity: "error",
          message:
            "You have approved a scholarship amount that exceeds the requested amount for the year !!",
        });
        setAlertOpen(true);
      }
      setValues((prev) => ({
        ...prev,
        id: idTotals,
        year: yearlyTotals,
        grandTotal: grandTotal,
      }));
    }
  }, [values]);

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
        if (
          feeTemplateData.program_type_name === "Semester" ||
          (feeTemplateData.program_type_name === "Yearly" && i % 2 !== 0)
        )
          yearSemesters.push({ key: i, value: `Sem ${i}` });
        scholarshipData[`year${i}`] = "";
      }

      const expandTempData = {};
      const headwiseMapping = {};
      const headwiseSubAmount = {};
      const yearwiseTotal = {};
      const headwiseTotal = {};

      feeTemplateSubAmtData.forEach((obj) => {
        const { voucher_head_new_id } = obj;
        expandTempData[voucher_head_new_id] = false;
        headwiseMapping[voucher_head_new_id] = scholarshipData;
        const subAmountMapping = {};
        yearSemesters.forEach((obj1) => {
          subAmountMapping[`year${obj1.key}`] = obj[`year${obj1.key}_amt`];
          yearwiseTotal[`year${obj1.key}`] = 0;
        });
        headwiseSubAmount[voucher_head_new_id] = subAmountMapping;
        headwiseTotal[voucher_head_new_id] = 0;
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
        id: headwiseTotal,
        year: yearwiseTotal,
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

  const handleChangeScholarship = (e) => {
    const { name, value } = e.target;
    const [key, field] = name.split("-");

    if (/^[A-Za-z]+$/.test(value)) return;

    const parsedValue = Number(value);

    const newValue = !isNaN(parsedValue)
      ? Math.min(
          parsedValue,
          scholarshipData[`${field}_amount`],
          yearwiseSubAmount[key][field]
        )
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
    const { name, value } = e.target;
    if (value.length > maxLength) return;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const renderVerifiedTotal = (value, key) => (
    <TableCell key={key} align="right">
      <Typography variant="subtitle2">{values.year[value]}</Typography>
    </TableCell>
  );

  const handleTotalExpand = () => {
    const temp = Object.keys(expandData).reduce((acc, key) => {
      acc[key] = !isTotalExpand;
      return acc;
    }, {});
    setExpandData(temp);
    setIsTotalExpand((prev) => !prev);
  };

  const handleCreate = async () => {
    const { verifiedData, remarks, grandTotal } = values;
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
      updateData.verified_amount =
        grandTotal === 0 ? scholarshipData.requested_scholarship : grandTotal;
      updateData.verifier_remarks = remarks;

      noOfYears.forEach(({ key }) => {
        const total = Object.values(verifiedData).reduce(
          (sum, obj) => sum + (Number(obj[`year${key}`]) || 0),
          0
        );

        updateData[`year${key}_amount`] = total;
      });

      const scholarshipTemp = { sas: updateData };

      const [headwiseResponse, headwiseHistoryResponse, updateResponse] =
        await Promise.all([
          axios.post(
            "/api/student/saveScholarshipVoucherHeadWiseAmountDetailsHistory",
            postData
          ),
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

  const handleSubmit = () => {
    if (values.grandTotal === 0) {
      setAlertMessage({
        severity: "error",
        message: "Please assign the scholarship to one of the voucher heads !!",
      });
      setAlertOpen(true);
    } else if (values.grandTotal > scholarshipData.requested_scholarship) {
      setAlertMessage({
        severity: "error",
        message:
          "You have approved a scholarship amount that exceeds the requested amount !!",
      });
      setAlertOpen(true);
    } else {
      setConfirmContent({
        title: "",
        message: "Would you like to confirm?",
        buttons: [
          { name: "Yes", color: "primary", func: handleCreate },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmOpen(true);
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
        <Typography variant="subtitle2">{values.id[id]}</Typography>
      </TableCell>
      <TableCell />
    </TableRow>
  );

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

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
                    <StyledTableCell sx={{ width: "2% !important" }}>
                      <IconButton
                        onClick={handleTotalExpand}
                        sx={{ padding: 0, transition: "1s" }}
                      >
                        {isTotalExpand ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </IconButton>
                    </StyledTableCell>
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
                      <Typography variant="subtitle2">
                        {values.grandTotal}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" display="inline">
              Requested Remarks :&nbsp;
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="inline"
            >
              {scholarshipData.requestedByRemarks}
            </Typography>
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
              onClick={handleSubmit}
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
    </>
  );
}

export default ScholarshipVerifyForm;
