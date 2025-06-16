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

const HeadTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: '2px solid #e0e0e0',
    fontWeight: "bold",
    backgroundColor: "#376a7d",
    color: "#fff",
    fontFamily: "Bookman Old Style",
    width: "25%",
    fontSize: '16px !important',
    padding: '8px 16px !important'
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    borderBottom: '1px solid #e0e0e0',
    padding: theme.spacing(1),
    border: "1px solid rgba(224, 224, 224, 1)",
    fontSize: '15px',
    fontFamily: "Bookman Old Style !important",
    width: "25%",
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    borderBottom: '1px solid #e0e0e0',
    padding: theme.spacing(1),
    border: "1px solid rgba(224, 224, 224, 1)",
    fontSize: '15px',
    fontFamily: "Bookman Old Style",
    width: "25%",
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
                { name: `${currMonth?.month_name}` }
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
                    runningBalance += (el?.credit || 0) - (  el?.debit|| 0);
                    rowData.push({
                        credit: el?.credit,
                        debit: el?.debit,
                        month: el?.month,
                        month_name: el?.month_name,
                        created_date: el?.created_date,
                        cumulativeBalance: runningBalance < 0 ? `${runningBalance.toFixed(2)} Cr` : runningBalance === 0 ? 0 : `${runningBalance.toFixed(2)} Dr`
                    })
                });
                const  totalCumulativeBalance=  Number(data?.openingBalance) + Number(data?.totalCredit) - Number(data?.totalDebit)
                setRows({
                    vendorDetails: rowData,
                    totalCredit: data?.totalCredit,
                    totalDebit: data?.totalDebit,
                    openingBalance:  data?.openingBalance < 0 ? `${data?.openingBalance} Cr` : data?.openingBalance === 0 ? 0 : `${data?.openingBalance} Dr`,
                    totalCumulativeBalance:  totalCumulativeBalance,
                    schoolName: data?.schoolName
                });
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.error(err)
            });
    };

    const handleRowClick = (row) => {
        const selectedDate = moment(row?.created_date).format("DD-MM-YYYY")
        const queryParams = { ...queryValues, date: row?.created_date, month: currMonth?.month, month_name: currMonth?.month_name, selectedDate }
        navigate('/Accounts-ledger-day-transaction-detail', { state: queryParams })
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

    return (
        <Paper elevation={3} sx={{ p: 2, maxWidth: '100%', margin: 'auto', boxShadow: 'none', position: 'relative' }}>
            <CustomBreadCrumbs crumbs={breadCrumbs} />
            <Box sx={{ width: "80%", margin: "20px auto" }}>
                 {loading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <CircularProgress />
                          </Box>
                        ) : (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <HeadTableCell colSpan={4} align="center">
                                    {rows?.schoolName}
                                </HeadTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell colSpan={4}>
                                    <Box display="flex" justifyContent="flex-end" gap={2}>
                                        <Button
                                            size="small"
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
                                            size="small"
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
                                    </Box>
                                </StyledTableCell>
                            </TableRow>

                            <TableRow>
                                <StyledTableCell colSpan={3} align="right">Opening Balance</StyledTableCell>
                                <StyledTableCell align="right">
                                    <Typography sx={{ fontWeight: 'bold', textAlign: "right", fontSize: "14px !important", fontFamily: "Bookman Old Style !important" }}>{rows?.openingBalance}</Typography>
                                </StyledTableCell>
                            </TableRow>

                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <StyledTableCell align="center">Date</StyledTableCell>
                                <StyledTableCell align="center">Debit</StyledTableCell>
                                <StyledTableCell align="center">Credit</StyledTableCell>
                                <StyledTableCell align="center">Closing Balance</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {rows?.vendorDetails?.length > 0 && rows?.vendorDetails[0]?.created_date ? (<>
                            <TableBody>
                                {rows?.vendorDetails?.length > 0 && rows?.vendorDetails?.map((row, index) => {
                                    return <TableRow
                                        key={index}
                                        onClick={() => handleRowClick(row)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#f0f4ff',
                                            },
                                        }}
                                    >
                                        <StyledTableCellBody align="center">{moment(row?.created_date).format('DD-MM-YYYY')}</StyledTableCellBody>
                                        <StyledTableCellBody align="right">
                                            {row.debit}
                                        </StyledTableCellBody>
                                        <StyledTableCellBody align="right">
                                            {row.credit}
                                        </StyledTableCellBody>
                                        <StyledTableCellBody align="right">
                                        <Typography sx={{ fontWeight: '600', textAlign: "right", fontSize: "14px !important", fontFamily: "Bookman Old Style !important" }}>{(row?.cumulativeBalance) || 0}</Typography>
                                    </StyledTableCellBody>
                                    </TableRow>
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <StyledTableCell sx={{ borderTop: '2px solid #e0e0e0', textAlign: "center" }}>Total</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ borderTop: '2px solid #e0e0e0' }}>
                                        {rows?.totalDebit}
                                    </StyledTableCell>
                                    <StyledTableCell align="right" sx={{ borderTop: '2px solid #e0e0e0' }}>
                                        {rows?.totalCredit}
                                    </StyledTableCell>
                                    <StyledTableCell align='right' sx={{ borderTop: '2px solid #e0e0e0' }}>{rows?.totalCumulativeBalance}</StyledTableCell>
                                </TableRow>
                            </TableFooter>
                        </>) : (
                            <TableRow>
                                <StyledTableCell colSpan={4} align="center">
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