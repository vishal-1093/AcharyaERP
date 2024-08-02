import { useState, lazy, useEffect } from "react";
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
  Button,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

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
  studentDetail: [],
  acerpAmountList: null,
  keysToSum: [],
  remarks: "",
  amountLoading: false,
};

const PaidAcerpAmountForm = () => {
  const [
    {
      auid,
      loading,
      studentDetail,
      acerpAmountList,
      keysToSum,
      remarks,
      amountLoading,
    },
    setState,
  ] = useState(initialState);
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Paid ACERP Amount", link: "/PaidACERPAmountIndex" },
      { name: "Create" },
    ]);
  }, []);

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
        const amountList = Array.from(
          { length: res.data.data[0]?.number_of_semester },
          (_, i) => ({
            id: i + 1,
            acerpAmount: 0,
            amount: 0,
          })
        );

        const allKeysToSum = Array.from(
          { length: res.data.data[0]?.number_of_semester },
          (_, i) => `paidYear${i + 1}`
        );
        setState((prevState) => ({
          ...prevState,
          loading: false,
          keysToSum: allKeysToSum,
          studentDetail: res.data.data?.map((obj) => ({
            ...obj,
            amountList: amountList,
          })),
        }));
        getAcerpAmountByAuid(res.data.data, amountList);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const getAcerpAmountByAuid = async (studentData, amountList) => {
    try {
      const res = await axios.get(`/api/student/getAcerpAmountByAuid/${auid}`);
      if (res?.status === 200 || res?.status === 201) {
        if (!!res.data.data) {
          const updatedAmountList = amountList.map((ele, index) => {
            if (!!res.data.data && res.data.data[`paidYear${index + 1}`]) {
              return {
                ...ele,
                acerpAmount: Number(`${res.data.data[`paidYear${index + 1}`]}`),
                amount: Number(`${res.data.data[`paidYear${index + 1}`]}`),
              };
            }
            return ele;
          });

          setState((prevState) => ({
            ...prevState,
            loading: false,
            acerpAmountList: res?.data?.data,
            remarks: res?.data?.data?.remarks,
            studentDetail: studentData?.map((obj) => ({
              ...obj,
              amountList: updatedAmountList,
            })),
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const totalAmount =
    !!keysToSum.length &&
    keysToSum.reduce((sum, current) => {
      if (!!acerpAmountList) return sum + acerpAmountList[current];
    }, 0);

  const setAmountLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      amountLoading: val,
    }));
  };

  const onSubmit = async () => {
    try {
      setAmountLoading(true);
      const paidYear = studentDetail[0]?.amountList.reduce(
        (acc, item, index) => {
          acc[`paidYear${index + 1}`] = +Number(item.amount).toFixed(1);
          return acc;
        },
        {}
      );

      let payload = {
        auid: studentDetail[0]?.auid,
        studentId: studentDetail[0]?.student_id,
        remarks: remarks,
        active: true,
      };
      const finalPayload = { ...payload, ...paidYear };

      if (!!acerpAmountList?.acerpAmountId) {
        const res = await axios.put(
          "/api/student/updateAcerpAmountPartially",
          finalPayload
        );
        actionAfterResponse(res, "update");
      } else {
        const res = await axios.post(
          "/api/student/createAcerpAmount",
          finalPayload
        );
        actionAfterResponse(res, "create");
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response
          ? err.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setAmountLoading(false);
    }
  };

  const actionAfterResponse = (res, methodType) => {
    if (res.status === 200 || res.status === 201) {
      navigate("/PaidAcerpAmountIndex");
      setAlertMessage({
        severity: "success",
        message: `Acerp amount ${
          methodType == "update" ? "updated" : "created"
        } successfully !!`,
      });
      getStudentDetailByAuid();
    } else {
      setAlertMessage({ severity: "error", message: "Error Occured !!" });
    }
    setAlertOpen(true);
    setAmountLoading(false);
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
            disabled={loading || !auid}
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

      {!!studentDetail.length && (
        <Grid container rowSpacing={1} mt={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Student Data
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
      )}

      {/* ACERP amount,added and deducted ui */}
      {!!studentDetail.length && !!studentDetail[0].amountList.length && (
        <Grid container>
          <Grid item xs={12} md={12}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table
                size="small"
                aria-label="simple table"
                style={{ width: "100%" }}
              >
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white" }}>#</TableCell>
                    {studentDetail.length > 0 &&
                      studentDetail[0].amountList?.map((_, index) => (
                        <TableCell sx={{ color: "white" }} key={index}>
                          {`Sem ${index + 1}`}
                        </TableCell>
                      ))}
                    <TableCell sx={{ color: "white" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">ACERP Amount</Typography>
                    </TableCell>
                    {studentDetail.length > 0 &&
                      studentDetail[0].amountList?.map((obj, index) => (
                        <TableCell key={index}>
                          <Typography variant="subtitle2">
                            {obj.acerpAmount}
                          </Typography>
                        </TableCell>
                      ))}
                    <TableCell>
                      <Typography variant="subtitle2">
                        {!!totalAmount ? totalAmount : 0}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">Amount</Typography>
                    </TableCell>
                    {studentDetail.length > 0 &&
                      studentDetail[0].amountList?.map((obj, index) => (
                        <TableCell key={index}>
                          <Typography variant="subtitle2">
                            <CustomTextField
                              name="amount"
                              label=""
                              value={obj.amount}
                              handleChange={(e) =>
                                handleChangeFormField(e, index)
                              }
                              type="number"
                            />
                          </Typography>
                        </TableCell>
                      ))}
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Grid item xs={12} md={4} sx={{ margin: "20px 15px" }}>
                  <CustomTextField
                    name="remarks"
                    label="Remarks"
                    value={remarks}
                    handleChange={handleChange}
                    required
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginX: "20px",
                  }}
                >
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    disabled={amountLoading || !remarks}
                    onClick={onSubmit}
                  >
                    {amountLoading ? (
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
              </div>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PaidAcerpAmountForm;
