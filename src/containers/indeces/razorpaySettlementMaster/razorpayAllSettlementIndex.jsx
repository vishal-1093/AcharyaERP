import { useEffect, useState } from "react"
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import CustomFilter from "../../../components/Inputs/CustomCommonFilter";
import useAlert from "../../../hooks/useAlert";

const RazorPaySettlementIndex = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState()
    const { pathname } = useLocation();
    const navigate = useNavigate()
    const { setAlertMessage, setAlertOpen } = useAlert();

    useEffect(() => {
        updateSettlementDataintoDB()
        // getAllSettlementData()
    }, [])

    useEffect(() => {
        getAllSettlementData()
    }, [date])

    const updateSettlementDataintoDB = () => {
        setLoading(true)
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // getMonth() returns 0-11
        const day = today.getDate();
        axios.post(`/api/razorPaySettlements?year=${year}&month=${month}&day=${day}`)
            .then(res => {
                getAllSettlementData()
            })
    }

    const getAllSettlementData = () => {
        setLoading(true)

        const tabName = pathname.split("/").filter(Boolean)[1]
        const formatedDate = moment(date).format("YYYY-MM-DD")
        let params = {
            ...(tabName !== 'pending-settlement' && date && { settledDate: formatedDate }),
            ...(tabName === 'pending-settlement' && date && { date: formatedDate }),
        }
        const baseUrl = tabName === 'pending-settlement' ? `/api/allPendingSettlements` : `/api/settelmentSummary`
        axios.get(baseUrl, { params })
            .then(res => {
                const { data } = res
                setRows(data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
                 setAlertMessage({
                        severity: "error",
                        message: "Failed to Fetch, Please try after sometime",
                    });
                    setAlertOpen(true);
            })
    }

    const getSettlementData = (rowData) => {
        const { date, settlementId } = rowData
        navigate(`${pathname}/${settlementId}`, {
            state: {
                settlementDate: date,
            }
        })
    }
    const getReceiptData = (selectedSettlementId) => {
        navigate(`/razorpay-settlement-master/settlement-receipt/${selectedSettlementId}`)
    }
    const getPendingAmountData = (selectedSettlementId) => {
        navigate(`/razorpay-settlement-master/pending-settlement/${selectedSettlementId}`)
    }

    const handleChangeAdvance = (name, newValue) => {
        setDate(newValue)
    };

    const columns = [
        {
            field: "date",
            headerName: "Settlement date",
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            headerClassName: "header-bg"
        },
        {
            field: "settlementId",
            headerName: "Settlements",
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            headerClassName: "header-bg",
            renderCell: (params) => {
                return (<Button onClick={() => getSettlementData(params.row)}>
                    {params.row.settlementId}
                </Button>)
            }
        },
        {
            field: "totalCredit",
            headerName: "Settlement Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg"
        },
        {
            field: "receiptAmount",
            headerName: "Receipt Amount",
            flex: 1, type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg",
            renderCell: (params) => {
                if (params?.row?.receiptAmount > 0) {
                    return (<Button onClick={() => getReceiptData(params?.row?.settlementId)}>
                        {params?.row?.receiptAmount}
                    </Button>)
                } else {
                    return params?.row?.receiptAmount
                }
            }
        },
        {
            field: "totalDebit",
            headerName: "Transfer Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg"
        },
        {
            field: "uniformAmount",
            headerName: "Uniform Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg"
        },
        {
            field: "addOnAmount",
            headerName: "Add On Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg"
        },
        {
            field: "pendingAmount",
            headerName: "Pending Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg",
            renderCell: (params) => {
                if (params?.row?.pendingAmount > 0) {
                    return (<Button onClick={() => getPendingAmountData(params?.row?.settlementId)}>
                        {params?.row?.pendingAmount}
                    </Button>)
                } else {
                    return params?.row?.pendingAmount
                }
            }
        }
    ]

    return (
        <Box sx={{ position: "relative", mt: 2, mb: 3 }}>
            <Box sx={{ position: "absolute", top: -80, right: 0 }}>
                <CustomDatePicker
                    name="settlementDate"
                    label="Settlement Date"
                    value={date || ""}
                    handleChangeAdvance={handleChangeAdvance}
                    maxDate={new Date()}
                />
            </Box>
            <GridIndex
                rows={rows}
                columns={columns}
                loading={loading}
                rowSelectionModel={[]}
                getRowId={row => row.settlementId}
            />
        </Box>
    )
}

export default RazorPaySettlementIndex