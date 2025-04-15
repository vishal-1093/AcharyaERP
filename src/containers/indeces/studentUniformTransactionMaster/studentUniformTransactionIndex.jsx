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
  tooltipClasses,
  Typography
 } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import { MONTH_LIST_OPTION } from "../../../services/Constants";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import OverlayLoader from "../../../components/OverlayLoader";

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
    const [loading, setLoading] = useState(false)

    const { setAlertMessage, setAlertOpen } = useAlert();
    const setCrumbs = useBreadcrumbs();

    useEffect(() => {
        getAcademicYears()
        const currentMonthNumber = moment().month() + 1;
        setValues((prev) => ({
            ...prev,
            monthId: currentMonthNumber
          }));
          setCrumbs([{ name: "Uniform Transactions" }]);
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
        setLoading(true)
        await axios
            .get(baseUrl,{params})
            .then((res) => {
                setRows(res.data.data);
                setLoading(false)
            })
            .catch((err)=>{
                console.error(err);
                setAlertMessage({
                    severity: "error",
                    message:
                      err.response?.data?.message || "Failed to fetch the uniform transaction data.",
                  });
                  setAlertOpen(true);
                  setLoading(false)
            })
    };

    const getBRSData = async (date) => {

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

      const handleAmountClick = (date) =>{
        getBRSData(date)
        setShowBrsModel(true)
        setValues((prev) => ({
            ...prev,
            // date: params?.date
          }));
      }
     
      const columns = [
        {
            field: "transactionDate",
            headerName: "Date",
            flex: 1,
            valueGetter: (value, row) => row?.transactionDate ? moment(row?.transactionDate).format("DD/MM/YYYY") : ""
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            headerAlign: "center",
            cellClassName: "rightAlignedCell",
            renderCell: (params) => (
                <Typography
                  onClick={() => handleAmountClick(params?.row?.transactionDate)}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    cursor: "pointer",
                    textAlign: "right",
                    width: "100%",
                    border: "none"
                  }}
                  variant="body2"
                >
                  {params?.row?.amount}
                </Typography>
              ),
        },
        {
            field: "bankAmount",
            headerName: "Bank Amount",
            flex: 1,
            headerAlign: "center",
            cellClassName: "rightAlignedCell",
        },
        {
            field: "adjustment",
            headerName: "Adjustment",
            flex: 1,
            cellClassName: "rightAlignedCell",
            headerAlign: "center",
        },
        {
            field: "balance",
            headerName: "Balance",
            flex: 1,
            cellClassName: "rightAlignedCell",
            headerAlign: "center",
        },
    ]

     const modalData = () => {
        return (
          <>
            {loading ? (
              <Grid item xs={12} align="center">
                <OverlayLoader />
              </Grid>
            ) : (
            //   <TableContainer elevation={3} sx={{ maxWidth: 1300 }}>
            //     <Table size="small">
            //       <TableHead>
            //         <TableRow>
            //           <StyledTableCell>Topic</StyledTableCell>
            //           <StyledTableCell>Module</StyledTableCell>
            //           <StyledTableCell>learning Process</StyledTableCell>
            //           <StyledTableCell>Duration</StyledTableCell>
            //         </TableRow>
            //       </TableHead>
            //       <TableBody>
            //         {syllabusData.length > 0 ? (
            //           syllabusData.map((obj, i) => {
            //             return (
            //               <TableRow key={i}>
            //                 <StyledTableCell>
            //                   <Typography variant="subtitle2" color="textSecondary">
            //                     {obj?.topic_name ? obj?.topic_name : "--"}
            //                   </Typography>
            //                 </StyledTableCell>
            //                 <StyledTableCell>
            //                   <Typography variant="subtitle2" color="textSecondary">
            //                     {obj?.syllabus_objective
            //                       ? obj?.syllabus_objective
            //                       : "--"}
            //                   </Typography>
            //                 </StyledTableCell>
            //                 <StyledTableCell>
            //                   <Typography variant="subtitle2" color="textSecondary">
            //                     {obj?.learning ? obj?.learning : "--"}
            //                   </Typography>
            //                 </StyledTableCell>
            //                 <StyledTableCell>
            //                   <Typography
            //                     style={{ textAlign: "center" }}
            //                     variant="subtitle2"
            //                     color="textSecondary"
            //                   >
            //                     {obj?.duration ? obj?.duration : "--"}
            //                   </Typography>
            //                 </StyledTableCell>
            //               </TableRow>
            //             );
            //           })
            //         ) : (
            //           <TableRow>
            //             <TableCell colSpan={4} sx={{ textAlign: "center" }}>
            //               <Typography variant="subtitle2">No Records</Typography>
            //             </TableCell>
            //           </TableRow>
            //         )}
            //       </TableBody>
            //     </Table>
            //   </TableContainer>
            <TableContainer elevation={3} sx={{ maxWidth: 1300 }}>
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
                        <StyledTableCell>{obj.studentName}</StyledTableCell>
                        <StyledTableCell>{obj.auid}</StyledTableCell>
                        <StyledTableCell>{obj.RPTNo}</StyledTableCell>
                        <StyledTableCell>{obj.receiptDate}</StyledTableCell>
                        <StyledTableCell sx={{textAlign: "right"}}>{obj.amount}</StyledTableCell>
                        <StyledTableCell>{obj.orderId}</StyledTableCell>
                        <StyledTableCell>{obj.razorPayId}</StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
            )}{" "}
          </>
        );
      };
    

    return (
        <Box sx={{ position: "relative" }}>
             <ModalWrapper
                    open={showBrsModel}
                    setOpen={setShowBrsModel}
                    maxWidth={980}
                    title={
                        <Box sx={{ width: "100%", textAlign: "center", fontWeight: 600, fontSize: "1.3rem", color: "primary.main" }}>
                          BRS Transaction
                        </Box>
                      }
                  >
                    {/* <Grid container>
                    <Grid item xs={12} mt={2} textAlign={'center'}>
                        <Typography>BRS TRANSACTION</Typography>
                    </Grid>
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
                                      <StyledTableCell>{obj.studentName}</StyledTableCell>
                                      <StyledTableCell>{obj.auid}</StyledTableCell>
                                      <StyledTableCell>{obj.RPTNo}</StyledTableCell>
                                      <StyledTableCell>{obj.receiptDate}</StyledTableCell>
                                      <StyledTableCell sx={{textAlign: "right"}}>{obj.amount}</StyledTableCell>
                                      <StyledTableCell>{obj.orderId}</StyledTableCell>
                                      <StyledTableCell>{obj.razorPayId}</StyledTableCell>
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
                    </Grid> */}
                    {modalData()}
                  </ModalWrapper>
              <Box>
                    <Grid container alignItems="center" mt={2} gap={2} sx={{display:"flex", justifyContent:"flex-end",}}>
                      <Grid item xs={2} md={2.4}>
                        <CustomAutocomplete
                          label="Financial Year"
                          name="fcYearId"
                          options={academicYearOptions}
                          value={values?.fcYearId}
                          handleChangeAdvance={handleChangeAdvance}
                          required={true}
                        />
                      </Grid>
                          <Grid item xs={12} md={2.4}>
                            <CustomAutocomplete
                              name="monthId"
                              label="Month"
                              options={MONTH_LIST_OPTION}
                              handleChangeAdvance={handleChangeAdvance}
                              value={values.monthId}
                              required={true}
                            />
                          </Grid>
                    </Grid>
                  </Box>
                  <Box mt={2}>
                  <GridIndex rows={rows} columns={columns} getRowId={row => row.transactionDate} loading={loading} />
                  </Box>
        </Box>
    )
}
export default StudentUniformTransactionIndex;
