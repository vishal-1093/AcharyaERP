import { useState, useEffect, lazy } from "react";
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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
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

const formFields = {
  techWebAmount: "",
  addedAmount: "",
  deductedAmount: "",
  netAmount: "",
  remarks: "",
};

const initialState = {
  auid: "",
  loading: false,
  tableRowloading: false,
  formField: formFields,
  studentDetail:[]
};

const TechWeb = () => {
  const [{ auid, loading, tableRowloading, formField ,studentDetail}, setState] =
    useState(initialState);
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeFormField = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      formField: {
        [name]: value,
      },
    }));
  };

  const getDataByAuid = async() => {
    try {
      const res = await axios.get(`/api/student/studentDetailsByAuid/${auid}`);
      setState((prevState)=>({
        ...prevState,
        studentDetail:res.data.data
      }))
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.res ? error.res.data.message : "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const onSubmitTableRowData = () => {
    console.log("onSubmitTableRowData");
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
            onClick={getDataByAuid}
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
                {studentDetail[0] ? `${studentDetail[0]?.number_of_years} years/${studentDetail[0]?.number_of_semester} semesters` : ""}
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

      {/* amount, due ui */}
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
                  <TableCell
                    sx={{ width: 100, color: "white" }}
                  >
                    Sem/Year
                  </TableCell>

                  <TableCell
                    sx={{ width: 100, color: "white" }}
                  >
                    ACERP Amount
                  </TableCell>

                  <TableCell
                    sx={{ width: 100, color: "white" }}
                  >
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
               {studentDetail.length > 0 && Array.from({length : studentDetail[0]?.number_of_semester},(_,index)=>(
                <TableRow key={index}>
                  <TableCell>{`Sem ${index + 1}`}</TableCell>
                  <TableCell>
                    <CustomTextField
                      name="techWebAmount"
                      label=""
                      value={formField.techWebAmount}
                      handleChange={handleChangeFormField}
                      type="number"
                    />
                  </TableCell>
                  <TableCell>
                    <CustomTextField
                      name="addedAmount"
                      label=""
                      value={formField.addedAmount}
                      handleChange={handleChangeFormField}
                      type="number"
                    />
                  </TableCell>
                  <TableCell>
                    <CustomTextField
                      name="deductedAmount"
                      label=""
                      value={formField.deductedAmount}
                      handleChange={handleChangeFormField}
                      type="number"
                    />
                  </TableCell>
                  <TableCell>
                    <CustomTextField
                      name="netAmount"
                      label=""
                      value={formField.netAmount}
                      handleChange={handleChangeFormField}
                      type="number"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "300px" }}>
                    <CustomTextField
                      name="remarks"
                      label=""
                      handleChange={handleChangeFormField}
                      value={formField.remarks}
                      multiline
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={tableRowloading}
                      onClick={onSubmitTableRowData}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>Save</strong>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TechWeb;
