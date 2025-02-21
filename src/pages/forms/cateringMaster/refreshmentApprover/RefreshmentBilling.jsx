import { useState, useEffect, lazy, useRef } from "react";
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
  tooltipClasses,
  styled,
  Typography,
  Menu, MenuItem,
  CircularProgress
} from "@mui/material";
import { convertUTCtoTimeZone } from "../../../../utils/DateTimeUtils";
import useAlert from "../../../../hooks/useAlert.js";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import axios from "../../../../services/Api";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../../../components/CustomModal";
import { useDownloadExcel } from "react-export-table-to-excel";
import PrintIcon from '@mui/icons-material/Print';
const CustomDatePicker = lazy(() =>
  import("../../../../components/Inputs/CustomDatePicker")
);

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

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialValues = {
  date: null,
  vendorId: null,
  schoolId: null,
  modalContent: modalContents,
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  const setCrumbs = useBreadcrumbs();
  const empId = sessionStorage.getItem("empId");
  const { setAlertMessage, setAlertOpen } = useAlert();


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
          `/api/getMealRefreshmentRequests?voucher_head_new_id=${values.vendorId
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
          `/api/getMealRefreshmentRequests?voucher_head_new_id=${values.vendorId
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

  const handleExport = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    setModalOpen(!modalOpen);
    handleClose()
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Billing Report",
    sheet: "Billing",
  });

  const setModalContent = (title, message, buttons) => {
    setValues((prevState) => ({
      ...prevState,
      modalContent: {
        ...prevState.modalContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const OnSaveLock = async() => {
    let payload = rows.map((ele)=>({
      lock_status: "Locked",
      lock_date: convertUTCtoTimeZone(new Date()),
      refreshment_id: ele.refreshmentId,
      lock_by: +empId,
      approved_by: null,
      approved_date: null,
      active: true,
      dept_id: ele.dept_id,
      school_id: ele.school_id,
      voucher_head_new_id: values.vendorId,
      month_year: moment(values.date).format("MM-YYYY"),
      total_amount: ele.total
    }));

    setLockModalOpen(true);
    const handleToggle = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`/api/createMealBill`, payload);
        if (res.status == 200 || res.status == 201) {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: `Bill is locked successfully.`,
          });
          setAlertOpen(true);
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
    setModalContent("", `Do you want to lock bill for the month of ${moment(values.date).format("MMM")} ${moment(values.date).format("YYYY")}?`, [
      { name: "Yes", color: "primary", func: handleToggle },
      { name: "No", color: "primary", func: () => { } },
    ])
  };

  return (
    <Box sx={{ position: "relative", mt: 1 }}>
      {!!lockModalOpen && (
          <CustomModal
            open={lockModalOpen}
            setOpen={setLockModalOpen}
            title={values.modalContent.title}
            message={values.modalContent.message}
            buttons={values.modalContent.buttons}
          />
        )}

      <Grid
        container
        alignItems="center"
        columnSpacing={4}
        mt={2}
      >
        <Grid item xs={10} md={2} align="right" sx={{ marginTop: { xs: 2, md: 2 } }}>
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

        <Grid item xs={10} md={2} align="right" sx={{ marginTop: { xs: 2, md: 0 } }}>
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

        <Grid item xs={10} md={2} align="right" sx={{ marginTop: { xs: 2, md: 0 } }}>
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

        <Grid item xs={12} md={1} sx={{ marginTop: { xs: 2, md: 0 } }}>
          <Button
            variant="contained"
            onClick={getData}
            sx={{ borderRadius: 2 }}
            disabled={!values.date || !values.vendorId || !values.schoolId}
          >
            Submit
          </Button>
        </Grid>

        <Grid item xs={12} md={1} sx={{ marginTop: { xs: 2, md: 0 } }}>
          <Button
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={OnSaveLock}
            disabled={!rows.length}
          >
            {loading ? (
              <CircularProgress
                size={15}
                color="inherit"
                style={{ margin: "5px" }}
              />
            ) : (
              "Save/Lock"
            )}
          </Button>
        </Grid>

        {rows?.length > 0 && <Grid item xs={12} md={4} align="right">
          <Button
            variant="contained"
            aria-controls="export-menu"
            aria-haspopup="true"
            onClick={handleExport}
            startIcon={<PrintIcon />}
          >
            Export
          </Button>
          <Menu
            id="export-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClick} disabled>
              PDF
            </MenuItem>
            <MenuItem onClick={onDownload}
            >
              Excel
            </MenuItem>
          </Menu>
        </Grid>}

        {rows?.length > 0 && <Grid item xs={12} md={12} mt={1}>
          <StudentTable rows={rows} tableRef={tableRef} />
        </Grid>}
      </Grid>
    </Box>
  );
}

export default RefreshmentRequestReport;

const StudentTable = ({ rows, tableRef }) => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} mb={4}>
        <TableContainer>
          <Table size="small" ref={tableRef}>
            <TableHead className={classes.bg}>
              <StyledTableRow>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Sl No.
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  School
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Dept
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  End User
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Purpose
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Approver
                </StyledTableCell>
                {/* <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  End User Status
                </StyledTableCell> */}
                <StyledTableCell sx={{ color: "white", textAlign: "center", width: "115px" }}>
                  Meal Date
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Menu Type
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Qty
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Rate
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
                  Total
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white", textAlign: "center" }}>
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
                      {obj.school_name_short}
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
                    {/* <StyledTableCell sx={{ textAlign: "center" }}>
                      {obj.approvedStatus === 1 ? "Approved" : ""}
                    </StyledTableCell> */}
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {obj.mealDate}
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {obj.menuType}
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {obj.approved_count}
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
                            ? obj.end_user_feedback_remarks.slice(0, 9) + "..."
                            : obj.end_user_feedback_remarks
                              ? obj.end_user_feedback_remarks
                              : "--"}
                        </Typography>
                      </HtmlTooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
              {rows.length && <StyledTableRow>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                  <b>Total</b>
                  </StyledTableCell>
                  <StyledTableCell>
                    {rows.reduce((sum, item) => sum + Number(item.total), 0)}
                  </StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
              </StyledTableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
