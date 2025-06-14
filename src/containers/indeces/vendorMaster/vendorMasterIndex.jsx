import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
    voucherHeadId: "",
    fcYearId: "",
    fcYear: "",
    voucherHeadName:""
};

function VendorMasterIndex() {
    const [rows, setRows] = useState([]);
    const [values, setValues] = useState();
    const [vendorOptions, setVendorOptions] = useState([]);
    const [fcYearOptions, setFCYearOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        usn: false,
        collageWaiver: false,
        hostelWaiver: false,
    })
    const navigate = useNavigate();
    const location = useLocation()
    const setCrumbs = useBreadcrumbs();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

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
                        debit: obj?.debit,
                        credit: obj?.credit,
                        school_id: obj?.school_id,
                        isLastRow: false,
                        openingBalance: obj?.openingBalance < 0
                            ? `${Math.abs(obj?.openingBalance)} Cr`
                            : obj?.openingBalance === 0
                                ? 0
                                : `${obj?.openingBalance} Dr`,

                        closingBalance: obj?.closingBalance < 0
                            ? `${Math.abs(obj?.closingBalance?.toFixed(2))} Cr`
                            : obj?.closingBalance === 0
                                ? 0
                                : `${obj?.closingBalance?.toFixed(2)} Dr`,
                    })
                })
                if (data?.vendorDetails?.length > 0) {
                    rowData.push({
                        school_name_short: "",
                        openingBalance: data?.openingBalance,
                        debit: data?.totalDebit,
                        credit: data?.totalCredit,
                        closingBalance: data?.openingBalance,
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

    const handleChangeAdvance = (name, newValue) => {
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
                [name]: newValue
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

    <ButtonGroup variant="contained" size="small">
      <Button
        onClick={handlePrevOBClick}
        disabled={values?.fcYearId === fcYearOptions[fcYearOptions?.length - 1]?.value}
      >
        Prev Year
      </Button>
      <Button
        onClick={handleNextOBClick}
        disabled={values?.fcYearId === fcYearOptions[0]?.value}
      >
        Next Year
      </Button>
    </ButtonGroup>
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
      fontSize:'16px'
    }}>
      As reported on {new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })}
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
      onRowClick={(params) => {
        if (params?.row?.isLastRow) return;
        navigate('/Accounts-ledger-monthly-detail', {
          state: {
            ...values,
            schoolId: params.row.school_id,
            schoolName: params.row.school_name_short,
            fcYearOpt: fcYearOptions || []
          }
        })
      }}
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
