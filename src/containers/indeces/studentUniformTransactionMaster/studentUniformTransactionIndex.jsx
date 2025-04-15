import { useState, useEffect } from "react";
import { Box, 
  Grid, 
  styled,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
  tooltipClasses
 } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import { MONTH_LIST_OPTION } from "../../../services/Constants";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";

const initialValues = {
    fcYearId: null,
    monthId: null,
    date: ""
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.headerWhite.main,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));
  

function StudentUniformTransactionIndex() {
    const [rows, setRows] = useState([]);
    const [brsTransactionData, setBrsTransactionDate] = useState([]);
    const [values, setValues] = useState(initialValues);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [showBrsModel, setShowBrsModel] = useState(false)
    const { setAlertMessage, setAlertOpen } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        getAcademicYears()
        const currentMonthNumber = moment().month() + 1;
        setValues((prev) => ({
            ...prev,
            monthId: currentMonthNumber
          }));
    }, []);

    useEffect(()=>{
        if(values.fcYearId && values.monthId)
        getData();
    },[values.fcYearId, values.monthId])

    const getData = async () => {
        const {fcYearId, monthId} = values

        const baseUrl = '/api/finance/getUniformTransactions'
        let params ={
            ...(fcYearId && { fcYearId }),
            ...(monthId && { month: monthId }),
        }
        await axios
            .get(baseUrl,{params})
            .then((res) => {
                setRows(res.data.data);
            })
            .catch((err)=>{
                console.error(err);
                setAlertMessage({
                    severity: "error",
                    message:
                      err.response?.data?.message || "Failed to fetch the uniform transaction data.",
                  });
                  setAlertOpen(true);
            })
    };

    const getBRSData = async (date) => {
      //  const {date} = values

        await axios
            .get(`/api/finance/getDateWiseUniformTransactions?date=${date}`)
            .then((res) => {
                console.log("resBrs", res)
                setBrsTransactionDate(res.data.data);
            })
            .catch((err)=>{
                console.error(err);
                setAlertMessage({
                    severity: "error",
                    message:
                      err.response?.data?.message || "Failed to fetch the data.",
                  });
                  setAlertOpen(true);
            })
    };

    const getAcademicYears = async () => {
        try {
          const response = await axios.get("/api/FinancialYear");
          const {data} = response?.data
          const optionData = data?.length > 0 && data?.map((obj, index)=>{
            return{value: obj.financial_year_id, label: obj.financial_year}
          }) 
           const currentYearId = optionData[optionData?.length-1]?.value;
          setAcademicYearOptions(optionData || []);
          setValues((prev) => ({
            ...prev,
            fcYearId: currentYearId,
          }));
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: "Failed to fetch the academic years !!",
          });
          setAlertOpen(true);
        }
      };

      const handleChangeAdvance = (name, newValue) => {
        setValues((prev) => ({
          ...prev,
          [name]: newValue
        }));
      };

      const handleAmountClick = (params) =>{
        getBRSData(params?.date)
        setShowBrsModel(true)
        setValues((prev) => ({
            ...prev,
            // date: params?.date
          }));
      }
     
      const columns = [
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            valueGetter: (value, row) => row?.transactionDate ? moment(row?.transactionDate).format("DD/MM/YYYY") : ""
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            renderCell: (params) => (
                <div onClick={() => handleAmountClick(params)}>{params?.row?.amount}</div>
              ),
        },
        {
            field: "bank_amount",
            headerName: "Bank Amount",
            flex: 1
        },
        {
            field: "adjustment",
            headerName: "Adjustment",
            flex: 1,
        },
        {
            field: "balance",
            headerName: "Balance",
            flex: 1
        },
    ]
    

    return (
        <Box sx={{ position: "relative" }}>
             <ModalWrapper
                    open={showBrsModel}
                    setOpen={setShowBrsModel}
                    maxWidth={1200}
                  >
                    <Grid container>
                      <Grid item xs={12} mt={2}>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>AUID</StyledTableCell>
                                <StyledTableCell>RPT</StyledTableCell>
                                <StyledTableCell>Receipt Date</StyledTableCell>
                                <StyledTableCell>Amount</StyledTableCell>
                                <StyledTableCell>OrderID</StyledTableCell>
                                <StyledTableCell>RazorPayID</StyledTableCell>
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {brsTransactionData?.length > 0 ? (
                                brsTransactionData?.map((obj, i) => {
                                  return (
                                    <StyledTableRow key={i}>
                                      <StyledTableCell>{obj.name}</StyledTableCell>
                                      <StyledTableCell>{obj.auid}</StyledTableCell>
                                      <StyledTableCell>{obj.rpt}</StyledTableCell>
                                      <StyledTableCell>{obj.receipt_date}</StyledTableCell>
                                      <StyledTableCell>
                                        {obj.order_id}
                                      </StyledTableCell>
                                      <StyledTableCell>{obj.razorpay_id}</StyledTableCell>
                                    </StyledTableRow>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </ModalWrapper>
              <Box>
                    <Grid container alignItems="center" mt={2} gap={2} sx={{display:"flex", justifyContent:"flex-end",}}>
                      <Grid item xs={2} md={2.4}>
                        <CustomAutocomplete
                          name="fcYearId"
                          options={academicYearOptions}
                          value={values?.fcYearId}
                          handleChangeAdvance={handleChangeAdvance}
                        />
                      </Grid>
                          <Grid item xs={12} md={2.4}>
                            <CustomAutocomplete
                              name="monthId"
                              label="Month"
                              options={MONTH_LIST_OPTION}
                              handleChangeAdvance={handleChangeAdvance}
                              value={values.monthId}
                            />
                          </Grid>
                    </Grid>
                  </Box>
                  <Box mt={2}>
                  <GridIndex rows={rows} columns={columns} getRowId={row => row.empId}  />
                  </Box>
        </Box>
    )
}
export default StudentUniformTransactionIndex;
