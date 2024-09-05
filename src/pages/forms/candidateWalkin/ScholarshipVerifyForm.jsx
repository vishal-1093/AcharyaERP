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

const initialValues = { remarks: "", verifiedData: {}, grandTotal: 0 };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function ScholarshipVerifyForm({ data, scholarshipId }) {
  const [values, setValues] = useState(initialValues);
  const [feeTemplateData, setFeeTemplateData] = useState(null);
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scholarshipData, setScholarshipData] = useState([]);
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

  const getTotal = () => {
    const { verifiedData } = values;
    const scholarshipValues = Object.values(verifiedData);

    if (scholarshipValues.length > 0) {
      const total = scholarshipValues.reduce((acc, val) => {
        const num = Number(val) || 0;
        return acc + (num > 0 ? num : 0);
      }, 0);
      setValues((prev) => ({
        ...prev,
        grandTotal: total,
      }));
    }
  };

  useEffect(() => {
    getTotal();
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
      const yearwiseSubAmountMapping = {};
      const totalYearsOrSemesters =
        data.program_type_name === "Yearly"
          ? data.number_of_years * 2
          : data.number_of_semester;

      for (let i = 1; i <= totalYearsOrSemesters; i++) {
        if (
          (feeTemplateData.program_type_name === "Semester" ||
            (feeTemplateData.program_type_name === "Yearly" && i % 2 !== 0)) &&
          Number(schData[`year${i}_amount`]) !== 0
        ) {
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          scholarshipData[`year${i}`] = schData[`year${i}_amount`] || 0;
          yearwiseSubAmountMapping[`year${i}`] =
            feeTemplateSubAmtData[0][`fee_year${i}_amt`];
        }
      }

      const rowTot = {};
      feeTemplateSubAmtData.forEach((obj) => {
        const { voucher_head_new_id } = obj;
        const subAmountMapping = {};
        yearSemesters.forEach((obj1) => {
          subAmountMapping[`year${obj1.key}`] = obj[`year${obj1.key}_amt`];
        });
        rowTot[voucher_head_new_id] = Object.values(subAmountMapping).reduce(
          (a, b) => a + b
        );
      });
      const templateTotal = Object.values(rowTot).reduce((a, b) => a + b);

      setFeeTemplateData(feeTemplateData);
      setFeeTemplateSubAmountData(feeTemplateSubAmtData);
      setNoOfYears(yearSemesters);
      setYearwiseSubAmount(yearwiseSubAmountMapping);
      setScholarshipData(schData);
      setValues((prev) => ({
        ...prev,
        verifiedData: scholarshipData,
        rowTotal: rowTot,
        total: templateTotal,
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

  const handleChangeScholarship = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;

    const { verifiedData } = values;

    const newValue = Math.min(Number(value), yearwiseSubAmount[name]);

    console.log("newValue :>> ", newValue);
    setValues((prev) => ({
      ...prev,
      verifiedData: {
        ...verifiedData,
        [name]: newValue,
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

  const handleCreate = async () => {
    const { verifiedData, remarks, grandTotal } = values;
    try {
      setIsLoading(true);

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
        updateData[`year${key}_amount`] = verifiedData[`year${key}`];
      });

      const updateResponse = await axios.put(
        `/api/student/updateScholarshipStatus/${scholarshipData.scholarship_approved_status_id}`,
        { sas: updateData }
      );

      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Scholarship verification completed successfully !!",
        });
        setAlertOpen(true);
        navigate("/verify-scholarship", { replace: true });
      }
    } catch (err) {
      console.error(err);

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
        message: "Please enter the verified amount !!",
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

  const renderTextInput = () => {
    return noOfYears.map((obj, i) => {
      return (
        <TableCell key={i} align="right">
          <CustomTextField
            name={`year${obj.key}`}
            value={values.verifiedData[`year${obj.key}`]}
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
    });
  };

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
                          {renderHeaderCells(
                            values.rowTotal[obj.voucher_head_new_id],
                            0,
                            "right"
                          )}
                        </TableRow>
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
                    {renderHeaderCells(values.total, 0, "right")}
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
                  </TableRow>

                  <TableRow>
                    {renderHeaderCells("Verified")}
                    {renderTextInput()}
                    {renderHeaderCells(values.grandTotal, 0, "right")}
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
