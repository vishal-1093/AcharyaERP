// import { useState, useEffect } from "react";
// import { Box, Typography } from "@mui/material";
// import GridIndex from "../../../components/GridIndex";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../../../services/Api";
// import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
// import moment from "moment";

// const initialValues = {
//     voucherHeadId: "",
//     fcYearId: "",
//     fcYear: "",
//     voucherHeadName: ""
// };

// function InstituteBankBalance() {
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(false)
//     const [columnVisibilityModel, setColumnVisibilityModel] = useState({
//         balanceUpdatedOn: false,
//         balanceUpdatedBy: false,
//     })
//     const navigate = useNavigate();
//     const location = useLocation()
//     const bankGroupId = location?.state?.id
//     const setCrumbs = useBreadcrumbs();
//     const roleShortName = JSON.parse(
//         sessionStorage.getItem("AcharyaErpUser")
//     )?.roleShortName;

//     useEffect(() => {
//         setCrumbs([{ name: "Bank Balance", link: "/bank-balance" }, { name: "Institute Account Balances" }])
//     }, []);


//     useEffect(() => {
//         if (bankGroupId)
//             fetchDataInParallel()
//         //     getData();
//         // getClosingBalance()
//     }, [bankGroupId]);

//     const columns = [
//         { field: "bank_name", headerName: "Bank", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
//         { field: "school_name_short", headerName: "Institute", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
//         { field: "closing_balance", headerName: "Book Balance", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
//         { field: "bank_balance", headerName: "Bank Balance", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
//         {
//             field: "brs_transaction", headerName: "BRS Difference", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center',
//             renderCell: (params) => {
//                 return <Typography
//                     onClick={handleBRSAmount}
//                     sx={{
//                         color: '#376a7d !important',
//                         cursor: 'pointer',
//                         fontWeight: '600'
//                     }}
//                 >
//                     {new Intl.NumberFormat("en-IN", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2
//                     }).format(45555555)}
//                 </Typography>
//             }
//         },
//         {
//             field: "balanceUpdatedOn",
//             headerName: "BB Updated On",
//             flex: 1,
//             headerClassName: "header-bg",
//             align: 'center',
//             headerAlign: 'center',
//             renderCell:(params)=>{
//             return params?.row?.balanceUpdatedOn ? moment(params?.row?.balanceUpdatedOn).format("DD-MM-YYYY h:mm:ss a") : ""
//            }
//         },
//     ];

//     // const getData = async () => {
//     //     const params = {
//     //         bank_group_id: bankGroupId,
//     //         page: 0,
//     //         page_size: 10000,
//     //         sort: 'created_date'
//     //     }
//     //     const baseUrl = "api/finance/fetchAllBanknDetailsByBankGroupId"
//     //     setLoading(true)
//     //     await axios
//     //         .get(baseUrl, { params })
//     //         .then((res) => {
//     //             const { Paginated_data } = res?.data?.data
//     //             setRows(Paginated_data?.content || []);
//     //              const closingBalanceData =  getClosingBalance()
//     //              console.log("closingBalanceData+++", closingBalanceData)
//     //             setLoading(false)
//     //         })
//     //         .catch((err) => {
//     //             setLoading(false)
//     //             console.error(err)
//     //         });
//     // };
//     // const getClosingBalance = async () => {
//     //     const params = {
//     //         bank_group_id: bankGroupId,
//     //         page: 0,
//     //         page_size: 10000,
//     //         sort: 'created_date'
//     //     }
//     //     // setLoading(true)
//     //     await axios
//     //         .get(`/api/finance/getLedgerByBankGroupId?bankGroupId=${bankGroupId}`)
//     //         .then((res) => {
//     //             const { Paginated_data } = res?.data?.data
//     //             // setRows(Paginated_data?.content || []);
//     //             // setLoading(false)
//     //             return Paginated_data || []
//     //         })
//     //         .catch((err) => {
//     //             // setLoading(false)
//     //             console.error(err)
//     //         });
//     // };

//     const handleBRSAmount = () =>{
//      navigate('/institute-brs-transaction', { state: { id: bankGroupId } })
//     }

//    const fetchDataInParallel = async () => {
//   const params = {
//     bank_group_id: bankGroupId,
//     page: 0,
//     page_size: 10000,
//     sort: 'created_date'
//   };

//   try {
//     setLoading(true);

//     const [detailsRes, ledgerRes] = await Promise.all([
//       axios.get("api/finance/fetchAllBanknDetailsByBankGroupId", { params }),
//       axios.get(`/api/finance/getLedgerByBankGroupId?bankGroupId=${bankGroupId}`)
//     ]);

//     const details = detailsRes?.data?.data?.Paginated_data?.content || [];
//     const ledger = ledgerRes?.data?.data || [];

//     // Map using composite key: school_id + bank_id
//     const balanceMap = new Map();

