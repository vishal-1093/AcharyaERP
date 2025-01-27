import { Grid } from "@mui/material"
import React, { useEffect, useState } from "react"
import GridIndex from "./GridIndex"
import axios from "../services/Api"
import moment from "moment"

const PaymentGatewayTransaction = () => {
    const [loading, setLoading] = useState(true)
    const [tableRows, setTableRows] = useState([])
    const [tableColumns, setTableColumns] = useState([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId
        axios.get(`/api/finance/getFeePaymentWindowBasedOnUserId?user_id=${174}`)
        .then(res => {
            if (res.data.data && res.data?.data?.length <= 0) {
                setTableColumns([])
                setTableRows([])
                setLoading(false)
                return
            }
            const columns = [
                {field: "username", headerName: "Name", flex: 1},
                {field: "email", headerName: "Email", flex: 1},
                {field: "mobile", headerName: "Mobile", flex: 1},
                {field: "window_type", headerName: "Type", flex: 1},
                {field: "transaction_id", headerName: "Transaction Id", flex: 1},
                {field: "created_date", headerName: "Date", flex: 1, renderCell: (params) => moment(new Date(params.row.created_date)).format("DD-MM-YYYY")},
                {field: "amount", headerName: "Amount", flex: 1, type: 'number'},
                {field: "remarks", headerName: "Remarks", flex: 1},
            ]

            setTableRows(res.data.data)
            setTableColumns(columns)
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            setTableColumns([])
            setTableRows([])
        })
    }

    return (<Grid container sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={12} lg={tableColumns.length <= 4 ? 8 : 12}>
            <GridIndex rows={tableRows} columns={tableColumns} getRowId={row => row.fee_payment_window_id} loading={loading} />
        </Grid>
    </Grid>)
}

export default PaymentGatewayTransaction