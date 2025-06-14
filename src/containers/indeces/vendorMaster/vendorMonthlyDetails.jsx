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

const VendorMonthlyDetails = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [breadCrumbs, setBreadCrumbs] = useState()
  const [isPrint, setIsPrint] = useState(false)
  const location = useLocation()
  const queryValues = location.state;
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [currFcYear, setCurrFcYear] = useState({
    fcYearId: queryValues?.fcYearId,
    fcYear: queryValues?.fcYear
  })

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
            closingBalance: el?.closingBalance < 0 ? `${el?.closingBalance} Cr` : el?.closingBalance === 0 ? 0 : `${el?.closingBalance} Dr`,
            credit: el?.credit,
            debit: el?.debit,
            month_name: el?.month_name,
            school_id: el?.school_id,
            month: el?.month,
            openingBalance: el?.openingBalance < 0 ? `${el?.openingBalance} Cr` : el?.openingBalance === 0 ? 0 : `${el?.openingBalance} Dr`
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

  const handleBackClick = (row, type) => {
    navigate('/Accounts-ledger', { state: queryValues })
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

  const handleMonthClick = (row) => {
    const { month, month_name } = row
    const query = { ...queryValues, fcYear: currFcYear?.fcYear, fcYearId: currFcYear?.fcYearId, month, month_name }
    navigate('/Accounts-ledger-day-transaction', { state: query })
  }

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

    return `${monthMap[monthNumber]}-${yearSuffix}`;
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

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: '100%', margin: 'auto', boxShadow: 'none', position: 'relative' }}>
        <CustomBreadCrumbs crumbs={breadCrumbs} />
        <Box sx={{position: "absolute", right:"150px", top:"20px"}}>
           <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPdf}
        >
          Print
        </Button>
        </Box>
      <Box sx={{ width: "80%", margin: "20px auto" }} id="ledger-monthly-transaction" className={isPrint ? 'ledger-print-enhanced' : ''}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <HeadTableCell colSpan={5} sx={{ fontSize: '18px !important', padding: '8px 10px !important', textAlign: 'center' }}>
                    {rows?.schoolName}
                  </HeadTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell colSpan={5}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" px={2}>
                      <Box width="25%" />
                      <Typography sx={{ fontWeight: 'bold', textAlign: 'center', flex: 1, fontSize: '15px !important', }}>
                        {`Financial Year : ${currFcYear?.fcYear}`}
                      </Typography>
                      {!isPrint ? (
                        <Box display="flex" gap={2}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handlePreviousOpeningBalance}
                            sx={{
                              backgroundColor: '#f5f5f5',
                              '&:hover': {
                                backgroundColor: '#e0e0e0',
                              },
                              fontWeight: 500,
                              color: '#424242',
                            }}
                            disabled={currFcYear?.fcYearId === queryValues?.fcYearOpt[queryValues?.fcYearOpt?.length - 1]?.value}
                          >
                            Prev
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={handleNextOpeningBalance}
                            sx={{
                              backgroundColor: '#e3f2fd',
                              '&:hover': {
                                backgroundColor: '#bbdefb',
                              },
                              fontWeight: 500,
                              color: '#1976d2',
                            }}
                            disabled={currFcYear?.fcYearId === queryValues?.fcYearOpt[0]?.value}
                          >
                            Next
                          </Button>
                        </Box>
                      ) : <></>}
                    </Box>
                  </StyledTableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <StyledTableCell align="center">Month</StyledTableCell>
                  <StyledTableCell align="center">Opening Balance</StyledTableCell>
                  <StyledTableCell align="center">Debit</StyledTableCell>
                  <StyledTableCell align="center">Credit</StyledTableCell>
                  <StyledTableCell align="center">Closing Balance</StyledTableCell>
                </TableRow>
              </TableHead>
              {rows?.vendorDetails?.length > 0 && rows?.vendorDetails[0]?.month ? (<>
                <TableBody>
                  {rows?.vendorDetails?.map((row, index) => {
                    return <TableRow key={index}>
                      <StyledTableCellBody align="left">
                        <Typography onClick={() => handleMonthClick(row)} sx={{ fontWeight: '500', textAlign: "right", color: " #4A57A9", fontSize: "14px !important", textAlign: "center", cursor: 'pointer' }}>{getFormattedMonthYear(row?.month, currFcYear?.fcYear)}</Typography>
                      </StyledTableCellBody>
                      <StyledTableCellBody align="right">
                        {row.openingBalance}
                      </StyledTableCellBody>
                      <StyledTableCellBody align="right">
                        {row.debit}
                      </StyledTableCellBody>
                      <StyledTableCellBody align="right">
                        {row?.credit}
                      </StyledTableCellBody>
                      <StyledTableCellBody align="right">
                        <Typography sx={{ fontWeight: '600', textAlign: "right", fontSize: "14px !important", fontFamily: "Bookman Old Style !important" }}>{row?.closingBalance}</Typography>
                      </StyledTableCellBody>
                    </TableRow>
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <StyledTableCell sx={{ borderTop: '2px solid #e0e0e0', textAlign: "center" }}>Total</StyledTableCell>
                    <StyledTableCell align="right" sx={{ borderTop: '2px solid #e0e0e0' }}></StyledTableCell>
                    <StyledTableCell align="right" sx={{ borderTop: '2px solid #e0e0e0' }}>
                      {rows?.totalDebit}
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={{ borderTop: '2px solid #e0e0e0' }}>
                      {rows?.totalCredit}
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={{ borderTop: '2px solid #e0e0e0' }}>{rows?.closingBalance}</StyledTableCell>
                  </TableRow>
                </TableFooter>
              </>) : (
                <TableRow>
                  <StyledTableCell colSpan={5} align="center">
                    <Typography variant="subtitle2">No Records Found</Typography>
                  </StyledTableCell>
                </TableRow>
              )}
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
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