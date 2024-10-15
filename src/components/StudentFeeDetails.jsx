import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    // border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    // border: "1px solid rgba(224, 224, 224, 1)",
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
}));

const headerCategories = [
  { label: "Fixed", value: "fixed" },
  { label: "P@B", value: "board" },
  { label: "Scholarship", value: "sch" },
  { label: "ACERP", value: "acerp" },
  { label: "Paid", value: "paid" },
  { label: "Due", value: "due" },
];

function StudentFeeDetails({ id }) {
  const [data, setData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [total, setTotal] = useState();
  const [voucherData, setVoucherData] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFeeData();
  }, []);

  const getFeeData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${id}`
      );
      const {
        fee_template_sub_amount_info: subAmountDetails,
        fee_template_sub_amount_format: subAmount,
        Student_info: studentData,
        scholarship_approval_amount: sch,
        addOnData: acerp,
        fee_template_sub_amount_format: paid,
        dueAmount: due,
      } = response.data;

      const {
        program_type: programType,
        number_of_years: noOfYears,
        number_of_semester: noOfSem,
      } = studentData[0];

      const feeTemp = { program_type_name: "Semester" };
      const totalYearsOrSemesters =
        programType === "Yearly" ? noOfYears * 2 : noOfSem;
      const yearSemesters = [];
      const expands = {};
      for (let i = 1; i <= totalYearsOrSemesters; i++) {
        if (
          feeTemp.program_type_name === "Semester" ||
          (feeTemp.program_type_name === "Yearly" && i % 2 !== 0)
        ) {
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          expands[`year${i}`] = false;
        }
      }

      const totalAmount = {};
      const voucherAmount = {};
      const schAmount = sch[0];
      yearSemesters.forEach((obj) => {
        const { key } = obj;
        const field = `year${key}`;
        const fixedTotal = Object.values(subAmount[key]).reduce(
          (a, b) => a + b
        );
        const paidTotal = Object.values(paid[key]).reduce((a, b) => a + b);
        const dueTotal = Object.values(due[key]).reduce((a, b) => a + b);
        totalAmount[field] = {
          fixed: fixedTotal,
          board: 0,
          sch: schAmount[`${field}_amount`] || 0,
          acerp: acerp[`sem${key}`],
          paid: paidTotal,
          due: dueTotal,
        };

        subAmountDetails.forEach((item, i) => {
          const { voucher_head_new_id: voucherId } = item;
          voucherAmount[field + voucherId] = {
            fixed: subAmount[key][voucherId],
            board: 0,
            sch: (i === 0 && schAmount[`${field}_amount`]) || 0,
            acerp: (i === 0 && acerp[`sem${key}`]) || 0,
            paid: paid[key][voucherId],
            due: due[key][voucherId],
          };
        });
      });

      setNoOfYears(yearSemesters);
      setData(subAmountDetails);
      setIsExpanded(expands);
      setTotal(totalAmount);
      setVoucherData(voucherAmount);
    } catch (err) {
      setError("Failed to load ledger data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        Please wait ....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No data available.
      </Typography>
    );
  }

  const renderFeeDetails = (year) =>
    data?.map((obj, i) => (
      <TableRow key={i} sx={{ transition: "1s" }}>
        <TableCell>
          <Typography variant="subtitle2" color="textSecondary">
            {obj.voucher_head}
          </Typography>
        </TableCell>
        {headerCategories.map((category, j) => (
          <TableCell key={j} sx={{ textAlign: "right" }}>
            <Typography variant="subtitle2" color="textSecondary">
              {
                voucherData[`year${year}${obj.voucher_head_new_id}`][
                  category.value
                ]
              }
            </Typography>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    ));

  const handleExpand = (value) => {
    setIsExpanded((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  return (
    <Box>
      {noOfYears.map((obj, i) => (
        <TableContainer key={i} component={Paper} sx={{ marginBottom: 2 }}>
          <Table size="small">
            <TableBody>
              <StyledTableRow>
                <TableCell>
                  <Typography variant="subtitle2">{obj.value}</Typography>
                </TableCell>
                {headerCategories.map((category, j) => (
                  <TableCell key={j} sx={{ textAlign: "right" }}>
                    <Typography variant="subtitle2">
                      {category.label}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell sx={{ width: "2% !important" }}>
                  <IconButton
                    onClick={() => handleExpand(`year${obj.key}`)}
                    sx={{ padding: 0, transition: "1s" }}
                  >
                    {isExpanded[`year${obj.key}`] ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    )}
                  </IconButton>
                </TableCell>
              </StyledTableRow>
              {isExpanded[`year${obj.key}`] && renderFeeDetails(obj.key)}
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Total</Typography>
                </TableCell>
                {headerCategories.map((categories, k) => (
                  <TableCell key={k} sx={{ textAlign: "right" }}>
                    <Typography variant="subtitle2">
                      {total[`year${obj.key}`][categories?.value]}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
}

export default StudentFeeDetails;
