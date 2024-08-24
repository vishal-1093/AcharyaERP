import { useEffect, useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getFeeData();
  }, []);

  const getFeeData = async () => {
    try {
      const response = await axios.get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${id}`
      );
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const renderFeeDetails = () => {
    return (
      <>
        <TableRow sx={{ transition: "1s" }}>
          <TableCell>
            <Typography variant="subtitle2" color="textSecondary">
              Tution Fee
            </Typography>
          </TableCell>
          {headerCategories.map((header) => (
            <TableCell sx={{ textAlign: "right" }}>
              <Typography variant="subtitle2" color="textSecondary">
                1000
              </Typography>
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>

        <TableRow sx={{ transition: "1s" }}>
          <TableCell>
            <Typography variant="subtitle2" color="textSecondary">
              Campus Development Fee
            </Typography>
          </TableCell>
          {headerCategories.map((header) => (
            <TableCell sx={{ textAlign: "right" }}>
              <Typography variant="subtitle2" color="textSecondary">
                1000
              </Typography>
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <Box>
      <TableContainer component={Paper} elevation={2} sx={{ marginBottom: 2 }}>
        <Table size="small">
          <TableBody>
            <StyledTableRow>
              <TableCell>
                <Typography variant="subtitle2">Year 1</Typography>
              </TableCell>
              {headerCategories.map((header) => (
                <TableCell sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2">{header}</Typography>
                </TableCell>
              ))}
              <TableCell sx={{ width: "2% !important" }}>
                <IconButton
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{ padding: 0, transition: "1s" }}
                >
                  {isExpanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </TableCell>
            </StyledTableRow>

            {isExpanded ? renderFeeDetails() : <></>}

            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Total</Typography>
              </TableCell>
              {headerCategories.map((header) => (
                <TableCell sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2">1000</Typography>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableBody>
            <StyledTableRow>
              <TableCell>
                <Typography variant="subtitle2">Year 2</Typography>
              </TableCell>
              {headerCategories.map((header) => (
                <TableCell sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2">{header}</Typography>
                </TableCell>
              ))}
              <TableCell sx={{ width: "2% !important" }}>
                <IconButton
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{ padding: 0, transition: "1s" }}
                >
                  {isExpanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </TableCell>
            </StyledTableRow>

            {isExpanded ? renderFeeDetails() : <></>}

            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Total</Typography>
              </TableCell>
              {headerCategories.map((header) => (
                <TableCell sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2">1000</Typography>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StudentFeeDetails;
