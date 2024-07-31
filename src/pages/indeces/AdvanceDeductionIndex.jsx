import { useState, useEffect } from "react";
import {
  Button,
  Box,
  IconButton,
  Paper,
  Grid,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  tableCellClasses,
  styled,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import moment from "moment";

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

function AdvanceDeductionIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [emiOpen, setEmiOpen] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Advance Deduction Index" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllAdvancePayScaleDeduction?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/finance/deactivateAdvancePayScaleDeduction/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/activateAdvancePayScaleDeduction/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleView = async (params) => {
    setEmiOpen(true);
    await axios
      .get(`/api/finance/fetchMonthlyEmiData/${params.row.id}`)
      .then((res) => {
        const temp = [];

        res.data.data.map((obj) => {
          temp.push({
            active: obj.active,
            advance_id: obj.advance_id,
            category_name: obj.category_name,
            completed_tenture: obj.completed_tenture,
            created_by: obj.created_by,
            created_date: obj.created_date,
            created_username: obj.created_username,
            current_tenture: obj.current_tenture,
            deactivate_month: obj.deactivate_month,
            deactivate_year: obj.deactivate_year,
            email: obj.email,
            emi_amount: obj.emi_amount,
            emp_id: obj.emp_id,
            emiAmount: obj.emi_amount,
            empcode: obj.empcode,
            employee_name: obj.employee_name,
            id: obj.id,
            loan_completed_date: obj.loan_completed_date,
            loan_created_date: obj.loan_created_date,
            loan_end_date: obj.loan_end_date,
            loan_started_date: obj.loan_started_date,
            modified_by: obj.modified_by,
            modified_date: obj.modified_date,
            modified_username: obj.modified_username,
            month: obj.month,
            month_year: obj.month_year,
            principal_amount: obj.principal_amount,
            remaining_balance: obj.remaining_balance,
            school_id: obj.school_id,
            school_name: obj.school_name,
            school_name_short: obj.school_name_short,
            tenure: obj.tenure,
            year: obj.year,
          });
        });

        setData(temp);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e, index) => {
    setData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleUpdate = async () => {
    const b = {};

    data.forEach((obj) => {
      if (obj.emiAmount == 0) {
        b.emi_id = obj.id;
        b.amount = obj.emi_amount;
        b.advance_id = obj.advance_id;
      }
    });

    await axios
      .put(`/api/finance/updateEmi/${b.emi_id}/${b.advance_id}/${b.amount}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Updated" });
          setAlertOpen(true);
          setEmiOpen(false);
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  const columns = [
    { field: "employee_name", headerName: "Name", flex: 1 },
    { field: "empcode", headerName: "Empcode", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "category_name", headerName: "Category", flex: 1 },
    { field: "principal_amount", headerName: "Principal", flex: 1 },
    { field: "emi_amount", headerName: "EMI", flex: 1 },
    {
      field: "loan_started_date",
      headerName: "Start Month",
      flex: 1,
      valueGetter: (params) =>
        params.row.loan_started_date
          ? moment(params.row.loan_started_date).format("MM-YYYY")
          : "",
    },
    {
      field: "loan_end_date",
      headerName: "End Month",
      flex: 1,
      valueGetter: (params) =>
        params.row.loan_end_date
          ? moment(params.row.loan_end_date).format("MM-YYYY")
          : "",
    },
    { field: "tenure", headerName: "Tenure", flex: 1, hide: true },
    {
      field: "view",
      headerName: "View",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          style={{ color: "primary" }}
          onClick={() => handleView(params)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 4 }}>
      <ModalWrapper
        title="EMI Details"
        open={emiOpen}
        setOpen={setEmiOpen}
        maxWidth={1000}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          marginTop={2}
        >
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Category
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Month and Year
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center", width: "15%" }}>
                      EMI
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Remaining Balance
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Created By
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Created Date
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.category_name}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.month_year}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          <CustomTextField
                            name={"emiAmount"}
                            value={obj.emiAmount}
                            handleChange={(e) => handleChange(e, i)}
                          />
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.remaining_balance}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.created_username}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {moment(obj.modified_date).format("DD-MM-YYYY")}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} mt={2} align="right">
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Button
        onClick={() => navigate("/DeductionMaster/AdvanceDeductionForm")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default AdvanceDeductionIndex;
