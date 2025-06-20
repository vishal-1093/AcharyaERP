// import React, { useEffect, useState } from 'react';
// import {
//     Box,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     IconButton,
//     Collapse,
//     Paper,
//     Breadcrumbs,
// } from '@mui/material';
// import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { useLocation, useNavigate } from 'react-router-dom';
// import useBreadcrumbs from '../../../hooks/useBreadcrumbs';
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   breadcrumbsContainer: {
//     position: "relative",
//     marginBottom: 10,
//     width: "fit-content",
//     zIndex: theme.zIndex.drawer - 1,
//   },
//   link: {
//     color: theme.palette.primary.main,
//     textDecoration: "none",
//     cursor: "pointer",
//     "&:hover": { textDecoration: "underline" },
//   },
// }));

// const rowStyle = {
//     backgroundColor: '#f5f5f5',
// };
// const rightAlignedCell = {
//     fontWeight: 'bold',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//     justifyContent: 'center',
// };

// const BRSTransactionDetail = () => {
//     const [open, setOpen] = useState({
//         chqNotDebited: false,
//         chqNotCredited: false,
//         directCredits: false,
//     });
//     const [breadCrumbs, setBreadCrumbs] = useState()
//     const navigate = useNavigate()
//      const setCrumbs = useBreadcrumbs();
//        const location = useLocation()
//        const queryValues = location.state;

//     useEffect(() => {
//             setBreadCrumbs([
//                 { name: "Bank Balance", link: "/bank-balance" },
//                  { name: "Institute Account Balances", link:"/institute-bank-balance" },
//                  { name: "BRS Transaction Detail" },
//                 ])
//     setCrumbs([])
//         }, []);

//     const toggle = (key) => setOpen({ ...open, [key]: !open[key] });

//     const handleViewTransaction = (row, type) => {
//         navigate('/brs-chq-issued-not-debited')
//     }

//     return (
//         <Paper sx={{width:'100%', boxShadow: 'none'}}>
//         <CustomBreadCrumbs crumbs={breadCrumbs} />
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//             <Box sx={{ width: '900px' }}>
//                 <Paper elevation={3} sx={{ backgroundColor: '#376a7d', p: 2, mb: 2 }}>
//                     <Typography variant="h6" color="white" fontWeight="bold" sx={{ textAlign: "center", mb: 1 }}>
//                         ACHARYA INSTITUTE OF TECHNOLOGY
//                     </Typography>
//                     <Typography color="white" sx={{ textAlign: "center", fontWeight: 500, mb: 1 }}>YES BANK - A/c No : 065994600000251</Typography>
//                     <Typography color="white" sx={{ textAlign: "center", fontWeight: 500, }}>BANK RECONCILIATION STATEMENT as on 15-06-2025</Typography>
//                 </Paper>
//                 <Table>
//                     <TableBody>
//                         <TableRow sx={rowStyle}>
//                             <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}>Bank Balance as per the Cash Book</TableCell>
//                             <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px', paddingRight: '60px' }}>47010280.23</TableCell>
//                         </TableRow>

//                         {/* (+) CHQ Issued Not Debited */}
//                         <TableRow sx={{
//                             ...rowStyle,
//                             height: '36px',
//                             '& td': {
//                                 paddingTop: '4px',
//                                 paddingBottom: '4px',
//                             }
//                         }}>
//                             <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}> (+) CHQ Issued Not Debited </TableCell>
//                             <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px' }}>
//                                 0
//                                 {/* <IconButton onClick={() => toggle('chqNotDebited')}>
//                                     {open.chqNotDebited ? <ArrowDropUp sx={{ fontSize: '2rem'}} /> : <ArrowDropDown sx={{ fontSize: '2rem', paddingLeft: 0, pr:0  }} />}
//                                 </IconButton> */}
//                                 <IconButton onClick={() =>handleViewTransaction('chqNotDebited')}>
//                                     <VisibilityIcon />
//                                 </IconButton>
//                             </TableCell>
//                         </TableRow>
//                         {/* <TableRow>
//                             <TableCell colSpan={2} sx={{ p: 0 }}>
//                                 <Collapse in={open.chqNotDebited}>
//                                     <Table size="small">
//                                         <TableHead>
//                                             <TableRow sx={rowStyle}>
//                                                 <TableCell>Voucher Date</TableCell>
//                                                 <TableCell>Pay To</TableCell>
//                                                 <TableCell align="right">Amount</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             <TableRow>
//                                                 <TableCell>15-06-2025</TableCell>
//                                                 <TableCell>Constructions</TableCell>
//                                                 <TableCell align="right">1000000</TableCell>
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </Collapse>
//                             </TableCell>
//                         </TableRow> */}

//                         {/* (+) CHQ/DD Deposited Not Credited */}
//                         <TableRow sx={{
//                             ...rowStyle,
//                             height: '36px',
//                             '& td': {
//                                 paddingTop: '4px',
//                                 paddingBottom: '4px',
//                             }
//                         }}>
//                             <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}> (+) CHQ/DD Deposited Not Credited </TableCell>
//                             <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px' }}>
//                                 7033890.98
//                                 <IconButton onClick={() => toggle('chqNotCredited')}>
//                                     {open.chqNotCredited ? <ArrowDropUp sx={{ fontSize: '2rem' }} /> : <ArrowDropDown sx={{ fontSize: '2rem' }} />}
//                                 </IconButton>
//                             </TableCell>
//                         </TableRow>
//                         <TableRow>
//                             <TableCell colSpan={2} sx={{ p: 0 }}>
//                                 <Collapse in={open.chqNotCredited}>
//                                     <Table size="small">
//                                         <TableHead>
//                                             <TableRow sx={rowStyle}>
//                                                 <TableCell>DD No</TableCell>
//                                                 <TableCell>DD Date</TableCell>
//                                                 <TableCell>Bank</TableCell>
//                                                 <TableCell align="right">Amount</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             <TableRow>
//                                                 <TableCell>677098</TableCell>
//                                                 <TableCell>28-03-2025</TableCell>
//                                                 <TableCell>SBI</TableCell>
//                                                 <TableCell align="right">45000</TableCell>
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </Collapse>
//                             </TableCell>
//                         </TableRow>

//                         {/* (+) Direct Credits to Bank */}
//                         <TableRow sx={{
//                             ...rowStyle,
//                             height: '36px',
//                             '& td': {
//                                 paddingTop: '4px',
//                                 paddingBottom: '4px',
//                             }
//                         }}>
//                             <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}> (+) Direct Credits to Bank </TableCell>
//                             <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px' }}>
//                                 6202812
//                                 <IconButton onClick={() => toggle('directCredits')}>
//                                     {open.directCredits ? <ArrowDropUp sx={{ fontSize: '2rem' }} /> : <ArrowDropDown sx={{ fontSize: '2rem' }} />}
//                                 </IconButton>
//                             </TableCell>
//                         </TableRow>
//                         <TableRow>
//                             <TableCell colSpan={2} sx={{ p: 0 }}>
//                                 <Collapse in={open.directCredits}>
//                                     <Table size="small">
//                                         <TableHead>
//                                             <TableRow sx={rowStyle}>
//                                                 <TableCell>Transaction Date</TableCell>
//                                                 <TableCell>Transaction No</TableCell>
//                                                 <TableCell>Cheque/DD No</TableCell>
//                                                 <TableCell align="right">Amount</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             <TableRow>
//                                                 <TableCell>29-03-2025</TableCell>
//                                                 <TableCell>pay_QGVbdWBJUjR8xRkN</TableCell>
//                                                 <TableCell>UB127823000XXXXXXXX</TableCell>
//                                                 <TableCell align="right">57000</TableCell>
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </Collapse>
//                             </TableCell>
//                         </TableRow>

//                         <TableRow sx={{
//                             ...rowStyle
//                         }}>
//                             <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Total</TableCell>
//                             <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '13px', paddingRight: '60px' }}>27517692.1</TableCell>
//                         </TableRow>
//                         <TableRow sx={rowStyle}>
//                             <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}>Bank Balance per the Pass Book</TableCell>
//                             <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px', paddingRight: '60px' }}>67494081.35</TableCell>
//                         </TableRow>
//                         <TableRow sx={rowStyle}>
//                             <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}>Difference</TableCell>
//                             <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px', paddingRight: '60px' }}>-39976389.25</TableCell>
//                         </TableRow>
//                     </TableBody>
//                 </Table>
//             </Box>
//         </Box>
//         </Paper>
//     );
// };

// export default BRSTransactionDetail;

import React, { useEffect, useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    Divider,
    Chip,
    Button,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Breadcrumbs,
    Pagination
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLocation, useNavigate } from 'react-router-dom';
import useBreadcrumbs from '../../../hooks/useBreadcrumbs';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";
import {
    AccountBalance as AccountBalanceIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
    Receipt as ReceiptIcon,
    CreditCard as CreditCardIcon,
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowUp as ArrowUpIcon,
    Visibility as ViewIcon,
    Download as DownloadIcon,
    SyncAlt as SyncAltIcon
} from '@mui/icons-material';
import axios from '../../../services/Api';
import moment from 'moment';


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

const rowStyle = {
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: '1px solid #e0e0e0'
};

const BRSTransactionDetail = () => {
    const [directCreditsData, setDirectCreditsData] = useState({})
    const [chqIssuedNotCreditData, setChqIssuedNotCreditData] = useState({})
    const [chqIssuedNotDebitData, setChqIssuedNotDebitData] = useState({})
    const [expanded, setExpanded] = useState({
        directCredits: false,
        chqIssued: false,
        chqDeposited: false
    });
    const [breadCrumbs, setBreadCrumbs] = useState([]);
    const [pagination, setPagination] = useState({
        directCredits: { page: 1, rowsPerPage: 20 },
        chqIssued: { page: 1, rowsPerPage: 20 },
        chqDeposited: { page: 1, rowsPerPage: 20 }
    });
    const navigate = useNavigate();
    const setCrumbs = useBreadcrumbs();
    const location = useLocation();
    const queryValues = location.state;

    useEffect(() => {
        setBreadCrumbs([
            { name: "Bank Balance", link: "/bank-balance" },
            { name: "BRS", link: "/institute-bank-balance", state: { bankGroupId: queryValues?.bankGroupId } },
            { name: "BRS Transactions" },
        ]);
        setCrumbs([]);
        getChqIssuedNotDebitData()
        getChqIssuedNotCreditData()
        getDirectCreditToBankData()
    }, [queryValues]);

    const getChqIssuedNotDebitData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`/api/finance/getChqIssuedNotDebit?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const { data } = res?.data
                setChqIssuedNotDebitData(data || {})
            })
            .catch((err) => console.error(err));
    };

    const getChqIssuedNotCreditData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`api/finance/getChqIssuedNotCredit?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const { data } = res?.data
                setChqIssuedNotCreditData(data || {})
            })
            .catch((err) => console.error(err));
    };

    const getDirectCreditToBankData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`/api/student/getAllBankImportPendingTransaction?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const { data } = res?.data
                setDirectCreditsData(data || {})
            })
            .catch((err) => console.error(err));
    };

    const handleViewTransactionDetails = (row, type) => {
        if (type === 'chqIssued') {
            navigate('/brs-cheque-issued-not-debit-detail', { state: queryValues });
        } else if (type === 'chqDeposited') {
            navigate('/brs-cheque-issued-not-credit-detail', { state: queryValues });
        } else {
            navigate('/brs-direct-credit-to-bank-detail', { state: queryValues });
        }
    }

    const toggleExpand = (section) => {
        setExpanded({ ...expanded, [section]: !expanded[section] });
    };

    const parseDate = (raw) => {
        if (!raw) return '';
        const f1 = moment(raw, 'YYYY-MM-DD HH:mm:ss.SSS', true);
        if (f1.isValid()) return f1.format('DD-MM-YYYY');

        const f2 = moment(raw, 'DD/MM/YYYY', true);
        if (f2.isValid()) return f2.format('DD-MM-YYYY');

        const f3 = moment(raw);
        return f3.isValid() ? f3.format('DD-MM-YYYY') : '';
    };

    const handlePageChange = (section, page) => {
        setPagination({
            ...pagination,
            [section]: {
                ...pagination[section],
                page
            }
        });
    };

    const getPaginatedData = (section) => {
        const { page, rowsPerPage } = pagination[section];
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        let items = []
        if (section === 'directCredits') {
            items = directCreditsData?.bankImportTransactions || []
        } else if (section === 'chqDeposited') {
            items = chqIssuedNotCreditData?.ddDetails || []
        } else {
            items = chqIssuedNotDebitData?.paymentVouchers || []
        }
        return items.slice(startIndex, endIndex);
    };

    return (
        <Paper sx={{
            width: '100%',
            boxShadow: 'none',
            p: 1,
            // backgroundColor: '#f8fafc'
        }}>
            <CustomBreadCrumbs crumbs={breadCrumbs} />
            <Paper elevation={0} sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#ffffff',
                boxShadow: 'none',
                width: '70%',
                margin: 'auto',
            }}>
                <Box sx={{
                    textAlign: 'center',
                    // mb: 2,
                    pb: 2,
                    background: 'linear-gradient(135deg, #376a7d 0%, #2c3e50 100%)',
                    color: 'white',
                    borderRadius: 2,
                    p: 3,
                    // boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        mb: 1,
                        letterSpacing: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {queryValues?.schoolName}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        gap: 2,
                        justifyContent: 'center'
                    }}>
                        <AccountBalanceIcon sx={{
                            fontSize: 40,
                            color: 'rgba(255,255,255,0.9)'
                        }} />
                        <Box>
                            <Typography variant="h5" sx={{
                                fontWeight: 600,
                                color: 'white'
                            }}>
                                Bank Reconciliation Statement
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255,255,255,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mt: 0.5
                            }}>
                                <Chip
                                    label={queryValues?.bankName}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        color: 'white',
                                        fontWeight: 500
                                    }}
                                />
                                <span>A/c No: {queryValues?.accountNo}</span>
                                <span>•</span>
                                <span>As on {moment().format('DD-MM-YYYY')}</span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
             
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                }}>
                    <Paper elevation={0} sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(to right, rgba(55, 106, 125, 0.03) 0%, rgba(55, 106, 125, 0.08) 100%)',
                        borderLeft: '4px solid #376a7d',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 12px rgba(55, 106, 125, 0.1)',
                            background: 'linear-gradient(to right, rgba(55, 106, 125, 0.08) 0%, rgba(55, 106, 125, 0.12) 100%)'
                        }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccountBalanceWalletIcon sx={{ color: '#376a7d' }} />
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    color: '#2c3e50'
                                }}>
                                    Bank Balance as per Cash Book
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{
                                fontWeight: 600,
                                fontFamily: 'monospace',
                                color: '#376a7d',
                                fontSize: '1rem'
                            }}>
                                {queryValues?.closingBalance || 0}
                                {/* {new Intl.NumberFormat("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumSignificantDigits: 2
                                }).format(queryValues?.closingBalance || 0)} */}
                            </Typography>
                        </Box>
                    </Paper>
                    <Divider sx={{ borderColor: '#e0e0e0', width: '98%', margin: 'auto' }} />
                    <Box>
                        <Paper elevation={0} sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(to right, rgba(211, 84, 0, 0.03) 0%, rgba(211, 84, 0, 0.08) 100%)',
                            borderLeft: '4px solid #d35400',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(211, 84, 0, 0.1)'
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                mb: expanded.chqIssued ? 1 : 0
                            }} onClick={() => toggleExpand('chqIssued')}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ReceiptIcon sx={{ color: '#d35400', mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {/* CHQ Issued Not Debited */}
                                            (+) Cheque Issued not Presented
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                                            {chqIssuedNotDebitData?.paymentVouchers?.length} transactions
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                    <Typography variant="body1" sx={{
                                        fontWeight: 600,
                                        fontFamily: 'monospace',
                                        mr: 1,
                                        fontSize: '1rem'
                                    }}>
                                        {chqIssuedNotDebitData?.totalAmount}
                                        {/* {new Intl.NumberFormat("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumSignificantDigits: 2
                                        }).format(chqIssuedNotDebitData?.totalAmount || 0)} */}
                                    </Typography>
                                    {chqIssuedNotDebitData?.paymentVouchers?.length > 100 ? (
                                        <IconButton onClick={() => handleViewTransactionDetails(chqIssuedNotDebitData?.paymentVouchers, 'chqIssued')} size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    ) : (
                                        <IconButton size="small">
                                            {expanded.chqIssued ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            <Collapse in={expanded.chqIssued}>
                                {chqIssuedNotDebitData?.paymentVouchers?.length ? (
                                    <>
                                        <TableContainer sx={{ mt: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                                        <TableCell>VCHR No</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Pay To</TableCell>
                                                        <TableCell align="right">Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getPaginatedData('chqIssued').map((item) => (
                                                        <TableRow key={item?.id} hover>
                                                            <TableCell>{item?.vochar_no}</TableCell>
                                                            <TableCell>{item?.vochar_date}</TableCell>
                                                            <TableCell>{item?.pay_to}</TableCell>
                                                            <TableCell align="right">{item?.amount}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Box>
                                            <Pagination
                                                count={Math.ceil(chqIssuedNotDebitData?.paymentVouchers?.length / pagination.chqIssued.rowsPerPage)}
                                                page={pagination.chqIssued.page}
                                                onChange={(e, page) => handlePageChange('chqIssued', page)}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            textAlign: 'center',
                                            color: '#888',
                                            fontStyle: 'italic',
                                            backgroundColor: '#fafafa',
                                            border: '1px dashed #ddd',
                                            borderRadius: 1
                                        }}
                                    >
                                        No transactions found.
                                    </Box>
                                )}
                            </Collapse>
                        </Paper>
                    </Box>
                    <Divider sx={{ borderColor: '#e0e0e0', width: '98%', margin: 'auto' }} />
                    <Box>
                        <Paper elevation={0} sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(to right, rgba(22, 160, 133, 0.03) 0%, rgba(22, 160, 133, 0.08) 100%)',
                            borderLeft: '4px solid #16a085',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(22, 160, 133, 0.1)'
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                mb: expanded.chqDeposited ? 1 : 0
                            }} onClick={() => toggleExpand('chqDeposited')}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CreditCardIcon sx={{ color: '#16a085', mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {/* CHQ/DD Deposited Not Credited */}
                                            (-) DD Deposits in Transit
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                                            {chqIssuedNotCreditData?.ddDetails?.length} transactions
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1" sx={{
                                        fontWeight: 600,
                                        fontFamily: 'monospace',
                                        mr: 1,
                                        fontSize: '1rem'
                                    }}>
                                        {chqIssuedNotCreditData?.totalAmount}
                                        {/* {new Intl.NumberFormat("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumSignificantDigits: 2
                                        }).format(chqIssuedNotCreditData?.totalAmount || 0)} */}
                                    </Typography>
                                    {chqIssuedNotCreditData?.ddDetails?.length > 100 ? (
                                        <IconButton onClick={() => handleViewTransactionDetails(chqIssuedNotCreditData?.ddDetails, 'chqDeposited')} size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    ) : (
                                        <IconButton size="small">
                                            {expanded.chqDeposited ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>

                            <Collapse in={expanded.chqDeposited}>
                                {chqIssuedNotCreditData?.ddDetails?.length > 0 ? (
                                    <>
                                        <TableContainer sx={{ mt: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                                        <TableCell>DD No</TableCell>
                                                        <TableCell>DD Date</TableCell>
                                                        <TableCell>DD Bank</TableCell>
                                                        <TableCell align="right">Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getPaginatedData('chqDeposited').map((item) => (
                                                        <TableRow key={item?.dd_id} hover>
                                                            <TableCell>{item?.dd_number}</TableCell>
                                                            <TableCell>{parseDate(item?.dd_date)}</TableCell>
                                                            <TableCell>{item?.bank_name}</TableCell>
                                                            <TableCell align="right">{item?.dd_amount}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Pagination
                                                count={Math.ceil(chqIssuedNotCreditData?.ddDetails?.length / pagination.chqDeposited.rowsPerPage)}
                                                page={pagination.chqDeposited.page}
                                                onChange={(e, page) => handlePageChange('chqDeposited', page)}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            textAlign: 'center',
                                            color: '#888',
                                            fontStyle: 'italic',
                                            backgroundColor: '#fafafa',
                                            border: '1px dashed #ddd',
                                            borderRadius: 1
                                        }}
                                    >
                                        No transactions found.
                                    </Box>
                                )}
                            </Collapse>
                        </Paper>
                    </Box>
                    <Divider sx={{ borderColor: '#e0e0e0', width: '98%', margin: 'auto' }} />
                    <Box>
                        <Paper elevation={0} sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(to right, rgba(142, 68, 173, 0.03) 0%, rgba(142, 68, 173, 0.08) 100%)',
                            borderLeft: '4px solid #8e44ad',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(142, 68, 173, 0.1)'
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                mb: expanded.directCredits ? 1 : 0
                            }} onClick={() => toggleExpand('directCredits')}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccountBalanceIcon sx={{ color: '#8e44ad', mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {/* Direct Credits to Bank */}
                                            (+) Direct Electronic Credits to Bank
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                                            {directCreditsData?.bankImportTransactions?.length} transactions
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1" sx={{
                                        fontWeight: 600,
                                        fontFamily: 'monospace',
                                        mr: 1,
                                        fontSize: '1rem'
                                    }}>
                                        {directCreditsData?.totalAmount}
                                        {/* {new Intl.NumberFormat("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumSignificantDigits: 2
                                        }).format(directCreditsData?.totalAmount || 0)} */}
                                    </Typography>
                                    {directCreditsData?.bankImportTransactions?.length > 100 ? (
                                        <IconButton onClick={() => handleViewTransactionDetails(directCreditsData?.bankImportTransactions, 'directCredits')} size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    ) : (
                                        <IconButton size="small">
                                            {expanded.directCredits ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            <Collapse in={expanded.directCredits}>
                                {directCreditsData?.bankImportTransactions?.length ? (
                                    <>
                                        <TableContainer sx={{ mt: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                                        <TableCell sx={{ width: 100 }} align="center">TRN Date</TableCell>
                                                        <TableCell sx={{ width: 140 }} align="center">TRN No</TableCell>
                                                        <TableCell sx={{ width: 140 }} align="center">Order Id</TableCell>
                                                        <TableCell sx={{ width: 80 }} align="center">AUID</TableCell>
                                                        <TableCell align="center" sx={{ width: 100 }}>Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getPaginatedData('directCredits').map((item) => (
                                                        <TableRow key={item?.index} hover>
                                                            <TableCell align="center">{parseDate(item?.transaction_date)}</TableCell>
                                                            <TableCell>{item?.cheque_dd_no}</TableCell>
                                                            <TableCell>{item?.order_id}</TableCell>
                                                            <TableCell>{item?.auid}</TableCell>
                                                            <TableCell align="center">{item?.amount}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Pagination
                                                count={Math.ceil(directCreditsData?.bankImportTransactions?.length / pagination.directCredits.rowsPerPage)}
                                                page={pagination.directCredits.page}
                                                onChange={(e, page) => handlePageChange('directCredits', page)}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            textAlign: 'center',
                                            color: '#888',
                                            fontStyle: 'italic',
                                            backgroundColor: '#fafafa',
                                            border: '1px dashed #ddd',
                                            borderRadius: 1
                                        }}
                                    >
                                        No transactions found.
                                    </Box>
                                )}
                            </Collapse>
                        </Paper>
                    </Box>
                </Box>
                <Divider sx={{ borderColor: '#e0e0e0', width: '98%', margin: 'auto' }} />
                <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, rgba(16, 185, 129, 0.03) 0%, rgba(16, 185, 129, 0.08) 100%)',
                    borderLeft: '4px solid #10b981',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(16, 185, 129, 0.1)'
                    }
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: 'rgba(16, 185, 129, 0.05)'
                    }}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 600,
                            color: '#065f46'
                        }}>
                            Total
                        </Typography>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: '#065f46',
                            fontSize: '1rem'
                        }}>
                            {(queryValues?.closingBalance +
                                chqIssuedNotCreditData?.totalAmount -
                                chqIssuedNotDebitData?.totalAmount +
                                directCreditsData?.totalAmount) || 0
                            }
                            {/* {new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 2,
                                maximumSignificantDigits: 2
                            }).format(
                                (queryValues?.closingBalance +
                                    chqIssuedNotCreditData?.totalAmount +
                                    chqIssuedNotDebitData?.totalAmount +
                                    directCreditsData?.totalAmount) || 0
                            )} */}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1
                    }}>
                        <Typography variant="body1" sx={{
                            fontWeight: 600,
                            color: '#374151'
                        }}>
                            Bank Balance as per Pass Book
                        </Typography>
                        <Typography variant="body1" sx={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: '#374151',
                            fontSize: '1rem'
                        }}>
                            {queryValues?.bankBalance}
                            {/* {new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 2,
                                maximumSignificantDigits: 2
                            }).format(queryValues?.bankBalance || 0)} */}
                        </Typography>
                    </Box>
                </Paper>
                <Divider sx={{ borderColor: '#e0e0e0', width: '98%', margin: 'auto' }} />
                <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, rgba(239, 68, 68, 0.03) 0%, rgba(239, 68, 68, 0.08) 100%)',
                    borderLeft: '4px solid #ef4444',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(239, 68, 68, 0.1)'
                    }
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: 'rgba(239, 68, 68, 0.05)'
                    }}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 600,
                            color: '#b91c1c'
                        }}>
                            Difference
                        </Typography>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: '#b91c1c',
                            fontSize: '1rem'
                        }}>
                            {((queryValues?.closingBalance +
                                chqIssuedNotCreditData?.totalAmount +
                                chqIssuedNotDebitData?.totalAmount +
                                directCreditsData?.totalAmount) -
                                queryValues?.bankBalance) || 0
                            }
                            {/* {new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 2,
                                maximumSignificantDigits: 2
                            }).format(
                                ((queryValues?.closingBalance +
                                    chqIssuedNotCreditData?.totalAmount +
                                    chqIssuedNotDebitData?.totalAmount +
                                    directCreditsData?.totalAmount) -
                                    queryValues?.bankBalance) || 0
                            )} */}
                        </Typography>
                    </Box>
                </Paper>
            </Paper>
        </Paper >
    );
};

export default BRSTransactionDetail;

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


