import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
                const balance = Number(item.bank_balance) || 0;

                const existingGroup = result.find(group => group.id === groupId);
                if (existingGroup) {
                    existingGroup.total_balance += balance;
                } else {
                    result.push({
                        id: groupId,
                        bank_group_name: groupName,
                        total_balance: balance,
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
        // <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        //     <TableContainer component={Paper} elevation={3} sx={{ boxShadow: "none" }}>
        //         <Table size="small" sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
        //             <TableHead sx={{ backgroundColor: "#376a7d" }}>
        //                 <TableRow>
        //                     <TableCell
        //                         sx={{
        //                             color: "white",
        //                             fontWeight: "bold",
        //                             borderRight: "1px solid #ddd",
        //                             height: 50,
        //                             fontSize:'14px',
        //                             width:'60%'
        //                         }}
        //                     >
        //                         Bank Groups
        //                     </TableCell>
        //                     <TableCell
        //                         align="right"
        //                         sx={{
        //                             color: "white",
        //                             fontWeight: "bold",
        //                             height: 50,
        //                             fontSize:'14px',
        //                              width:'40%'
        //                         }}
        //                     >
        //                         Bank Balance
        //                     </TableCell>
        //                 </TableRow>
        //             </TableHead>
        //             <TableBody>
        //                 {rows.map((row, i) => {
        //                     return row?.bank_group_name?.toLowerCase() === 'cash in hand' || row?.bank_group_name?.toLowerCase() === 'total' ? (
        //                         <TableRow
        //                             key={i}
        //                             sx={{
        //                                 backgroundColor: row.highlight ? "#e8f4ff" : "#d1ecf1",
        //                                 fontWeight: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? 600 : "bold",
        //                                 color: '#376a7d',
        //                                 height: 50
        //                             }}
        //                         >
        //                             <TableCell
        //                                 sx={{
        //                                     borderRight: "1px solid #ddd",
        //                                     fontWeight: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? 600 : "bold",
        //                                     color: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? '#376a7d' : 'black',
        //                                     fontSize:'14px',
        //                                     height: 50
        //                                 }}
        //                             >
        //                                 {row?.bank_group_name}
        //                             </TableCell>
        //                             <TableCell
        //                                 align="right"
        //                                 sx={{
        //                                     fontWeight: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? '600' : 'bold',
        //                                     color: row?.bank_group_name?.toLowerCase() === 'cash in hand' ? '#376a7d' : 'black',
        //                                     fontSize: '14px',
        //                                     height: 50
        //                                 }}
        //                             >
        //                                 {new Intl.NumberFormat("en-IN", {
        //                                     minimumFractionDigits: 2,
        //                                     maximumFractionDigits: 2
        //                                 }).format(row.total_balance)}
        //                             </TableCell>
        //                         </TableRow>
        //                     ) : (
        //                         <TableRow key={i} sx={{ height: 50 }}>
        //                             <TableCell
        //                                 sx={{
        //                                     borderRight: "1px solid #ddd",
        //                                     height: 50,
        //                                     fontSize: '14px'
        //                                 }}
        //                             >
        //                                 {row.bank_group_name}
        //                             </TableCell>
        //                             <TableCell align="right">
        //                                     <Typography
        //                                        onClick={() => handleCellClick(row?.id)}
        //                                         sx={{
        //                                             color: '#376a7d !important',
        //                                             cursor: 'pointer',
        //                                             fontWeight: '600'
        //                                         }}
        //                                     >
        //                                         {new Intl.NumberFormat("en-IN", {
        //                                             minimumFractionDigits: 2,
        //                                             maximumFractionDigits: 2
        //                                         }).format(row.total_balance)}
        //                                     </Typography>
        //                             </TableCell>
        //                         </TableRow>
        //                     )
        //                 })}
        //             </TableBody>
        //         </Table>
        //     </TableContainer>
        // </Box>
        <Box sx={{
            p: 3,
            maxWidth: 800,
            mx: "auto",
            fontFamily: "'Roboto', sans-serif"
        }}>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <Table size="small" sx={{
                    borderCollapse: "separate",
                    borderSpacing: 0,
                }}>
                    <TableHead sx={{
                        background: 'linear-gradient(135deg, #376a7d 0%, #2a5262 100%)',
                        '& th': {
                            borderBottom: 'none'
                        }
                    }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: '14px',
                                    width: '60%',
                                    py: 2,
                                    borderRight: "1px solid rgba(255,255,255,0.1)",
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Bank Groups
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: '14px',
                                    width: '40%',
                                    py: 2,
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Bank Balance
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, i) => {
                            const isCashInHand = row?.bank_group_name?.toLowerCase() === 'cash in hand';
                            const isTotal = row?.bank_group_name?.toLowerCase() === 'total';
                            return isCashInHand || isTotal ? (
                                <TableRow
                                    key={i}
                                    sx={{
                                        backgroundColor: isTotal ? '#f8f9fa' : '#e8f4ff',
                                        '&:hover': {
                                            backgroundColor: isTotal ? '#f1f3f5' : '#e0ecfa'
                                        }
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            borderRight: "1px solid rgba(0,0,0,0.05)",
                                            fontWeight: isTotal ? 'bold' : 600,
                                            color: isTotal ? '#2c3e50' : '#376a7d',
                                            fontSize: '14px',
                                            py: 2,
                                            borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {row?.bank_group_name}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: isTotal ? 'bold' : 600,
                                            color: isTotal ? '#2c3e50' : '#376a7d',
                                            fontSize: '14px',
                                            py: 2,
                                            borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {new Intl.NumberFormat("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(row.total_balance)}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow
                                    key={i}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(55, 106, 125, 0.03)'
                                        },
                                        '&:last-child td': {
                                            borderBottom: 'none'
                                        }
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            borderRight: "1px solid rgba(0,0,0,0.05)",
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            py: 2,
                                            color: '#4a5568',
                                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {row.bank_group_name}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            py: 2,
                                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <Box
                                            onClick={() => handleCellClick(row?.id)}
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                //   px: 1.5,
                                                py: 0.5,
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(55, 106, 125, 0.08)',
                                                    transform: 'translateX(-2px)'
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: '#376a7d',
                                                    fontWeight: '500',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {new Intl.NumberFormat("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(row.total_balance)}
                                            </Typography>
                                            <Box sx={{
                                                ml: 1,
                                                display: 'flex',
                                                color: 'rgba(55, 106, 125, 0.6)'
                                            }}>
                                                {/* <ArrowForwardIosIcon sx={{ fontSize: '12px' }} /> */}
                                            </Box>
                                        </Box>
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

