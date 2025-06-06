import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: "auto",
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

const initialValues = {
  acYearId: null,
  balance: "",
  receivedAmount: "",
  payingNow: "",
  remarks: "",
  amountPerHead: 0,
};

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

function PaidAtBoardStdList() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checkedLength, setCheckedLength] = useState(0);
  const [disable, setDisable] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const location = useLocation();
  const { rowData } = location?.state;

  useEffect(() => {
    setSelectAll(rows.every((obj) => obj.checked));
    const checkedData = rows.filter((ele) => ele.checked)?.length;
    setCheckedLength(checkedData);
  }, [rows]);

  useEffect(() => {
    getStudentsList();
  }, []);

  const checkSig = useMemo(
    () => rows.map((row) => row.checked).join("-"),
    [rows]
  );

  useEffect(() => {
    updatePaid();
  }, [values.amountPerHead, checkSig]);

  const updatePaid = () => {
    if (Number(values.amountPerHead) > 0) {
      setRows((prev) =>
        prev.map((obj) => {
          if (obj.checked) return { ...obj, ["eachPay"]: values.amountPerHead };
          return { ...obj, ["eachPay"]: 0 };
        })
      );
    }
  };

  const getStudentsList = async () => {
    let url;

    url = `/api/student/studentDetailsByFeeTemplate/${rowData?.feeTemplateId}/${rowData?.receivedYear}`;

    try {
      const response = await axios.get(url);

      const rowId = response.data.data.map((ele) => ({
        ...ele,
        id: ele.student_id,
        checked: false,
        eachPay: 0,
      }));

      setRows(rowId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (id) => (event) => {
    const studentUpdatedList = rows.map((obj) =>
      obj.id === id ? { ...obj, checked: event.target.checked } : obj
    );
    setRows(studentUpdatedList);
  };

  const handleHeaderCheckboxChange = (e) => {
    const allStudentsSelected = rows.map((obj) => ({
      ...obj,
      checked: e.target.checked,
    }));

    setRows(allStudentsSelected);
  };

  const handleCreate = async () => {
    const payload = {};
    const boardTagAmountDtoList = [];
    rows.forEach((obj) => {
      if (obj.eachPay > 0)
        boardTagAmountDtoList.push({
          student_id: obj.student_id,
          institute_id: rowData?.schoolId,
          ac_year_id: rowData?.acYearId,
          fc_year_id: 4,
          // course_branch_assignment_id: 1,
          fee_template_id: rowData?.feeTemplateId,
          board_id: rowData?.boardId,
          board_receivable_id: rowData?.id,
          to_pay_from_board: obj.eachPay,
          received_from_board: rowData?.amount,
          paid: obj.eachPay,
          remaining_balance: obj.fixBoardAmount - obj.eachPay,
          remarks: values.remarks,
          active: true,
          year_sem: rowData?.receivedYear,
          paid_receipt_no: rowData?.bulkReceiptNo,
        });
    });

    payload.boardTagAmountDtoList = boardTagAmountDtoList;

    try {
      if (values.amountPerHead * checkedLength > rowData.remainingBalance) {
        setAlertMessage({
          severity: "error",
          message: "Paying now cannot be greater than balance",
        });
        setAlertOpen(true);
        return;
      }

      const postResponse = await axios.post(
        `/api/finance/studentTagBoardAmount`,
        payload
      );
      if (postResponse.status === 200 || postResponse.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Tagged Successfully",
        });
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderHeader: () => (
        <Box marginRight={21}>
          <FormGroup>
            {" "}
            <FormControlLabel control={headerCheckbox} />
          </FormGroup>
        </Box>
      ),
      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={params.row.checked}
          onChange={handleCheckboxChange(params.row.id)}
        />
      ),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      align: "center",
    },
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      align: "center",
    },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
      align: "center",
    },

    {
      field: "fixBoardAmount",
      headerName: "Fixed",
      flex: 1,
      align: "right",
    },
    {
      field: "paid",
      headerName: "Paid",
      flex: 1,
      align: "right",
    },
    {
      field: "BalanceAmount",
      headerName: "Balance",
      flex: 1,
      align: "right",
    },

    {
      field: "eachPay",
      headerName: "Paying now",
      flex: 1,
      align: "right",
    },
  ];

  const headerCheckbox = (
    <Checkbox
      checked={selectAll}
      onClick={(e) => handleHeaderCheckboxChange(e)}
    />
  );

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/LessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getStudentsList();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateLessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getStudentsList();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Grid
          container
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={2}
          alignItems="center"
        >
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="receivedAmount"
              label="Received Amount"
              value={rowData.amount}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="balance"
              label="Balance"
              value={rowData.remainingBalance}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="amountPerHead"
              label="Amount per head"
              value={values.amountPerHead}
              handleChange={handleChange}
              disabled={checkedLength == 0}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="payingNow"
              label="Paying Now Total"
              value={values.amountPerHead * checkedLength}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              disabled={disable}
              onClick={handleCreate}
            >
              INSERT
            </Button>
          </Grid>
          <Grid item xs={12}>
            <GridIndex rows={rows} columns={columns} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PaidAtBoardStdList;