//     ledger.forEach(item => {
//       const schoolId = item?.school_id;
//       const bankId = item?.bankId; // replace if you use `id` instead
//       const closingBalance = item?.closingBalance || 0;

//       const key = `${schoolId}_${bankId}`;

//       // Store balance per unique (school, bank) combination
//       if (balanceMap.has(key)) {
//         const current = balanceMap.get(key);
//         balanceMap.set(key, current + closingBalance); // If needed, accumulate
//       } else {
//         balanceMap.set(key, closingBalance);
//       }
//     });

//     // Merge into each bank row
//     const mergedData = details.map(row => {
//       const schoolId = row.school_id;
//       const bankId = row?.id; // replace if different
//       const key = `${schoolId}_${bankId}`;

//       return {
//         ...row,
//         closing_balance: balanceMap.get(key) || 0
//       };
//     });

//     setRows(mergedData);
//   } catch (error) {
//     console.error("Error fetching bank data:", error);
//   } finally {
//     setLoading(false);
//   }
// };


//     console.log("rows++++", rows)

//     return (

//         <Box sx={{ position: "relative", width: "100%" }}>
//             <Box sx={{
//                 width: "70%",
//                 margin: "20px auto",
//                 '& .header-bg': {
//                     fontWeight: "bold",
//                     backgroundColor: "#376a7d !important",
//                     color: "#fff"
//                 },
//             }}>
//                 <GridIndex
//                     rows={rows}
//                     columns={columns}
//                     loading={loading}
//                     getRowClassName={(params) => params.row.isLastRow ? "last-row" : ""}
//                     getRowId={(row) => row?.school_id}
//                     // columnVisibilityModel={columnVisibilityModel}
//                     // setColumnVisibilityModel={setColumnVisibilityModel}
//                 />
//             </Box>
//         </Box>
//     );
// }
// export default InstituteBankBalance;


