import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { IconButton } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ModalWrapper from "../../components/ModalWrapper";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
import NodueApproveForm from "../forms/employeeMaster/NodueApproveForm";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";

const ResignationDocumentView = lazy(() =>
  import("../forms/employeeMaster/ResignationDocumentView")
);

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function NoduesApproverIndex() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "No Due Approval" },
      { name: "History", link: "/nodue-history" },
    ]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllResignationDetailsBasedOnUserId?page=0&page_size=10000&sort=created_date&UserId=${userId}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleApprove = (data) => {
    setRowData(data);
    setModalOpen(true);
  };

  const handleUploadDocument = (data) => {
    setRowData(data);
    setDocumentModalOpen(true);
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "employee_name", headerName: "Emp Name", flex: 1 },
    { field: "designation_name", headerName: "Designation", flex: 1 },
    { field: "dept_name", headerName: "Department", flex: 1 },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
    },
    { field: "employee_reason", headerName: "Reason", flex: 1 },
    { field: "additional_reason", headerName: "Additional Reason", flex: 1 },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "requested_relieving_date",
      headerName: "Requested Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row?.requested_relieving_date).format("DD-MM-YYYY"),
    },
    {
      field: "attachment_path",
      headerName: "Upload Document",
      flex: 1,
      renderCell: (params) =>
        params.row.attachment_path ? (
          <IconButton
            onClick={() => handleUploadDocument(params.row)}
            title="Preview Document"
            sx={{ padding: 0 }}
          >
            <DescriptionSharpIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ) : (
          <></>
        ),
    },
    {
      field: "nodues_approve_status",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleApprove(params.row)}
          title="Approve"
          sx={{ padding: 0 }}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={700}
        title={rowData.employee_name + " ( " + rowData.empcode + " )"}
      >
        <NodueApproveForm
          rowData={rowData}
          getData={getData}
          setModalOpen={setModalOpen}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          userId={userId}
        />
      </ModalWrapper>

      <ModalWrapper
        open={documentModalOpen}
        setOpen={setDocumentModalOpen}
        maxWidth={700}
        title={rowData.employee_name + " ( " + rowData.empcode + " )"}
      >
        <ResignationDocumentView
          attachmentPath={rowData.attachment_path}
          setDocumentModalOpen={setDocumentModalOpen}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
        />
      </ModalWrapper>

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default NoduesApproverIndex;
