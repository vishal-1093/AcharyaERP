import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
    Box,
    Typography,
    Grid,
    styled,
    Tooltip,
    tooltipClasses,
    Breadcrumbs,
} from "@mui/material";
import axios from "../../../services/Api.js";
import moment from "moment";
import { useLocation, useNavigate } from 'react-router-dom';

function LedgerDebitContraDetail() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        created_by: false
    });
    const location = useLocation()
    const queryValues = location.state;

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        const { voucherHeadId, fcYearId, schoolId, month, date } = queryValues
        const params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(fcYearId && { fcYearId }),
            ...(schoolId && { schoolId }),
            ...(date && { date }),
            ...(month && { month })
        }
        const baseUrl = '/api/finance/getAllContraByDate'
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                setLoading(false);
                setRows(res?.data?.data);
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });
    };

    const columns = [
        {
            field: "voucher_no",
            headerName: "Voucher No",
            flex: 1,
            align: 'center'
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            headerAlign: "right",
            align: 'center',
            valueGetter: (value, row) => Math.round(value),
        },
        {
            field: "collection_date",
            headerName: "Collection Date",
            flex: 1,
            align:"center",
            valueGetter: (row, value) => moment(row).format("DD-MM-YYYY"),
        },
         {
            field: "created_by",
            headerName: "Created By",
            flex: 1
        },
        {
            field: "created_date",
            headerName: "Created date",
            flex: 1,
            valueGetter: (row, value) => moment(row).format("DD-MM-YYYY"),
            align: 'center'
        },
        {
            field: "remarks",
            headerName: "Remarks",
            flex: 1,
            align: "left",
            renderCell: (params) => {
                return <Typography>Cash remitted to Bank</Typography>
            }
        },
    ];

    return (
        <Box sx={{ position: "relative" }}>
            <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
                <GridIndex
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    getRowId={(row, index) => row?.contra_voucher_id}
                    columnVisibilityModel={columnVisibilityModel}
                    setColumnVisibilityModel={setColumnVisibilityModel}
                />
            </Box>
        </Box>
    );
}

export default LedgerDebitContraDetail;