import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    makeStyles,
    Tooltip,
    CircularProgress
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const InstituteBankBalance = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [currFcYear, setCurrFcYear] = useState({})
    const [fcYearOption, setFcYearOption] = useState([])
    const [breadCrumbs, setBreadCrumbs] = useState([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        balanceUpdatedOn: false,
        balanceUpdatedBy: false,
    })
    const navigate = useNavigate();
    const location = useLocation()
    const bankGroupId = location?.state?.bankGroupId
    const setCrumbs = useBreadcrumbs();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    useEffect(() => {
        setCrumbs([{ name: "Bank Balance", link: "/bank-balance" }, { name: "BRS" }])
    }, []);


    useEffect(() => {
        if (bankGroupId)
            fetchDataInParallel()
        getFinancialYearDetails()
    }, [bankGroupId]);

    const fetchDataInParallel = async () => {
        const params = {
            bank_group_id: bankGroupId,
            page: 0,
            page_size: 10000,
            sort: 'created_date'
        };

        try {
            setLoading(true);

            const [detailsRes, ledgerRes] = await Promise.all([
                axios.get("api/finance/fetchAllBanknDetailsByBankGroupId", { params }),
                axios.get(`/api/finance/getLedgerByBankGroupId?bankGroupId=${bankGroupId}`)
            ]);

            const details = detailsRes?.data?.data?.Paginated_data?.content || [];
            const ledger = ledgerRes?.data?.data || [];
            const balanceMap = new Map();
            ledger.forEach(item => {
                const key = `${item.school_id}_${item.bankId}`;
                balanceMap.set(key, {
                    closing_balance: item.closingBalance || 0,
                    brs_amount: item.brs_amount || 0
                });
            });
            const mergedData = details.map(row => {
                const key = `${row.school_id}_${row.id}`;
                const match = balanceMap.get(key);

                return {
                    ...row,
                    closing_balance: match?.closing_balance ?? null,
                    brs_amount: match?.brs_amount ?? null
                };
            });
            setLoading(false)
            setRows(mergedData);
        } catch (error) {
            console.error("Error fetching bank data:", error);
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    const getFinancialYearDetails = async () => {
        await axios
            .get(`/api/FinancialYear`)
            .then((res) => {
                const { data } = res?.data
                const filteredOptions = data?.length > 0 && data?.filter(item => item?.financial_year >= "2025-2026")
                const optionData = filteredOptions?.map(item => ({
                    label: item.financial_year,
                    value: item.financial_year_id
                }));
                setFcYearOption(optionData || [])
                setCurrFcYear({
                    ['fcYearId']: optionData[0]?.value || "",
                    ['fcYear']: optionData[0]?.label
                });
            })
            .catch((err) => console.error(err));
    };

    const viewClosingBalanceDetails = (voucher_head_new_id, schoolId, schoolName, bankName, bankId) => {
        const queryValues = { voucherHeadId: voucher_head_new_id, schoolId, voucherHeadName: bankName, fcYearOpt: fcYearOption, isBRSTrue: true, bankGroupId, bankId, ...currFcYear }
        navigate('/Accounts-ledger-monthly-detail', { state: queryValues })
    }

    const handleBRSAmount = (row) => {
        const queryValues = { bankBalance: row?.bank_balance, closingBalance: row?.closing_balance, bankGroupId, schoolId: row?.school_id, bankId: row?.id, accountNo: row?.account_number, bankName: row?.bank_name, schoolName: row?.school_name }
        navigate('/institute-brs-transaction', { state: queryValues })
    }

    const headers = [
        { id: 'bank', label: 'Bank', width: '15%' },
        { id: 'institute', label: 'Institute', width: '20%' },
        { id: 'closing_balance', label: 'Book Balance', width: '15%', align: 'right' },
        { id: 'bank_balance', label: 'Bank Balance', width: '15%', align: 'right' },
        { id: 'brs_amount', label: 'BRS Difference', width: '15%', align: 'right' },
        { id: 'updated', label: 'BB updated date', width: '20%', align: 'center' }
    ];

    return (
        <Paper elevation={0} sx={{
            width: "90%",
            margin: "auto",
            mt: 4,
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '200px'
        }}>
            {loading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: '#376a7d' }} />
                </Box>
            )}

            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        tableLayout: 'fixed',
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        '& .MuiTableCell-root': {
                            borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                            padding: '8px 16px',
                            height: '40px'
                        },
                        '& .MuiTableHead-root .MuiTableCell-root': {
                            borderBottom: 'none'
                        }
                    }}
                >
                    <TableHead
                        sx={{
                            background: 'linear-gradient(135deg, #376a7d 0%, #2a5262 100%)',
                            '& .MuiTableCell-root': {
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: '13px',
                                letterSpacing: '0.5px',
                                py: '12px'
                            }
                        }}>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header.id}
                                    align={header.align || 'left'}
                                    sx={{
                                        width: header.width,
                                        borderRight: header.id !== 'updated' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                    }}
                                >
                                    {header.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row, index) => {
                                const isBalanced = row?.brs_difference === 0;
                                return <TableRow
                                    key={index}
                                    sx={{
                                        '& .MuiTableCell-root': {
                                            py: '4px',
                                            height: '30px',
                                            // fontSize: '13px', 
                                        },
                                    }}
                                // hover
                                // sx={{
                                //     backgroundColor: isBalanced ? 'rgba(102, 187, 106, 0.08)' : 'rgba(239, 83, 80, 0.08)',
                                //     '&:hover': {
                                //         backgroundColor: isBalanced ? 'rgba(102, 187, 106, 0.12)' : 'rgba(239, 83, 80, 0.12)'
                                //     },
                                //     transition: 'background-color 0.3s ease'
                                // }}
                                >
                                    <TableCell align="left" sx={{ fontWeight: 500 }}>
                                        {row.bank_name}
                                    </TableCell>
                                    <TableCell align="left" sx={{
                                        width: '20%',
                                    }}>
                                        {row.school_name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="text"
                                            onClick={() => viewClosingBalanceDetails(
                                                row?.voucher_head_new_id,
                                                row?.school_id,
                                                row?.school_name,
                                                row?.bank_name,
                                                row?.id
                                            )}
                                            sx={{
                                                color: '#376a7d',
                                                fontWeight: 500,
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                minWidth: 0,
                                                padding: '4px 8px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(55, 106, 125, 0.1)'
                                                }
                                            }}
                                        >
                                            {/* {formatCurrency(row?.closing_balance)} */}
                                            {row?.closing_balance}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                        {/* {formatCurrency(row?.bank_balance)} */}
                                        {row?.bank_balance}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="text"
                                            onClick={() => handleBRSAmount(row)}
                                            sx={{
                                                color: '#376a7d',
                                                fontWeight: 500,
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                minWidth: 0,
                                                padding: '4px 8px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(55, 106, 125, 0.1)'
                                                }
                                            }}
                                        >
                                            {formatCurrency(row?.brs_amount || 0)}
                                            {/* {row?.brs_difference } */}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: '#666', fontSize: '12px' }}>
                                        {row?.balanceUpdatedOn ?
                                            moment(row?.balanceUpdatedOn).format("DD-MM-YYYY h:mm:ss a") :
                                            ''}
                                    </TableCell>
                                </TableRow>
                            })
                        ) : (
                            // No Data State
                            <TableRow>
                                <TableCell colSpan={headers.length} align="center" sx={{ py: 4 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        color: 'text.secondary'
                                    }}>
                                        <img
                                            src="/images/no-data.svg"
                                            alt="No data"
                                            style={{ width: '120px', opacity: 0.6, marginBottom: '16px' }}
                                        />
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            No reconciliation data available
                                        </Typography>
                                        {/* <Typography variant="body2" sx={{ mt: 1 }}>
                                            {loading ? 'Loading data...' : 'Try adjusting your filters or check back later'}
                                        </Typography> */}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default InstituteBankBalance;
