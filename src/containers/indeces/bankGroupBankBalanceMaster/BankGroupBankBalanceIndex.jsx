// import { useState, useEffect } from "react";
// import { Box, Button, ButtonGroup, Card, CardContent, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
// import GridIndex from "../../../components/GridIndex";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../../../services/Api";
// import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
// import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// // import {
// //   Box,
// //   Typography,
// //   TableContainer,
// //   Table,
// //   TableHead,
// //   TableBody,
// //   TableRow,
// //   TableCell,
// //   Paper
// // } from "@mui/material";

// const initialValues = {
//     voucherHeadId: "",
//     fcYearId: "",
//     fcYear: "",
//     voucherHeadName: ""
// };

// function BankGroupBankBalanceIndex() {
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(false)
//     const navigate = useNavigate();
//     const location = useLocation()
//     const setCrumbs = useBreadcrumbs();
//     const roleShortName = JSON.parse(
//         sessionStorage.getItem("AcharyaErpUser")
//     )?.roleShortName;

//     useEffect(() => {
//         setCrumbs([{ name: "Bank Balance" }])
//         getData();
//     }, []);

//     const getData = async () => {
//         setLoading(true)
//         await axios
//             .get('/api/finance/fetchAllBanknDetails?page=0&page_size=10000&sort=created_date')
//             .then((res) => {
//                 const { Paginated_data } = res?.data?.data
//                 const result = [];
//                 Paginated_data?.content?.forEach(item => {
//                     const groupId = item.bank_group_id;
//                     const groupName = item.bank_group_name;
//                     const balance = parseFloat(item.bank_balance) || 0;
//                     const existingGroup = result.find(group => group.id === groupId);
//                     if (existingGroup) {
//                         existingGroup.total_balance += balance;
//                     } else {
//                         result.push({
//                             id: groupId,
//                             bank_group_name: groupName,
//                             total_balance: balance,
//                         });
//                     }
//                 });
//                 result?.forEach(group => {
//                     group.total_balance = parseFloat(group.total_balance.toFixed(2));
//                 });
//                 setRows(result || []);
//                 setLoading(false)
//             })
//             .catch((err) => {
//                 setLoading(false)
//                 console.error(err)
//             });
//     };

//     const handleRowClick = (bankGroupId) => {
//         navigate('/institute-bank-balance', { state: { id: bankGroupId } })
//     }


// const bankData = [
//   { group: "GRANT ACCOUNT", balance: 6151931.61 },
//   { group: "STATE BANK OF INDIA", balance: 0 },
//   { group: "AXIS BANK", balance: 23227889.49 },
//   { group: "PUNJAB NATIONAL BANK", balance: 3149885.14 },
//   { group: "YES BANK", balance: 91459440.57 },
//   { group: "AXIS CASH CREDIT", balance: 141970629.05 },
//   { group: "AXIS TERM LOAN", balance: -120000000 },
// ];

// const footerData = [
//   { group: "TOTAL", balance: 122219775.86, bold: true },
//   { group: "YES CASH CREDIT", balance: 46451376.94, highlight: true },
//   { group: "CASH IN HAND", balance: -1333455.25, highlight: true },
// ];

//     return (
//         // <Box sx={{ width: '100%', p: 2 }}>
//         //     <Box sx={{
//         //         width: '70%',
//         //         margin: '20px auto',
//         //         boxShadow: 'none',
//         //         borderRadius: 2,
//         //         overflow: 'hidden'
//         //     }}>
//         //         {loading ? (
//         //             <Box sx={{
//         //                 display: 'flex',
//         //                 justifyContent: 'center',
//         //                 alignItems: 'center',
//         //                 minHeight: 300,
//         //                 bgcolor: 'background.default'
//         //             }}>
//         //                 <CircularProgress size={60} thickness={4} />
//         //             </Box>
//         //         ) : (
//         //             <TableContainer>
//         //                 <Table>
//         //                     <TableHead>
//         //                         <TableRow sx={{
//         //                             bgcolor: '#376a7d',
//         //                             '& th': {
//         //                                 fontWeight: 500,
//         //                                 color: 'common.white',
//         //                                 fontSize: '0.95rem',
//         //                                 py: 1.5
//         //                             }
//         //                         }}>
//         //                             <TableCell align="center">Bank Groups</TableCell>
//         //                             <TableCell align="center">Bank Balance</TableCell>
//         //                         </TableRow>
//         //                     </TableHead>

