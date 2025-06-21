import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import moment from "moment";

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
        setCrumbs([{ name: "" }])
        getData();
    }, []);


    // const getData = async () => {
    //     setLoading(true);

    //     try {
    //         const res = await axios.get(
    //             '/api/finance/fetchAllBanknDetails?page=0&page_size=10000&sort=created_date'
    //         );
    //         const { Paginated_data } = res?.data?.data;

    //         const result = [];
    //         Paginated_data?.content?.forEach(item => {
    //             const groupId = item.bank_group_id;
    //             const groupName = item.bank_group_name;
    //             const balance = Number(item.bank_balance) || 0;

    //             const existingGroup = result.find(group => group.id === groupId);
    //             if (existingGroup) {
    //                 existingGroup.total_balance += balance;
    //             } else {
    //                 result.push({
    //                     id: groupId,
    //                     bank_group_name: groupName,
    //                     total_balance: balance,
    //                 });
    //             }
    //         });

    //         result.forEach(group => {
    //             group.total_balance = parseFloat(group.total_balance.toFixed(2));
    //         });

    //         const cashInHandIndex = result.findIndex(
    //             item => item.bank_group_name.toLowerCase() === 'cash in hand'
    //         );
    //         const cashInHand = cashInHandIndex !== -1 ? result.splice(cashInHandIndex, 1)[0] : null;

    //         const totalBalance = result.reduce((acc, curr) => acc + curr.total_balance, 0);
    //         const totalRow = {
    //             id: 'total',
    //             bank_group_name: 'TOTAL',
    //             total_balance: parseFloat(totalBalance.toFixed(2)),
    //             isTotal: true,
    //         };

    //         if (cashInHand) {
    //             cashInHand.isCashInHand = true;
    //             setRows([...result, totalRow, cashInHand]);
    //         } else {
    //             setRows([...result, totalRow]);
    //         }

    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


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
            const cashCreditIndex = result.findIndex(
                item => item.bank_group_name.toLowerCase() === 'cash credit group'
            );
            const cashInHand = cashInHandIndex !== -1 ? result.splice(cashInHandIndex, 1)[0] : null;
            const cashCredit = cashCreditIndex !== -1 ? result.splice(cashCreditIndex, 1)[0] : null;
            const totalBalance = result.reduce((acc, curr) => acc + curr.total_balance, 0);

            const totalRow = {
                id: 'total',
                bank_group_name: 'TOTAL',
                total_balance: parseFloat(totalBalance.toFixed(2)),
                isTotal: true,
            };

            const finalData = [...result, totalRow];

            if (cashCredit) {
                cashCredit.isCashCredit = true;
                finalData.push(cashCredit);
            }

            if (cashInHand) {
                cashInHand.isCashInHand = true;
                finalData.push(cashInHand);
            }

            setRows(finalData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = (bankGroupId) => {
        navigate('/institute-bank-balance', { state: { bankGroupId } })
    }

    return (
        <Box sx={{
            p: 3,
            maxWidth: 800,
            mx: "auto",
            fontFamily: "'Roboto', sans-serif"
        }}>
            {/* <Box sx={{
                            width: '100%',
                            margin: '20px auto 10px auto',
                            textAlign: 'left',
                            paddingRight: '12px'
                        }}>
                            <Typography variant="subtitle2" sx={{
                                fontWeight: 600,
                                color: '#376a7d',
                                // fontStyle: 'italic',
                                fontSize: '20px',
                                 textAlign: 'left'
                            }}>
                            {`Bank Balances as on ${moment().format('DD-MM-YYYY')}`}
                            </Typography>
                        </Box> */}
            <Box sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #2c3e50 0%, #376a7d 100%)',
                color: 'white',
                p: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    mb: 1
                }}>
                    JMJ EDUCATION SOCIETY
                </Typography>
                <Typography variant="Subtitle1" sx={{
                    fontWeight: 500,
                    opacity: 0.9
                }}>
                    Bank Balance as on {moment().format('DD MMMM YYYY')}
                </Typography>
            </Box>
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
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell
                                sx={{
                                    fontWeight: "600",
                                    fontSize: '14px',
                                    width: '60%',
                                    py: 2,
                                    letterSpacing: '0.5px',
                                    borderRight: "1px solid rgba(0,0,0,0.05)",
                                }}
                            >
                                Bank Groups
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
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
                            const name = row?.bank_group_name?.toLowerCase();
                            const isCashInHand = name === 'cash in hand';
                            const isTotal = name === 'total';
                            const isCashCredit = name === 'cash credit group';
                            return isCashInHand || isTotal || isCashCredit ? (
                                <TableRow
                                    key={i}
                                    sx={{
                                        backgroundColor: isTotal ? '#f8f9fa' : '#e8f4ff',
                                        '& .MuiTableCell-root': {
                                            py: '4px',
                                            height: '30px',
                                            fontSize: '13px',
                                        },
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
                                        {row?.total_balance}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow
                                    key={i}
                                    sx={{
                                        '& .MuiTableCell-root': {
                                            py: '4px',
                                            height: '30px',
                                            fontSize: '13px',
                                        },
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
                                        {row?.bank_group_name}
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
                                                {row?.total_balance}
                                            </Typography>
                                            <Box sx={{
                                                ml: 1,
                                                display: 'flex',
                                                color: 'rgba(55, 106, 125, 0.6)'
                                            }}>
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

