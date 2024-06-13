import { useEffect, useState } from "react";
import axios from "../../services/Api";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import EmpDirectResignationForm from "../forms/employeeMaster/EmpDirectResignationForm";
import { convertUTCtoTimeZone } from "../../utils/DateTimeUtils";
import moment from "moment";
import styled from "@emotion/styled";
import useAlert from "../../hooks/useAlert";
import CustomModal from "../../components/CustomModal";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import EmpRejoinForm from "../forms/employeeMaster/EmpRejoinForm";

const initialValues = {
  empId: null,
  reason: "",
  document: "",
  form: "",
  relievingDate: null,
  expectedDate: "",
  toDate: null,
  probation: "",
  timing: "",
};

const requiredFields = {
  resignation: ["reason", "document", "relievingDate"],
  offer: ["toDate", "probation", "timing"],
};

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    // border: "1px solid rgba(224, 224, 224, 1)",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

function EmployeeResignationIndex() {
  const [values, setValues] = useState(initialValues);
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 50,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [modalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resignationId, setResignationId] = useState();
  const [rejoinModal, setRejoinModal] = useState(false);
  const [rejoinModalContent, setRejoinModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [rejoinWrapperOpen, setRejoinWrapperOpen] = useState(false);
  const [offerData, setOfferData] = useState();
  const [requiredFieldType, setRequiredFieldType] = useState([]);
  const [rowData, setRowData] = useState({
    employee_name: "Employee Relieving",
  });
  const [empData, setEmpData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    empId: [values.empId !== null],
    reason: [values.reason !== "", values.reason.length < 100],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
    relievingDate: [values.relievingDate !== null],
    toDate: [values.toDate !== null],
    probation: [values.probation !== ""],
    timing: [values.timing !== ""],
  };

  const errorMessages = {
    empId: ["This field is required"],
    reason: ["This field is required", "Maximum characters 100"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    relievingDate: ["This field is required"],
    toDate: ["This field is required"],
    probation: ["This field is required"],
    timing: ["This field is required"],
  };

  const columns = [
    { field: "empcode", headerName: "Staff Code", flex: 1 },
    { field: "employee_name", headerName: "Staff Name", flex: 1 },
    { field: "dept_name", headerName: "Staff Of", flex: 1 },
    { field: "designation_name", headerName: "Designation", flex: 1 },
    {
      field: "date_of_joining",
      headerName: "Date of Joining",
      flex: 1,
      renderCell: (params) =>
        params.row.date_of_joining
          ? moment(
              new Date(
                convertUTCtoTimeZone(params?.row?.date_of_joining)?.slice(0, 10)
              )
            ).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "employee_reason",
      headerName: "Reason",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        params?.row?.employee_reason?.length > 25 ? (
          <HtmlTooltip title={params.row.employee_reason}>
            <span>{params.row.employee_reason.substr(0, 20) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.leave_comments
        ),
    },
    {
      field: "requested_relieving_date",
      headerName: "Expected Relieving",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        params.row.requested_relieving_date
          ? moment(
              new Date(
                convertUTCtoTimeZone(
                  params?.row?.requested_relieving_date
                )?.slice(0, 10)
              )
            ).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "relieving_date",
      headerName: "Exit Date",
      flex: 1,
      renderCell: (params) =>
        params.row.relieving_date ? (
          moment(
            new Date(
              convertUTCtoTimeZone(params?.row?.relieving_date)?.slice(0, 10)
            )
          ).format("DD-MM-YYYY")
        ) : (
          <IconButton onClick={() => handleUpdateRelieving(params.row)}>
            <ExitToAppIcon sx={{ color: "blue.main" }} />
          </IconButton>
        ),
    },
    {
      field: "reason",
      headerName: "HR Comments",
      flex: 1,
      renderCell: (params) =>
        params?.row?.reason?.length > 25 ? (
          <HtmlTooltip title={params.row.reason}>
            <span>{params.row.reason.substr(0, 20) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.leave_comments
        ),
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Rejoin",
      flex: 1,
      renderCell: (params) =>
        params.row.status === true && params.row.resignation_status !== true ? (
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => handleRejoin(params.row)}
          >
            <AddToPhotosIcon sx={{ color: "blue.main" }} />
          </IconButton>
        ) : params.row.status === true &&
          params.row.resignation_status === true ? (
          <Typography variant="subtitle2" color="success">
            Rejoined
          </Typography>
        ) : (
          <></>
        ),
    },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Employee Relieving" }]);
    getData();
  }, [paginationData.page, paginationData.pageSize, filterString]);

  const getData = async () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));

    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/employee/fetchAllResignationDetails?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date${searchString}`
    )
      .then((res) => {
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data.Paginated_data.content,
          total: res.data.data.Paginated_data.totalElements,
          loading: false,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleOnPageChange = (newPage) => {
    setPaginationData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginationData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  const handleRelieving = () => {
    getNodueOptions();
    setRowData({ employee_name: "Employee Relieving" });
    if (requiredFields["resignation"].includes("empId") === false) {
      requiredFields["resignation"].push("empId");
    }
    setValues((prev) => ({
      ...prev,
      ["form"]: "post",
      ["empId"]: null,
      ["reason"]: "",
      ["document"]: "",
      ["expectedDate"]: "",
    }));
    setRequiredFieldType("resignation");
    setModalWrapperOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields[requiredFieldType].length; i++) {
      const field = requiredFields[requiredFieldType][i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    setLoading(true);
    if (values.form === "post") {
      const temp = {};
      temp.active = true;
      temp.emp_id = values.empId;
      temp.reason = values.reason;
      temp.relieving_date = values.relievingDate;
      temp.requested_relieving_date = values.relievingDate;
      temp.additional_reason = "";
      temp.status = true;

      const empFilter = empData.filter((f) => f.emp_id === values.empId);
      const empUserId = empFilter[0].user_id;

      await axios
        .post("/api/employee/resignation", temp)
        .then((res) => {
          if (res.data.status === 201) {
            const dataArray = new FormData();
            dataArray.append("rad[" + 0 + "].file", values.document);
            dataArray.append("resignation_id", res.data.data.resignation_id);
            dataArray.append("active", true);
            dataArray.append("emp_id", values.empId);

            axios
              .post("/api/employee/uploadFileResignationAttachment", dataArray)
              .then((docuRes) => {})
              .catch((err) => console.error(err));

            //   deactivate employee
            axios
              .delete(`/api/employee/deactivateEmployeeDetails/${values.empId}`)
              .then((res) => {})
              .catch((err) => console.error(err));

            //   deactivate user
            axios
              .delete(`/api/UserAuthentication/${empUserId}`)
              .then((res) => {})
              .catch((err) => console.error(err));

            // Inserting data into no due assignment table
            const nodueTemp = [];
            values.nodue
              .filter((obj) => obj.submittedStatus === true)
              .forEach((item) => {
                nodueTemp.push({
                  active: true,
                  comments: values.reason,
                  department_id: item.id,
                  employee_Id: values.empId,
                  no_due_status: item.submittedStatus,
                  resignation_id: res.data.data.resignation_id,
                });
              });

            axios
              .post("/api/employee/noDuesAssignment", nodueTemp)
              .then((nodueRes) => {})
              .catch((err) => console.error(err));

            setAlertMessage({
              severity: "success",
              message: "Relieving request sent successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setModalWrapperOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Something went wrong !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setModalWrapperOpen(false);
          }
        })
        .catch((err) => {
          console.error(err);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
          setModalWrapperOpen(false);
        });
    } else if (values.form === "put") {
      const resignationData = await axios
        .get(`api/employee/resignation/${resignationId}`)
        .then((res) => res.data.data)
        .catch((err) => console.error(err));

      const temp = { ...resignationData };
      temp.reason = values.reason;
      temp.relieving_date = values.relievingDate;
      temp.status = true;

      const dataArray = new FormData();
      dataArray.append("rad[" + 0 + "].file", values.document);
      dataArray.append("resignation_id", resignationData.resignation_id);
      dataArray.append("active", true);
      dataArray.append("emp_id", resignationData.emp_id);

      await axios
        .post("/api/employee/uploadFileResignationAttachment", dataArray)
        .then((docuRes) => {})
        .catch((err) => console.error(err));

      //   deactivate user
      axios
        .delete(`/api/UserAuthentication/${rowData.user_id}`)
        .then((res) => {})
        .catch((err) => console.error(err));

      await axios
        .put(`/api/employee/resignation/${resignationId}`, temp)
        .then((res) => {
          if (res.data.status === 200) {
            axios
              .delete(
                `/api/employee/deactivateEmployeeDetails/${resignationData.emp_id}`
              )
              .then((resDocument) => {})
              .catch((err) => console.error(err));

            // Inserting data into no due assignment table
            const nodueTemp = [];
            values.nodue
              .filter((obj) => obj.submittedStatus === true)
              .forEach((item) => {
                nodueTemp.push({
                  active: true,
                  comments: values.reason,
                  department_id: item.id,
                  employee_Id: resignationData.emp_id,
                  no_due_status: item.submittedStatus,
                  resignation_id: resignationData.resignation_id,
                });
              });

            axios
              .post("/api/employee/noDuesAssignment", nodueTemp)
              .then((nodueRes) => {})
              .catch((err) => console.error(err));

            setAlertMessage({
              severity: "success",
              message: "Relieved successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setModalWrapperOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Something went wrong !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setModalWrapperOpen(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
          setModalWrapperOpen(false);
        });
    }
  };

  const handleUpdateRelieving = (data) => {
    getNodueOptions();
    setRowData({ employee_name: "Employee Relieving" });
    if (requiredFields["resignation"].includes("empId") === true) {
      requiredFields["resignation"].splice(
        requiredFields["resignation"].indexOf("empId"),
        1
      );
    }
    setResignationId(data.id);
    setValues((prev) => ({
      ...prev,
      ["form"]: "put",
      ["reason"]: "",
      ["document"]: "",
      ["expectedDate"]: data.requested_relieving_date,
    }));
    setRequiredFieldType("resignation");
    setRowData(data);
    setModalWrapperOpen(true);
  };

  const handleRejoin = async (data) => {
    await axios
      .get(`/api/employee/offerDetailsByJobId/${data.job_id}`)
      .then((res) => setOfferData(res?.data?.data[0]))
      .catch((err) => console.error(err));

    setValues((prev) => ({
      ...prev,
      ["toDate"]: null,
      ["probation"]: "",
      ["timing"]: "",
    }));
    setRequiredFieldType("offer");
    setRowData(data);
    setRejoinWrapperOpen(true);
  };

  const updateRejoin = async (resId) => {
    const resignationData = await axios
      .get(`api/employee/resignation/${resId}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const temp = { ...resignationData };
    temp.resignation_status = true;

    await axios
      .put(`/api/employee/resignation/${resId}`, temp)
      .then((res) => {
        if (res.data.status !== 200) {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };

  const handleChangeNodue = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      nodue: prev.nodue.map((obj, i) => {
        if (obj.id === Number(splitName[1])) {
          return { ...obj, submittedStatus: e.target.checked };
        }

        return obj;
      }),
    }));
  };

  const handleRejoinStaff = async () => {
    await axios
      .post(`/api/employee/rejoinEmployeeDetails/${rowData.emp_id}`)
      .then((res) => {
        if (res.data.status === 201) {
          // update rejoin status to resignation table
          updateRejoin(rowData.id)
            .then(() => updateEmployee(rowData.job_id, rowData.emp_id))
            .then((updateRes) => {
              if (updateRes) {
                setAlertMessage({
                  severity: "success",
                  message: "Rejoined successfully !!",
                });
                setAlertOpen(true);
                setRejoinWrapperOpen(false);
              }
            })
            .then(() => getData());
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!",
          });
          setAlertOpen(true);
          setRejoinWrapperOpen(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setRejoinWrapperOpen(false);
      });
  };

  const updateEmployee = async (jobId, employeeUserId) => {
    const employeeData = await axios
      .get(`/api/employee/getEmployeeDetailsByJobId/${jobId}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const temp = { ...employeeData };

    temp.annual_salary = offerData["basic"];
    temp.cca = offerData["cca"];
    temp.cea = offerData["cea"];
    temp.cha = offerData["cha"];
    temp.ctc = offerData["ctc"];
    temp.da = offerData["da"];
    temp.fr = offerData["fr"];
    temp.grosspay_ctc = offerData["gross"];
    temp.hra = offerData["hra"];
    temp.me = offerData["me"];
    temp.mr = offerData["mr"];
    temp.net_pay = offerData["net_pay"];
    temp.other_allow = offerData["other_allow"];
    temp.punched_card_status = "mandatory";
    temp.pt = offerData["pt"];
    temp.spl_1 = offerData["spl_1"];
    temp.ta = offerData["ta"];
    temp.probation = values.probation;
    temp.partOrFullTime = values.timing;
    temp.to_date = values.toDate;

    await axios
      .delete(`/api/activateUserByEmployeeId/${employeeUserId}`)
      .then((res) => {})
      .catch((err) => console.error(err));

    return await axios
      .put(
        `/api/employee/updateEmployeeDetailsAfterRejoin/${temp.emp_id}`,
        temp
      )
      .then((res) => res.data.success)
      .catch((err) => console.error(err));
  };

  const getNodueOptions = async () => {
    await axios
      .get("/api/allNoDuesDetails")
      .then((res) => {
        const nodueObj = res.data.data.map((obj, i) => ({
          id: obj.id,
          name: obj.dept_name,
          submittedStatus: false,
        }));

        setValues((prev) => ({
          ...prev,
          nodue: nodueObj,
        }));
      })
      .catch((err) => console.error(err));
  };

  const validateTranscript = () => {
    let status = true;
    values.nodue?.forEach((obj) => {
      if (obj.submittedStatus === false) status = false;
    });
    return status;
  };

  return (
    <>
      <CustomModal
        open={rejoinModal}
        setOpen={setRejoinModal}
        title={rejoinModalContent.title}
        message={rejoinModalContent.message}
        buttons={rejoinModalContent.buttons}
      />

      <ModalWrapper
        open={modalWrapperOpen}
        setOpen={setModalWrapperOpen}
        maxWidth={1000}
        title={rowData?.employee_name}
      >
        <EmpDirectResignationForm
          values={values}
          handleChange={handleChange}
          handleChangeAdvance={handleChangeAdvance}
          handleFileDrop={handleFileDrop}
          handleFileRemove={handleFileRemove}
          loading={loading}
          requiredFieldsValid={requiredFieldsValid}
          checks={checks}
          errorMessages={errorMessages}
          handleCreate={handleCreate}
          handleChangeNodue={handleChangeNodue}
          validateTranscript={validateTranscript}
          setEmpData={setEmpData}
        />
      </ModalWrapper>

      {/* Rejoin  */}
      <ModalWrapper
        open={rejoinWrapperOpen}
        setOpen={setRejoinWrapperOpen}
        maxWidth={1000}
        title={rowData?.employee_name}
      >
        <EmpRejoinForm
          offerData={offerData}
          values={values}
          handleChange={handleChange}
          handleChangeAdvance={handleChangeAdvance}
          loading={loading}
          requiredFieldsValid={requiredFieldsValid}
          handleRejoinStaff={handleRejoinStaff}
        />
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 6 }}>
        <Button
          onClick={handleRelieving}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<ExitToAppIcon />}
        >
          Relieve
        </Button>

        <GridIndex
          rows={paginationData.rows}
          columns={columns}
          rowCount={paginationData.total}
          page={paginationData.page}
          pageSize={paginationData.pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
          loading={paginationData.loading}
          handleOnFilterChange={handleOnFilterChange}
        />
      </Box>
    </>
  );
}

export default EmployeeResignationIndex;
