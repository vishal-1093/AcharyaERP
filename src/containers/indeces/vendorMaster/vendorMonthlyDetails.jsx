import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableFooter,
  Box,
  Button,
  Breadcrumbs,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../services/Api';
import useBreadcrumbs from '../../../hooks/useBreadcrumbs';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PrintIcon from '@mui/icons-material/Print';
import moment from 'moment';
import { BlobProvider } from '@react-pdf/renderer';
import LedgerMonthlyTransactionPdf from './LedgerMonthlyTransactionPdf';

const HeadTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '2px solid #e0e0e0',
  fontWeight: "bold",
  backgroundColor: "#376a7d",
  color: "#fff",
  fontSize: "16px !important",
  fontFamily: "Bookman Old Style",
  width: "20%",
  padding: '8px 16px !important',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  borderBottom: '1px solid #e0e0e0',
  padding: theme.spacing(1),
  border: "1px solid rgba(224, 224, 224, 1)",
  fontSize: '15px',
  fontFamily: "Bookman Old Style !important",
  width: "20%",
  '@media print': {
    fontSize: '16px !important',
    fontFamily: 'Bookman Old Style !important',
    padding: '8px 16px !important',
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #e0e0e0',
  padding: theme.spacing(1),
  border: "1px solid rgba(224, 224, 224, 1)",
  fontSize: '15px',
  fontFamily: "Bookman Old Style",
  width: "20%",
}));

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 10,
    width: "fit-content",
    zIndex: theme.zIndex.drawer - 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
  },
}));

const columns = [
  { field: 'month', headerName: 'Month', width: '20%' },
  { field: 'openingBalance', headerName: 'Opening Balance', width: '20%' },
  { field: 'debit', headerName: 'Debit', width: '20%' },
  { field: 'credit', headerName: 'Credit', width: '20%' },
  { field: 'closingBalance', headerName: 'Closing Balance', width: '20%' }
]