//         //                     <TableBody>
//         //                         {rows?.length > 0 ? (
//         //                             rows.map((row, index) => (
//         //                                 <TableRow
//         //                                     key={row?.id}
//         //                                     hover
//         //                                     sx={{
//         //                                         cursor: 'pointer',
//         //                                         transition: 'all 0.2s ease-in-out',
//         //                                         // '&:hover': {
//         //                                         //     bgcolor: 'action.hover',
//         //                                         //     transform: 'scale(1.005)', // subtle animation
//         //                                         // },
//         //                                         '&:last-child td': { borderBottom: 0 }
//         //                                     }}
//         //                                 >
//         //                                     <TableCell
//         //                                         align="left"
//         //                                         sx={{
//         //                                             color: 'common.black',
//         //                                             fontSize: '14px',
//         //                                             letterSpacing: '0.5px',
//         //                                             fontFamily: 'Roboto, sans-serif'
//         //                                         }}
//         //                                     >
//         //                                         {row?.bank_group_name}
//         //                                     </TableCell>
//         //                                     <TableCell
//         //                                         align="right"
//         //                                         sx={{
//         //                                             fontWeight: 700,
//         //                                             color: 'common.black', 
//         //                                             fontFamily: 'monospace',
//         //                                             fontSize: '1.05rem'
//         //                                         }}
//         //                                     >
//         //                                         {row?.total_balance > 0 ? (
//         //                                             <Typography
//         //                                                 onClick={() => handleRowClick(row?.id)}
//         //                                                 sx={{
//         //                                                     color: 'primary.main',
//         //                                                     cursor: 'pointer',
//         //                                                     '&:hover': { textDecoration: 'underline' }
//         //                                                 }}
//         //                                             >
//         //                                                 {row?.total_balance}
//         //                                             </Typography>
//         //                                         ) : (
//         //                                             row?.total_balance
//         //                                         )}
//         //                                     </TableCell>
//         //                                 </TableRow>
//         //                             ))
//         //                         ) : (
//         //                             <TableRow>
//         //                                 <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
//         //                                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//         //                                         <AccountBalanceIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.6 }} />
//         //                                         <Typography variant="body1" color="text.secondary">
//         //                                             No bank records found
//         //                                         </Typography>
//         //                                         <Button variant="outlined" size="small" sx={{ mt: 1 }}>
//         //                                             Add Bank Account
//         //                                         </Button>
//         //                                     </Box>
//         //                                 </TableCell>
//         //                             </TableRow>
//         //                         )}
//         //                     </TableBody>

//         //                 </Table>
//         //             </TableContainer>
//         //         )}
//         //     </Box>
//         // </Box>
//   )
// }
// export default BankGroupBankBalanceIndex;

import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const bankData = [
    { group: "GRANT ACCOUNT", balance: 6151931.61 },
    { group: "STATE BANK OF INDIA", balance: 0 },
    { group: "AXIS BANK", balance: 23227889.49 },
    { group: "PUNJAB NATIONAL BANK", balance: 3149885.14 },
    { group: "YES BANK", balance: 91459440.57 },
    { group: "AXIS CASH CREDIT", balance: 141970629.05 },
    { group: "AXIS TERM LOAN", balance: -120000000 },
];

const footerData = [
    { group: "TOTAL", balance: 122219775.86, bold: true },
    { group: "YES CASH CREDIT", balance: 46451376.94, highlight: true },
    { group: "CASH IN HAND", balance: -1333455.25, highlight: true },
];

