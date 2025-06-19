import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";

const initialValues = {
    voucherHeadId: "",
    fcYearId: "",
    fcYear: "",
    voucherHeadName: ""
};

function BRSChqDepositedNotCreditedDetail() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        balanceUpdatedOn: false,
        balanceUpdatedBy: false,
    })
    const navigate = useNavigate();
    const location = useLocation()
    const bankGroupId = location?.state?.id
    const setCrumbs = useBreadcrumbs();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    useEffect(() => {
        setCrumbs([{ name: "Bank Balance", link: "/bank-balance" }, { name: "Institute Account Balances" }])
    }, []);


    // useEffect(() => {
    //     if (bankGroupId)
    //         getData();
    // }, [bankGroupId]);

    const columns = [
        { field: "dd_no", headerName: "DD No", flex: 1, headerClassName: "header-bg", headerAlign: 'center', align: 'center' },
        { field: "dd_date", headerName: "DD Date", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
        { field: "dd_bank", headerName: "DD Bank", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
        { field: "amount", headerName: "Amount", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "receipt", headerName: "Receipt", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "receipt_date", headerName: "Receipt Date", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', }
    ];

    // const getData = async () => {
    //     const params = {
    //         bank_group_id: bankGroupId,
    //         page: 0,
    //         page_size: 10000,
    //         sort: 'created_date'
    //     }
    //     const baseUrl = "api/finance/fetchAllBanknDetailsByBankGroupId"
    //     setLoading(true)
    //     await axios
    //         .get(baseUrl, { params })
    //         .then((res) => {
    //             const { Paginated_data } = res?.data?.data
    //             setRows(Paginated_data?.content || []);
    //             setLoading(false)
    //         })
    //         .catch((err) => {
    //             setLoading(false)
    //             console.error(err)
    //         });
    // };

    return (

        <Box sx={{ position: "relative", width: "100%" }}>
            <Box sx={{
                width: "70%",
                margin: "20px auto",
                '& .header-bg': {
                    fontWeight: "bold",
                    backgroundColor: "#376a7d !important",
                    color: "#fff"
                },
            }}>
                <GridIndex
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    getRowClassName={(params) => params.row.isLastRow ? "last-row" : ""}
                    getRowId={(row) => row?.school_id}
                    // columnVisibilityModel={columnVisibilityModel}
                    // setColumnVisibilityModel={setColumnVisibilityModel}
                />
            </Box>
        </Box>
    );
}
export default BRSChqDepositedNotCreditedDetail;
