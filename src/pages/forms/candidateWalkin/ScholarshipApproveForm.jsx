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
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import moment from "moment";
import axiosNoToken from "../../../services/ApiWithoutToken";
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

const initialValues = { remarks: "", approverStatus: "", grandTotal: "" };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const approverStatusList = [
  {
    value: "conditional",
    label: "Conditional",
  },
  {
    value: "unconditional",
    label: "Unconditional",
  },
  {
    value: "reject",
    label: "Reject",
  },
];

function ScholarshipApproveForm({ data, scholarshipId }) {
  const [values, setValues] = useState(initialValues);
  const [feeTemplateData, setFeeTemplateData] = useState(null);
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scholarshipData, setScholarshipData] = useState([]);
  const [expandData, setExpandData] = useState(null);
  const [scholarshipHeadwiseData, setScholarshipHeadwiseData] = useState([]);
  const [isTotalExpand, setIsTotalExpand] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const maxLength = 100;

  useEffect(() => {
    getData();
  }, []);

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
      setValues((prev) => ({
        ...prev,
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
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ScholarshipApproveForm;
