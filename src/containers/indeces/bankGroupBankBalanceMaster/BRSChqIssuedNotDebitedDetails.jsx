import { useState, useEffect } from "react";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

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


function BRSChqNotIssuedDebitedDetail() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [breadCrumbs, setBreadCrumbs] = useState([])
    const location = useLocation()
    const queryValues = location?.state
    const bankGroupId = location?.state?.id
    const setCrumbs = useBreadcrumbs();

 useEffect(() => {
        setBreadCrumbs([
            { name: "Bank Balance", link: "/bank-balance" },
            { name: "BRS", link: "/institute-bank-balance", state: { id: queryValues?.id } },
            { name: "BRS Transactions", link:"/institute-brs-transaction", state:queryValues },
            { name: "Cheque Issued not Presented"},
        ]);
        setCrumbs([]);
        getChqIssuedNotDebitData();
    }, []);

    const columns = [
        { field: "vochar_no", headerName: "VCHR No", flex: 1, headerClassName: "header-bg", headerAlign: 'center', align: 'center' },
        { field: "vochar_date", headerName: "Date", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center',
             renderCell : (params) =>{
                            return params.row.vochar_date ? moment(params.row.vochar_date).format("DD-MM-YYYY") : ""
                        }
         },
        { field: "pay_to", headerName: "Pay To", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
        { field: "amount", headerName: "Amount", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', }
    ];

      const getChqIssuedNotDebitData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`/api/finance/getChqIssuedNotDebit?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const { data } = res?.data
                setRows(data?.paymentVouchers || [])
            })
            .catch((err) => console.error(err));
    };
    return (

        <Box sx={{ position: "relative", width: "100%" }}>
              <CustomBreadCrumbs crumbs={breadCrumbs} />
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
                    getRowId={(row) => row?.vochar_no}
                />
            </Box>
        </Box>
    );
}
export default BRSChqNotIssuedDebitedDetail;

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
