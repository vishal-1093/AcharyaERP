import { useState, useEffect, lazy } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  Tooltip,
  IconButton,
  tooltipClasses,
  styled,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import axios from "../../../../services/Api";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import CustomAutocomplete from "../../../../components/Inputs/CustomAutocomplete";
const CustomDatePicker = lazy(() =>
  import("../../../../components/Inputs/CustomDatePicker")
);

const initialValues = {
  date: null,
  vendorId: null,
  schoolId: null,
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

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 270,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

function RefreshmentRequestReport() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const classes = useStyles();

  useEffect(() => {
    setCrumbs([{ name: "Consolidated Report" }]);
    getMealVendor();
  }, []);

  useEffect(() => {
    getSchoolData();
  }, []);

  const getMealVendor = async (meal_id) => {
    await axios
      .get(`/api/inventory/getVoucherHeadNewDataFromVendor`)
      .then((Response) => {
        const data = [];
        Response.data.data.forEach((obj) => {
          data.push({
            value: obj.voucherHeadNewId,
            label: obj.vendor_name,
          });
        });
        setVendorOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async (meal_id) => {
    await axios
      .get(`/api/institute/school`)
      .then((Response) => {
        const data = [];
        Response.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    const schoolData = schoolOptions.find(
      (obj) => obj.value === values.schoolId
    );

    if (values.schoolId === null) {
      await axios
        .get(
          `/api/getMealRefreshmentRequests?voucher_head_new_id=${
            values.vendorId
          }&month=${moment(values.date).format("M")}&year=${moment(
            values.date
          ).format("YYYY")}`
        )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/getMealRefreshmentRequests?voucher_head_new_id=${
            values.vendorId
          }&month=${moment(values.date).format("M")}&year=${moment(
            values.date
          ).format("YYYY")}`
        )
        .then((res) => {
          const schoolRows = res.data.data.filter(
            (obj) => obj.institute === schoolData.label
          );
          setRows(schoolRows);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
        columnSpacing={4}
        mt={1}
      >
        <Grid item xs={12} md={2} mt={2} align="right">
          <CustomDatePicker
            views={["month", "year"]}
            openTo="month"
            name="date"
            label="Select Month"
            inputFormat="MM/YYYY"
            helperText="mm/yyyy"
            value={values.date}
            handleChangeAdvance={handleChangeAdvance}
            required
            disabled={rows.length > 0}
          />
        </Grid>

        <Grid item xs={12} md={2} align="right">
          <CustomAutocomplete
            name="vendorId"
            label="Vendor"
            options={vendorOptions}
            value={values.vendorId}
            handleChangeAdvance={handleChangeAdvance}
            required
            disabled={rows.length > 0}
          />
        </Grid>

        <Grid item xs={12} md={2} align="right">
          <CustomAutocomplete
            name="schoolId"
            label="School"
            options={schoolOptions}
            value={values.schoolId}
            handleChangeAdvance={handleChangeAdvance}
            required
            disabled={rows.length > 0}
          />
        </Grid>

        <Grid item xs={12} md={1} align="right">
          <Button
            variant="contained"
            onClick={getData}
            sx={{ borderRadius: 2 }}
          >
            GO
          </Button>
        </Grid>

        <Grid item xs={12} md={1} align="right">
          <IconButton
            onClick={() => window.location.reload()}
            sx={{ position: "absolute", right: 10, top: 10, borderRadius: 2 }}
          >
            <RefreshIcon sx={{ color: "primary.main" }} fontSize="large" />
          </IconButton>
        </Grid>

        <Grid item xs={12} md={12} mt={2}>
          {rows?.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead className={classes.bg}>
                  <StyledTableRow>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Sl No.
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      School
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Dept
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      End User
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Purpose
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Approver
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      End User Status
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Meal Date
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Menu Type
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Qty
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Rate
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Total
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Feedback
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {i + 1}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.institute}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.department}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.endUser}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.remarks}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.approver}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.approvedStatus === 1 ? "Approved" : ""}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.mealDate}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.menuType}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.qty}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.rate}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.total}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          <HtmlTooltip title={obj.end_user_feedback_remarks}>
                            <Typography>
                              {obj.end_user_feedback_remarks &&
                              obj.end_user_feedback_remarks.length > 10
                                ? obj.end_user_feedback_remarks.slice(0, 9) +
                                  "..."
                                : obj.end_user_feedback_remarks
                                ? obj.end_user_feedback_remarks
                                : "--"}
                            </Typography>
                          </HtmlTooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default RefreshmentRequestReport;
