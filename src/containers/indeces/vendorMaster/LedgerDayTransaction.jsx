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
import { MONTH_LIST_OPTION } from '../../../services/Constants';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";
import moment from 'moment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';
import LedgerDayTransactionPdf from './LedgerDayTransactionPdf';
import { BlobProvider } from '@react-pdf/renderer';



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
        "&:hover": { textDecoration: "none" },
    },
}));


const LedgerDayTransaction = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [breadCrumbs, setBreadCrumbs] = useState()
    const location = useLocation()
    const queryValues = location.state;
    const setCrumbs = useBreadcrumbs();
    const navigate = useNavigate();
    const [currMonth, setCurrMonth] = useState({
        month: queryValues?.month,
        month_name: queryValues?.month_name
    })

    useEffect(() => {
        if (currMonth?.month) {
            getData()
            setBreadCrumbs([
                { name: "Ledger", link: "/Accounts-ledger", state: queryValues },
                { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
                { name: 'Daily Summary' }
            ])
            setCrumbs([])
        }
    }, [currMonth?.month])

    const getData = async () => {
        const { voucherHeadId, fcYearId, schoolId } = queryValues
        const baseUrl = "/api/finance/getMonthlyLedger"
        const params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(currMonth?.month && { month: currMonth?.month }),
            ...(fcYearId && { fcYearId }),
            ...(schoolId && { schoolId })
        }
        setLoading(true)
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                const { data } = res?.data
                const rowData = []
                let runningBalance = data?.openingBalance || 0;
                data?.vendorDetails?.length > 0 && data?.vendorDetails?.forEach(el => {
                    runningBalance += (el?.debit || 0) - (el?.credit || 0);
                    rowData.push({
                        credit: el?.credit,
                        debit: el?.debit,
                        month: el?.month,
                        month_name: el?.month_name,
                        created_date: el?.created_date,
                        cumulativeBalance: runningBalance < 0 ? `${Math.abs(runningBalance.toFixed(2))} Cr` : runningBalance === 0 ? 0 : `${runningBalance.toFixed(2)} Dr`
                    })
                });
                const totalCumulativeBalance = Number(data?.openingBalance) + Number(data?.totalCredit) - Number(data?.totalDebit)
                setRows({
                    vendorDetails: rowData,
                    totalCredit: data?.totalCredit,
                    totalDebit: data?.totalDebit,
                    openingBalance: data?.openingBalance < 0 ? `${Math.abs(data?.openingBalance)} Cr` : data?.openingBalance === 0 ? 0 : `${data?.openingBalance} Dr`,
                    // totalCumulativeBalance: totalCumulativeBalance.toFixed(2),
                    schoolName: data?.schoolName
                });
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.error(err)
            });
    };

    const handlePreviousMonthOB = (month) => {
        const currMonthInd = MONTH_LIST_OPTION?.findIndex((mth) => mth?.value === month)
        if (currMonthInd + 1 > MONTH_LIST_OPTION[0]?.value) {
            const prevMonth = MONTH_LIST_OPTION[currMonthInd - 1];
            setCurrMonth((prev) => ({
                ...prev,
                ['month']: prevMonth?.value,
                ['month_name']: prevMonth?.label
            }));
        }
    }

    const handleNextMonthOB = (month) => {
        const currMonthInd = MONTH_LIST_OPTION?.findIndex((mth) => mth.value === month)
        if (currMonthInd < (MONTH_LIST_OPTION?.length - 1)) {
            const nextMonthInd = MONTH_LIST_OPTION[currMonthInd + 1];
            setCurrMonth((prev) => ({
                ...prev,
                ['month']: nextMonthInd?.value,
                ['month_name']: nextMonthInd?.label
            }));
        }
    };

    const handleCellClick = (row, type) => {
        const selectedDate = moment(row?.created_date).format("DD-MM-YYYY")
        const queryParams = { ...queryValues, date: row?.created_date, month: currMonth?.month, month_name: currMonth?.month_name, selectedDate }
        if (type === 'debit') {
            navigate('/Accounts-ledger-day-transaction-debit', { state: queryParams })
        } else {
            navigate('/Accounts-ledger-day-credit-transaction', { state: queryParams })
        }
    }


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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        // size="small"
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => handlePreviousMonthOB(currMonth?.month)}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                            fontWeight: 500,
                            color: '#424242',
                        }}
                        disabled={currMonth?.month === MONTH_LIST_OPTION[0]?.value}
                    >
                        Prev
                    </Button>
                    <Button
                        // size="small"
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleNextMonthOB(currMonth?.month)}
                        sx={{
                            backgroundColor: '#e3f2fd',
                            '&:hover': {
                                backgroundColor: '#bbdefb',
                            },
                            fontWeight: 500,
                            color: '#1976d2',
                        }}
                        disabled={currMonth?.month === MONTH_LIST_OPTION[MONTH_LIST_OPTION?.length - 1]?.value}
                    >
                        Next
                    </Button>
                    {/* <BlobProvider
                        document={
                            <LedgerDayTransactionPdf
                                rows={rows}
                                queryValues={queryValues}
                                currMonth={currMonth}
                            />
                        }
                    >
                        {({ url, loading }) => (
                            <Button
                                variant="contained"
                                onClick={() => url && window.open(url, '_blank')}
                                disabled={loading}
                                startIcon={<PrintIcon />}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    boxShadow: 'none'
                                }}
                            >
                                {loading ? 'Preparing PDF...' : 'Print'}
                            </Button>
                        )}
                    </BlobProvider> */}
                </Box>
            </Box>
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 1,
                p: 1,
                backgroundColor: '#f9f9f9',
                borderRadius: 1
            }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {`${queryValues?.voucherHeadName || ""} Ledger for FY ${queryValues?.fcYear} as on ${moment().format('DD-MM-YYYY')}`}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Opening Balance:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        {formatCurrency(rows?.openingBalance)}
                    </Typography>
                </Box>
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
                    <TableContainer sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        // mb: 2
                    }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Date</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Debit</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Credit</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Closing Balance</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows?.vendorDetails?.length > 0 ? (
                                    rows.vendorDetails.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            hover
                                            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <TableCell align="center">{moment(row?.created_date).format('DD-MM-YYYY')}</TableCell>
                                            <TableCell align="right">
                                                {row?.debit > 0 ? (
                                                    <Typography
                                                        onClick={() => handleCellClick(row, 'debit')}
                                                        sx={{
                                                            color: 'primary.main',
                                                            cursor: 'pointer',
                                                            '&:hover': { textDecoration: 'none' }
                                                        }}
                                                    >
                                                        {formatCurrency(row.debit)}
                                                    </Typography>
                                                ) : (
                                                    formatCurrency(row.debit)
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.credit > 0 ? (
                                                    <Typography
                                                        onClick={() => handleCellClick(row, 'credit')}
                                                        sx={{
                                                            color: 'primary.main',
                                                            cursor: 'pointer',
                                                            '&:hover': { textDecoration: 'none' }
                                                        }}
                                                    >
                                                        {formatCurrency(row.credit)}
                                                    </Typography>
                                                ) : (
                                                    formatCurrency(row.credit)
                                                )}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(row?.cumulativeBalance || 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <ReceiptLongIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                                <Typography color="text.secondary">No transactions this month</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            {rows?.vendorDetails?.length > 0 && (
                                <TableFooter>
                                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>Total</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                            {formatCurrency(rows?.totalDebit)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                            {formatCurrency(rows?.totalCredit)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                            {/* {formatCurrency(rows?.totalCumulativeBalance)} */}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Paper>
    );
};

export default LedgerDayTransaction;

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