import { Fragment, useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
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
  "Fixed",
  "P@B",
  "Scholarship",
  "ACERP",
  "Paid",
  "Due",
];

function StudentFeeDetails({ id }) {
  const [noOfYears, setNoOfYears] = useState([]);
  const [data, setData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getFeeData();
  }, []);

  const getFeeData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${id}`
      );
      const responseData = response.data;
      const {
        program_type: programType,
        number_of_years: noOfYears,
        number_of_semester: noOfSem,
      } = responseData.Student_info[0];

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
      setNoOfYears(yearSemesters);
      setData(responseData);
      setIsExpanded(expands);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const renderFeeDetails = (year) =>
    data?.fee_template_sub_amount_info?.map((obj, i) => (
      <TableRow key={i} sx={{ transition: "1s" }}>
        <TableCell>
          <Typography variant="subtitle2" color="textSecondary">
            {obj.voucher_head}
          </Typography>
        </TableCell>
        {headerCategories.map((category, j) => (
          <TableCell key={j} sx={{ textAlign: "right" }}>
            <Typography variant="subtitle2" color="textSecondary">
              {category === "Fixed" ? obj[`year${year}_amt`] : 0}
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
                    <Typography variant="subtitle2">{category}</Typography>
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
                    <Typography variant="subtitle2">1000</Typography>
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