const BankGroupBankBalanceIndex = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const location = useLocation()
    const setCrumbs = useBreadcrumbs();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    useEffect(() => {
        setCrumbs([{ name: "Bank Balance" }])
        getData();
    }, []);


    const getData = async () => {
        setLoading(true);

        try {
            const res = await axios.get(
                '/api/finance/fetchAllBanknDetails?page=0&page_size=10000&sort=created_date'
            );
            const { Paginated_data } = res?.data?.data;

            const result = [];
            Paginated_data?.content?.forEach(item => {
                const groupId = item.bank_group_id;
                const groupName = item.bank_group_name;
                const balance = parseFloat(item.bank_balance) || 0;

                const existingGroup = result.find(group => group.id === groupId);
                if (existingGroup) {
                    existingGroup.total_balance += balance;
                } else {
                    result.push({
                        id: groupId,
                        bank_group_name: groupName,
                        // total_balance: balance,
                        total_balance: 4500,
                    });
                }
            });

            result.forEach(group => {
                group.total_balance = parseFloat(group.total_balance.toFixed(2));
            });

            const cashInHandIndex = result.findIndex(
                item => item.bank_group_name.toLowerCase() === 'cash in hand'
            );
            const cashInHand = cashInHandIndex !== -1 ? result.splice(cashInHandIndex, 1)[0] : null;

            const totalBalance = result.reduce((acc, curr) => acc + curr.total_balance, 0);
            const totalRow = {
                id: 'total',
                bank_group_name: 'TOTAL',
                total_balance: parseFloat(totalBalance.toFixed(2)),
                isTotal: true,
            };

            if (cashInHand) {
                cashInHand.isCashInHand = true;
                setRows([...result, totalRow, cashInHand]);
            } else {
                setRows([...result, totalRow]);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = (bankGroupId) => {
        navigate('/institute-bank-balance', { state: { id: bankGroupId } })
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
            <TableContainer component={Paper} elevation={3} sx={{ boxShadow: "none" }}>
                <Table size="small" sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
                    <TableHead sx={{ backgroundColor: "#376a7d" }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    borderRight: "1px solid #ddd",
                                    height: 50,
                                    fontSize:'14px',
                                    width:'60%'
                                }}
                            >
                                Bank Groups
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    height: 50,
                                    fontSize:'14px',
                                     width:'40%'
                                }}
                            >
                                Bank Balance
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => {
                            return row?.bank_group_name?.toLowerCase() === 'cash in hand' || row?.bank_group_name?.toLowerCase() === 'total' ? (
                                <TableRow
                                    key={i}
                                    sx={{
                                        backgroundColor: row.highlight ? "#e8f4ff" : "#d1ecf1",
                                        fontWeight: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? 600 : "bold",
                                        color: '#376a7d',
                                        height: 50
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            borderRight: "1px solid #ddd",
                                            fontWeight: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? 600 : "bold",
                                            color: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? '#376a7d' : 'black',
                                            fontSize:'14px',
                                            height: 50
                                        }}
                                    >
                                        {row?.bank_group_name}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? '600' : 'bold',
                                            color: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? '#376a7d' : 'black',
                                            fontSize: '14px',
                                            height: 50
                                        }}
                                    >
                                        {new Intl.NumberFormat("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(row.total_balance)}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={i} sx={{ height: 50 }}>
                                    <TableCell
                                        sx={{
                                            borderRight: "1px solid #ddd",
                                            height: 50,
                                            fontSize: '14px'
                                        }}
                                    >
                                        {row.bank_group_name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row?.total_balance > 0 ? (
                                            <Typography
                                               onClick={() => handleCellClick(row?.id)}
                                                sx={{
                                                    color: '#376a7d !important',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {new Intl.NumberFormat("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(row.total_balance)}
                                            </Typography>
                                        ) : (
                                            0
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BankGroupBankBalanceIndex;