const VendorMonthlyDetails = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [breadCrumbs, setBreadCrumbs] = useState([])
  const [isPrint, setIsPrint] = useState(false)
  const location = useLocation()
  const queryValues = location.state;
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [currFcYear, setCurrFcYear] = useState({
    fcYearId: queryValues?.fcYearId,
    fcYear: queryValues?.fcYear
  })
  const filters = {
    voucherHeadName: queryValues?.voucherHeadName || "Yes Bank",
    fcYear: currFcYear?.fcYear || "2025-2026",
    asOnDate: moment().format('DD-MM-YYYY')
  };

  useEffect(() => {
    setBreadCrumbs([
      { name: "Ledger", link: "/Accounts-ledger", state: queryValues },
      { name: "Monthly Transaction" }
    ])
    setCrumbs([])
  }, [])

  useEffect(() => {
    getData()
  }, [currFcYear?.fcYearId])

  const getData = async () => {
    const { voucherHeadId, fcYearId, schoolId } = queryValues
    const baseUrl = "/api/finance/getLedgerSummaryMonthlyWise"
    const params = {
      ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
      ...(fcYearId && { fcYearId: currFcYear?.fcYearId }),
      ...(schoolId && { schoolId })
    }
    setLoading(true)
    await axios
      .get(baseUrl, { params })
      .then((res) => {
        const { data } = res?.data
        const rowData = []
        data?.vendorDetails?.length > 0 && data?.vendorDetails?.forEach(el => {
          rowData.push({
            //  closingBalance: el?.closingBalance < 0 ? `${el?.closingBalance} Cr` : el?.closingBalance === 0 ? 0 : `${el?.closingBalance} Dr`,
            credit: el?.credit,
            debit: el?.debit,
            month_name: el?.month_name,
            school_id: el?.school_id,
            month: el?.month,
            // openingBalance: el?.openingBalance < 0 ? `${el?.openingBalance} Cr` : el?.openingBalance === 0 ? 0 : `${el?.openingBalance} Dr`
            openingBalance: el?.openingBalance < 0
              ? `${Math.abs(el?.openingBalance)} Cr`
              : el?.openingBalance === 0
                ? 0
                : `${el?.openingBalance} Dr`,

            closingBalance: el?.closingBalance < 0
              ? `${Math.abs(el?.closingBalance)} Cr`
              : el?.closingBalance === 0
                ? 0
                : `${el?.closingBalance} Dr`,
          })
        });
        const financialYearOrder = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
        rowData.sort((a, b) => {
          return financialYearOrder.indexOf(a.month) - financialYearOrder.indexOf(b.month);
        });

        setRows({
          vendorDetails: rowData,
          totalCredit: data?.totalCredit,
          totalDebit: data?.totalDebit,
          // openingBalance: data?.openingBalance,
          schoolName: data?.schoolName,
          closingBalance: data?.closingBalance
        });
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.error(err)
      });
  };

  const handleRowClick = (row) => {
    const { month, month_name } = row
    const query = { ...queryValues, fcYear: currFcYear?.fcYear, fcYearId: currFcYear?.fcYearId, month, month_name }
    navigate('/Accounts-ledger-day-transaction', { state: query })
  };

  const handlePreviousOpeningBalance = () => {
    const { fcYearOpt: fcYearOptions } = queryValues
    const currentIndex = fcYearOptions?.findIndex(
      (item) => item?.value === currFcYear?.fcYearId
    );
    if (currentIndex < fcYearOptions?.length - 1) {
      const prevYear = fcYearOptions[currentIndex + 1];
      setCurrFcYear((prev) => ({
        ...prev,
        ['fcYearId']: prevYear?.value,
        ['fcYear']: prevYear?.label
      }));
    }
  }

  const handleNextOpeningBalance = () => {
    const { fcYearOpt: fcYearOptions } = queryValues
    const currentIndex = fcYearOptions?.findIndex(
      (item) => item?.value === currFcYear?.fcYearId
    );
    if (currentIndex > 0) {
      const nextFCYear = fcYearOptions[currentIndex - 1];
      setCurrFcYear((prev) => ({
        ...prev,
        ['fcYearId']: nextFCYear?.value,
        ['fcYear']: nextFCYear?.label
      }));
    }
  };


  const getFormattedMonthYear = (monthNumber, fcYear) => {
    const monthMap = {
      1: 'Jan',
      2: 'Feb',
      3: 'Mar',
      4: 'Apr',
      5: 'May',
      6: 'Jun',
      7: 'Jul',
      8: 'Aug',
      9: 'Sep',
      10: 'Oct',
      11: 'Nov',
      12: 'Dec',
    };

    const [startYear, endYear] = fcYear.split("-");
    const yearSuffix = monthNumber >= 4 ? startYear.slice(-2) : endYear.slice(-2);

    return `${monthMap[monthNumber]} ${yearSuffix}`;
  };

  const handleDownloadPdf = () => {
    setIsPrint(true)
    const timer = setTimeout(() => {
      const receiptElement = document.getElementById("ledger-monthly-transaction");
      if (receiptElement) {
        html2canvas(receiptElement, { scale: 3 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

          // Open in new window as Blob URL and trigger print
          const pdfBlob = pdf.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);

          const printWindow = window.open(pdfUrl, "_blank");
          if (printWindow) {
            printWindow.addEventListener("load", () => {
              printWindow.focus();
              printWindow.print();
            });
          }
        });
      }
      setIsPrint(false)
      return () => clearTimeout(timer)
    }, 100);

  };

  const formatCurrency = (value, decimals = 2) => {
    if (value === null || value === undefined || value === '') return `0.00`;
    if (typeof value === 'string' && (value.includes('Cr') || value.includes('Dr'))) {
      const parts = value.split(' ');
      const numValue = parseFloat(parts[0]);
      const suffix = parts[1] || '';

      if (isNaN(numValue)) return `0.00`;

      return `${numValue.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })} ${suffix}`;
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return `0.00`;

    return numValue.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };


  return (
    <Paper elevation={0} sx={{
      p: 1,
      width: '100%',
      borderRadius: 2,
      backgroundColor: 'background.paper',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1,
        width: '100%'
      }}>
        <CustomBreadCrumbs crumbs={breadCrumbs} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'end' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePreviousOpeningBalance}
            disabled={currFcYear?.fcYearId === queryValues?.fcYearOpt[queryValues?.fcYearOpt?.length - 1]?.value}
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
              fontWeight: 500,
              color: '#424242',
            }}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNextOpeningBalance}
            disabled={currFcYear?.fcYearId === queryValues?.fcYearOpt[0]?.value}
            sx={{
              backgroundColor: '#e3f2fd',
              '&:hover': {
                backgroundColor: '#bbdefb',
              },
              fontWeight: 500,
              color: '#1976d2',
            }}
          >
            Next
          </Button>
          {/* <BlobProvider
            document={
              <LedgerMonthlyTransactionPdf
                rows={rows}
                currFcYear={currFcYear}
                queryValues={queryValues}
              />
            }
          >
            {({ url, loading }) => (
              <Button
                variant="contained"
                color="primary"
                disabled={rows?.length === 0}
                onClick={() => {
                  if (url) {
                    window.open(url, '_blank');
                  }
                }}
              >
                {loading ? 'Preparing PDF...' : 'Print PDF'}
              </Button>
            )}
          </BlobProvider> */}

        </Box>
      </Box >
      <Box sx={{ width: '70%', mb: 1 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={5} sx={{
                  fontSize: '18px !important',
                  padding: '8px 10px !important',
                  textAlign: 'center',
                  backgroundColor: '#376a7d',
                  color: '#fff'
                }}>
                  {rows?.schoolName}
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{
        width: '70%',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 1,
        p: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: 1
      }}>
        <Typography variant="body1"
          sx={{
            fontWeight: 500,
            color: '#376a7d',
            fontSize: '14px',
            textAlign: 'center'
          }}>
          {`${queryValues?.voucherHeadName} Ledger for FY ${currFcYear?.fcYear} as on ${moment().format('DD-MM-YYYY')}`}
        </Typography>
      </Box>
      <Box sx={{
        width: '70%',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        overflow: 'hidden'
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer id="ledger-monthly-transaction">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center" sx={{ width: '20%' }}>Month</TableCell>
                  <TableCell align="right" sx={{ width: '20%' }}>Opening Balance</TableCell>
                  <TableCell align="right" sx={{ width: '20%' }}>Debit</TableCell>
                  <TableCell align="right" sx={{ width: '20%' }}>Credit</TableCell>
                  <TableCell align="right" sx={{ width: '20%' }}>Closing Balance</TableCell>
                </TableRow>
              </TableHead>
              {rows?.vendorDetails?.length > 0 ? (
                <>
                  <TableBody>
                    {rows.vendorDetails.map((row, index) => (
                      <TableRow
                        key={index}
                        hover
                        onClick={() => handleRowClick(row)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell align="center" sx={{ width: '20%' }}>
                          <Typography sx={{ color: '#4A57A9', fontWeight: 500 }}>
                            {getFormattedMonthYear(row?.month, currFcYear?.fcYear)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ width: '20%' }}>{formatCurrency(row.openingBalance)}</TableCell>
                        <TableCell align="right" sx={{ width: '20%' }}>{formatCurrency(row.debit)}</TableCell>
                        <TableCell align="right" sx={{ width: '20%' }}>{formatCurrency(row.credit)}</TableCell>
                        <TableCell align="right" sx={{ width: '20%', fontWeight: 600 }}>
                          {formatCurrency(row.closingBalance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell align='center' sx={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>Total</TableCell>
                      <TableCell align="right" sx={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}></TableCell>
                      <TableCell align="right" sx={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>
                        {formatCurrency(rows?.totalDebit)}
                      </TableCell>
                      <TableCell align="right" sx={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>
                        {formatCurrency(rows?.totalCredit)}
                      </TableCell>
                      <TableCell align="right" sx={{ width: '20%', fontWeight: 'bold', fontSize: '12px' }}>
                        {/* {formatCurrency(rows?.closingBalance)} */}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper >
  );
};

export default VendorMonthlyDetails;

const CustomBreadCrumbs = ({ crumbs = [] }) => {
  const navigate = useNavigate()
  const classes = useStyles()
  if (crumbs.length <= 0) return null

  return (
    <Box className={classes.breadcrumbsContainer}>
      <Breadcrumbs
        style={{ fontSize: "1.15rem" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {crumbs?.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={index}>
              {!isLast ? (
                <Typography
                  onClick={() => navigate(crumb.link, { state: crumb.state })}
                  className={classes.link}
                  fontSize="inherit"
                >
                  {crumb.name}
                </Typography>
              ) : (
                <Typography color="text.primary" fontSize="inherit">
                  {crumb.name}
                </Typography>
              )}
            </span>
          );
        })}
      </Breadcrumbs>
    </Box>
  )
}