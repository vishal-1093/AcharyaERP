import { useState, lazy } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import { HighlightOff } from "@mui/icons-material";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: "100%",
    margin: "20px 0",
  },
  tableBody: {
    height: 10,
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
  table: {
    "& .MuiTableCell-root": {
      minWidth: 100,
      border: "1px solid rgba(192,192,192,1)",
      fontSize: "15px",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: "50px",
    },
  },
}));

const initialState = {
  auid: "",
  loading: false,
  tableRowloading: false,
  studentDetail: [],
  acerpAmountList: [],
};

const TechWeb = () => {
  const [
    { auid, loading, tableRowloading, studentDetail, acerpAmountList },
    setState,
  ] = useState(initialState);
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeFormField = (e, i) => {
    if (studentDetail.length > 0) {
      let { name, value } = e.target;
      const onChangeReqVal = JSON.parse(
        JSON.stringify(studentDetail[0].amountList)
      );
      onChangeReqVal[i][name] = value;
      setState((prev) => ({
        ...prev,
        studentDetail: studentDetail.map((el) => ({
          ...el,
          amountList: onChangeReqVal,
        })),
      }));
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const getStudentDetailByAuid = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/student/studentDetailsByAuid/${auid}`);
      if (res.status === 200 || res.status === 201) {
        getAcerpAmountByAuid(res.data.data);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.res ? error.res.data.message : "An error occured",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const getAcerpAmountByAuid = async (studentData) => {
    try {
      const res = await axios.get(`/api/student/getAcerpAmountByAuid/${auid}`);
      if (res.status === 200 || res.status === 201) {
        const amountList = Array.from(
          { length: studentData[0]?.number_of_semester },
          (v, i) => ({
            id: i + 1,
            netAmount: 0,
            addedAmount: 0,
            deductedAmount: 0,
            remarks: "",
            isEdit: false,
          })
        );
        const updatedAmountList = amountList.map((ele) => {
          const finalData = res.data.data.find(
            (el) => el.paidYearOrSem === ele.id
          );
          if (finalData) {
            return {
              ...ele,
              id: finalData?.acerpAmountId,
              netAmount: finalData?.amount,
              remarks: finalData?.remarks,
            };
          }
          return ele;
        });
        setState((prevState) => ({
          ...prevState,
          loading: false,
          acerpAmountList: res.data.data,
          studentDetail: studentData?.map((obj) => ({
            ...obj,
            amountList: updatedAmountList,
          })),
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.res ? error.res.data.message : "An error occured",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const totalAmount = acerpAmountList.reduce((sum, current) => {
    return sum + current.amount;
  }, 0);

  const handleEdit = (i) => {
    if (studentDetail.length > 0) {
      const onChangeReqVal = JSON.parse(
        JSON.stringify(studentDetail[0].amountList)
      );
      onChangeReqVal[i].isEdit = !onChangeReqVal[i].isEdit;
      setState((prev) => ({
        ...prev,
        studentDetail: studentDetail.map((el) => ({
          ...el,
          amountList: onChangeReqVal,
        })),
      }));
    }
  };

  const setTableRowloading = (val) => {
    setState((prevState) => ({
      ...prevState,
      tableRowloading: val,
    }));
  };

  const onSubmitTableRowData = async (data) => {
    setTableRowloading(true);
    try {
      if (data?.id) {
        let payload = {
          acerpAmountId: data.id,
          amount:
            Number(data.netAmount) +
            Number(data.addedAmount) -
            Number(data.deductedAmount),
          remarks: data.remarks,
        };
        const res = await axios.put(
          "/api/student/updateAcerpAmountByAcerpAmountId",
          payload
        );
        actionAfterResponse(res, "update");
      } else {
        let payload = {
          auid: studentDetail[0].auid,
          studentId: studentDetail[0]?.student_id,
          active: true,
          acerpAmount: [
            {
              paidYearOrSem: data.id,
              amount:
                Number(data.netAmount) +
                Number(data.addedAmount) -
                Number(data.deductedAmount),
              remarks: data.remarks,
            },
          ],
        };
        const res = await axios.post("/api/student/createAcerpPaid", payload);
        actionAfterResponse(res, "create");
      }
    } catch (err) {
      setTableRowloading(false);
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const actionAfterResponse = (res, methodType) => {
    if (res.status === 200 || res.status === 201) {
      setAlertMessage({
        severity: "success",
        message: `Acerp amount ${
          methodType == "update" ? "updated" : "created"
        } successfully`,
      });
      getStudentDetailByAuid();
      setTableRowloading(false);
    } else {
      setAlertMessage({ severity: "error", message: "Error Occured" });
      setTableRowloading(false);
    }
    setAlertOpen(true);
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={4}>
          <CustomTextField
            name="auid"
            label="Auid"
            value={auid}
            handleChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={getStudentDetailByAuid}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>Submit</strong>
            )}
          </Button>
        </Grid>
      </Grid>

      <Grid container rowSpacing={1} mt={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.bg}>
            Fee Template
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3}>
            <Grid
              container
              alignItems="center"
              rowSpacing={1}
              pl={2}
              pr={2}
              pb={1}
              pt={1}
            >
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">AUID</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {studentDetail[0]?.auid}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">USN</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]?.usn}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Student Name</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {studentDetail[0]?.student_name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Father Name</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]?.father_name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Institute</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]?.school_name_short}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Course</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]?.program_name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Branch</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]?.program_specialization_name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Year/Semester</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]
                    ? `${studentDetail[0]?.number_of_years} years/${studentDetail[0]?.number_of_semester} semesters`
                    : ""}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Fee Template</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]?.fee_template_name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Mobile</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">
                  {studentDetail[0]?.mobile}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* ACERP amount,added and deducted ui */}
      <Grid container>
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table
              size="small"
              aria-label="simple table"
              style={{ width: "100%" }}
            >
              <TableHead>
                <TableRow className={classes.bg}>
                  <TableCell sx={{ width: 100, color: "white" }}>
                    Sem/Year
                  </TableCell>

                  <TableCell sx={{ width: 100, color: "white" }}>
                    ACERP Amount
                  </TableCell>

                  <TableCell sx={{ width: 100, color: "white" }}>
                    Added
                  </TableCell>

                  <TableCell sx={{ width: 100, color: "white" }}>
                    Deducted
                  </TableCell>
                  <TableCell sx={{ width: 100, color: "white" }}>
                    Net Amount
                  </TableCell>
                  <TableCell sx={{ width: 100, color: "white" }}>
                    Remarks
                  </TableCell>
                  <TableCell sx={{ width: 100, color: "white" }}>
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {studentDetail.length > 0 &&
                  studentDetail[0].amountList?.map((obj, index) => (
                    <TableRow key={index}>
                      <TableCell>{`Sem ${index + 1}`}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {acerpAmountList.length > 0
                            ? acerpAmountList[index]?.amount
                            : 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {!obj.isEdit ? (
                          <Typography variant="subtitle2">
                            {obj.addedAmount === 0 ? "" : obj.addedAmount}
                          </Typography>
                        ) : (
                          <CustomTextField
                            name="addedAmount"
                            label=""
                            value={obj.addedAmount === 0 ? "" : obj.addedAmount}
                            handleChange={(e) =>
                              handleChangeFormField(e, index)
                            }
                            type="number"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {!obj.isEdit ? (
                          <Typography variant="subtitle2">
                            {obj.deductedAmount === 0 ? "" : obj.deductedAmount}
                          </Typography>
                        ) : (
                          <CustomTextField
                            name="deductedAmount"
                            label=""
                            value={
                              obj.deductedAmount === 0 ? "" : obj.deductedAmount
                            }
                            handleChange={(e) =>
                              handleChangeFormField(e, index)
                            }
                            type="number"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {!obj.isEdit ? (
                          <Typography variant="subtitle2">
                            {obj.netAmount}
                          </Typography>
                        ) : (
                          <CustomTextField
                            name="netAmount"
                            label=""
                            value={obj.netAmount}
                            handleChange={(e) =>
                              handleChangeFormField(e, index)
                            }
                            type="number"
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ minWidth: "300px" }}>
                        {!obj.isEdit ? (
                          <Typography variant="subtitle2">
                            {obj.remarks}
                          </Typography>
                        ) : (
                          <CustomTextField
                            name="remarks"
                            label=""
                            value={obj.remarks}
                            handleChange={(e) =>
                              handleChangeFormField(e, index)
                            }
                            multiline
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {!obj.isEdit ? (
                          <HtmlTooltip title="Edit">
                            <IconButton onClick={() => handleEdit(index)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </HtmlTooltip>
                        ) : (
                          <>
                            <Button
                              style={{ borderRadius: 7 }}
                              variant="contained"
                              color="primary"
                              disabled={tableRowloading}
                              onClick={() => onSubmitTableRowData(obj)}
                            >
                              {tableRowloading ? (
                                <CircularProgress
                                  size={25}
                                  color="blue"
                                  style={{ margin: "2px 13px" }}
                                />
                              ) : (
                                <strong>Save</strong>
                              )}
                            </Button>{" "}
                            &nbsp;
                            <HtmlTooltip title="Cancel edit">
                              <IconButton onClick={() => handleEdit(index)}>
                                <HighlightOff fontSize="small" />
                              </IconButton>
                            </HtmlTooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                {studentDetail.length > 0 && (
                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{totalAmount}</strong>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TechWeb;
