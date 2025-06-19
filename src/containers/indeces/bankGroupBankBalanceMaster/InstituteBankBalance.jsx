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

function InstituteBankBalance() {
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


    useEffect(() => {
        if (bankGroupId)
            getData();
    }, [bankGroupId]);

    const columns = [
        { field: "bank_group_name", headerName: "Bank Group", flex: 1, headerClassName: "header-bg", headerAlign: 'center', align: 'center' },
        { field: "school_name", headerName: "Institute", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
        { field: "bank_name", headerName: "Bank", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
        { field: "closing_balance", headerName: "Book Balance", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        {
            field: "brs_transaction", headerName: "BRS Transaction", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center',
            renderCell: (params) => {
                return <Typography
                    onClick={handleBRSAmount}
                    sx={{
                        color: '#376a7d !important',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    {new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(45555555)}
                </Typography>
            }
        },
        {
            field: "balanceUpdatedOn",
            headerName: "BB Updated On",
            flex: 1,
            headerClassName: "header-bg",
            align: 'center',
            headerAlign: 'center',
            renderCell:(params)=>{
            return params?.row?.balanceUpdatedOn ? moment(params?.row?.balanceUpdatedOn).format("DD-MM-YYYY h:mm:ss a") : ""
           }
        },
        { field: "balanceUpdatedBy", headerName: "BB Updated By", flex: 1, headerClassName: "header-bg", align: 'center', headerAlign: 'center', },
    ];

    const getData = async () => {
        const params = {
            bank_group_id: bankGroupId,
            page: 0,
            page_size: 10000,
            sort: 'created_date'
        }
        const baseUrl = "api/finance/fetchAllBanknDetailsByBankGroupId"
        setLoading(true)
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                const { Paginated_data } = res?.data?.data
                setRows(Paginated_data?.content || []);
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.error(err)
            });
    };

    const handleBRSAmount = () =>{
     navigate('/institute-brs-transaction', { state: { id: bankGroupId } })
    }

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
                    columnVisibilityModel={columnVisibilityModel}
                    setColumnVisibilityModel={setColumnVisibilityModel}
                />
            </Box>
        </Box>
    );
}
export default InstituteBankBalance;
