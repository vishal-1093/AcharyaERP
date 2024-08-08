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

const HostelWaiverForm = () => {
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
      { name: "Hostel Waiver"},
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


  const onSubmit = async () => {
    try {
      let payload = {
        auid: studentDetail[0]?.auid,
        studentId: studentDetail[0]?.student_id,
        remarks: remarks,
        active: true,
      };
      const finalPayload = { ...payload,  };

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
    </Box>
  );
};

export default HostelWaiverForm;
