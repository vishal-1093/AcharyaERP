import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import LedgerMasterIndexPdf from './LedgerMasterIndexPdf';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const initialValues = {
    voucherHeadId: "",
    fcYearId: "",
    fcYear: "",
    voucherHeadName: ""
};

function VendorMasterIndex() {
    const [rows, setRows] = useState([]);
    const [values, setValues] = useState();
    const [vendorOptions, setVendorOptions] = useState([]);
    const [fcYearOptions, setFCYearOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    const [ledgerType, setLedgerType] = useState(false)
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        usn: false,
        collageWaiver: false,
        hostelWaiver: false,
    })
    const navigate = useNavigate();
    const location = useLocation()
    const setCrumbs = useBreadcrumbs();

    const columns = [
        { field: "school_name_short", headerName: "Institute", flex: 1, headerClassName: "header-bg", headerAlign: 'center', align: 'center' },
        { field: "openingBalance", headerName: "Opening Balance", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
        { field: "debit", headerName: "Debit", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "credit", headerName: "Credit", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "closingBalance", headerName: "Closing Balance", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
    ];

    useEffect(() => {
        setCrumbs([{ name: "Ledger" }])
        getVendorDetails();
        getFinancialYearDetails();
    }, []);

    useEffect(() => {
        // restore filters
        if (location?.state) {
            setValues(location.state);
            navigate(location.pathname, { replace: true, state: null });
        } else {
            setValues(initialValues)
        }
    }, []);

    useEffect(() => {
        if (values?.voucherHeadId && values?.fcYearId)
            getData();
    }, [values?.voucherHeadId, values?.fcYearId]);

    const getData = async () => {
        const { voucherHeadId, fcYearId } = values
        const baseUrl = "/api/finance/getLedgerSummaryByVoucherHeadId"
        const params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(fcYearId && { fcYearId }),
        }
        setLoading(true)
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                const { data } = res?.data
                const rowData = []
                data?.vendorDetails?.length > 0 && data?.vendorDetails?.map((obj) => {
                    rowData.push({
                        school_name_short: obj?.school_name_short,
                        debit: formatCurrency(obj?.debit),
                        credit: formatCurrency(obj?.credit),
                        school_id: obj?.school_id,
                        bankId: obj?.bankId,
                        isLastRow: false,
                        ledgerType: obj?.ledgerType,
                        //  openingBalance: obj?.openingBalance < 0
                        //     ? `${formatCurrency(Math.abs(obj?.openingBalance))} Cr`
                        //     : obj?.openingBalance === 0
                        //         ? 0
                        //         : `${formatCurrency(obj?.openingBalance)} Dr`,
                        //  closingBalance: obj?.closingBalance < 0
                        //     ? `${formatCurrency(Math.abs(obj?.closingBalance?.toFixed(2)))} Cr`
                        //     : obj?.closingBalance === 0
                        //         ? 0
                        //         : `${formatCurrency(obj?.closingBalance?.toFixed(2))} Dr`,
                        openingBalance: formatDrCr(obj?.openingBalance, obj?.ledgerType),
                        closingBalance: formatDrCr(obj?.closingBalance, obj?.ledgerType),
                    })
                })
                if (data?.vendorDetails?.length > 0) {
                    rowData.push({
                        school_name_short: "",
                        openingBalance: data?.openingBalance,
                        debit: data?.totalDebit,
                        credit: data?.totalCredit,
                        closingBalance: data?.closingBalance,
                        school_id: Date.now(),
                        isLastRow: true
                    })
                }
                setRows(rowData || []);
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.error(err)
            });
    };

    const formatDrCr = (value, ledgerType) => {
        const absVal = Math.abs(value);
        
        if (value === 0) return "0";

        if (ledgerType === "VENDOR") {
            return value < 0 ? `${absVal} Dr` : `${absVal} Cr`;
        } else if (ledgerType === "CASHORBANK") {
            return value > 0 ? `${absVal} Dr` : `${absVal} Cr`;
        } else {
            return value;
        }
    };


    const getVendorDetails = async () => {
        await axios
            .get('/api/finance/VoucherHeadNew')
            .then((res) => {
                const { data } = res?.data
                const optionData = [];
                data?.length > 0 && data?.forEach((obj) => {
                    optionData.push({
                        value: obj?.voucher_head_new_id,
                        label: obj?.voucher_head
                    });
                });
                setVendorOptions(optionData);
            })
            .catch((err) => console.error(err));
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

                setFCYearOptions(optionData || []);
                if (!location?.state) {
                    setValues((prev) => ({
                        ...prev,
                        ['fcYearId']: optionData[0]?.value || "",
                        ['fcYear']: optionData[0]?.label
                    }));
                }
            })
            .catch((err) => console.error(err));
    };

    const handleChangeAdvance = (name, newValue, valueLabel) => {
        if (name === 'fcYearId') {
            const fcYearObj = fcYearOptions?.length > 0 && fcYearOptions?.find((fc) => fc.value === newValue)
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                ['fcYear']: fcYearObj?.label
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                ['voucherHeadName']: valueLabel
            }));
        }
    };

    const handlePrevOBClick = () => {
        const currentIndex = fcYearOptions?.findIndex(
            (item) => item?.value === values?.fcYearId
        );
        if (currentIndex < fcYearOptions?.length - 1) {
            const prevYear = fcYearOptions[currentIndex + 1];
            setValues((prev) => ({
                ...prev,
                ['fcYearId']: prevYear?.value,
                ['fcYear']: prevYear?.label
            }));
        }
    };

    const handleNextOBClick = () => {
        const currentIndex = fcYearOptions?.findIndex(
            (item) => item?.value === values?.fcYearId
        );
        if (currentIndex > 0) {
            const nextFCYear = fcYearOptions[currentIndex - 1];
            setValues((prev) => ({
                ...prev,
                ['fcYearId']: nextFCYear?.value,
                ['fcYear']: nextFCYear?.label
            }));
        }
    };

    const formatCurrency = (value, decimals = 2) => {
        if (value === null || value === undefined || value === '') return `0.00`;
        if (typeof value === 'string' && (value.includes('Cr') || value.includes('Dr'))) {
            const parts = value.split(' ');
            const numValue = parseFloat(parts[0]);
            const suffix = parts[1] || '';

            if (isNaN(numValue)) return `0.00`;

            return `${numValue.toLocaleString('en-IN', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })} ${suffix}`;
        }

        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) return `0.00`;

        return numValue.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    const handleRowClick = (params) => {
        if (params?.row?.isLastRow) return;
        const query = {
                ...values,
                schoolId: params.row.school_id,
                schoolName: params.row.school_name_short,
                bankId: params.row.bankId,
                fcYearOpt: fcYearOptions || [],
                ledgerType: params?.row.ledgerType
            }
        navigate('/Accounts-ledger-monthly-detail', {state: query })
    }


    return (
        <Box sx={{ position: "relative" }}>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
                p: 2,
                backgroundColor: 'rgba(245, 245, 245, 0.5)',
                borderRadius: 1,
                alignItems: 'flex-end',
                width: '70%',
                margin: 'auto',
            }}>
                <Box sx={{ flex: 1, minWidth: 250 }}>
                    <CustomAutocomplete
                        name="voucherHeadId"
                        label="List Of Ledgers"
                        value={values?.voucherHeadId}
                        options={vendorOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        size="small"
                    />
                </Box>

                <Box sx={{ width: 200 }}>
                    <CustomAutocomplete
                        name="fcYearId"
                        label="Financial Year"
                        value={values?.fcYearId}
                        options={fcYearOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        disabled={true}
                        size="small"
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'end' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handlePrevOBClick}
                        disabled={values?.fcYearId === fcYearOptions[fcYearOptions?.length - 1]?.value}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                            fontWeight: 500,
                            color: '#424242',
                            height: '36px'
                        }}
                    >
                        Prev Year
                    </Button>
                    <Button
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleNextOBClick}
                        disabled={values?.fcYearId === fcYearOptions[0]?.value}
                        sx={{
                            backgroundColor: '#e3f2fd',
                            '&:hover': {
                                backgroundColor: '#bbdefb',
                            },
                            fontWeight: 500,
                            color: '#1976d2',
                            height: '36px'
                        }}
                    >
                        Next Year
                    </Button>
                    {/* <BlobProvider
                        document={
                            <LedgerMasterIndexPdf
                                data={{ columns, rows }}
                                filters={{
                                    voucherHeadName: values?.voucherHeadName,
                                    fcYear: values?.fcYear
                                }}
                            />
                        }
                    >
                        {({ url, loading }) => (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={rows?.length === 0}
                                onClick={() => {
                                    if (url) {
                                        window.open(url, '_blank');
                                    }
                                }}
                                sx={{ height:'36px' }}
                            >
                                Print PDF
                            </Button>
                        )}
                    </BlobProvider> */}
                </Box>
            </Box>
            <Box sx={{
                width: '70%',
                margin: '20px auto 10px auto',
                textAlign: 'left',
                paddingRight: '12px'
            }}>
                <Typography variant="subtitle2" sx={{
                    fontWeight: 600,
                    color: '#376a7d',
                    fontStyle: 'italic',
                    fontSize: '16px',
                    textAlign: 'center'
                }}>
                    {values?.voucherHeadName ? (
                        `${values?.voucherHeadName} Ledger for FY ${values?.fcYear} as on ${moment().format('DD-MM-YYYY')}`
                    ) : (
                        <></>
                    )}
                </Typography>
            </Box>
            <Box sx={{
                height: 'calc(100vh - 220px)',
                width: '70%',
                margin: 'auto',
                '& .last-row': {
                    fontWeight: 700,
                    backgroundColor: "#376a7d !important",
                    color: "#fff"
                },
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
                    isRowSelectable={(params) => !params.row.isLastRow}
                    onRowClick={(params) => handleRowClick(params)}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer',
                            backgroundColor: 'rgba(55, 106, 125, 0.08)',
                        },
                        '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    }}
                />
            </Box>
        </Box>
    );
}
export default VendorMasterIndex;
