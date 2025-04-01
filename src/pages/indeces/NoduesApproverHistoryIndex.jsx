import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import moment from "moment";
import ModalWrapper from "../../components/ModalWrapper";
import useAlert from "../../hooks/useAlert";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import { IconButton } from "@mui/material";

const ResignationDocumentView = lazy(() =>
  import("../forms/employeeMaster/ResignationDocumentView")
);

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function NoduesApproverHistoryIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "No Due Approval", link: "/nodue-approver" },
      { name: "History" },
    ]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllNoDuesDetailsBasedOnUserId?page=0&page_size=10000&sort=created_date&UserId=${userId}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleUploadDocument = (data) => {
    setRowData(data);
    setDocumentModalOpen(true);
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Emp Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "designation_name",
      headerName: "Designation",
      flex: 1,
      hideable: false,
    },
    { field: "dept_name", headerName: "Department", flex: 1, hideable: false },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
      hideable: false,
    },
    {
      field: "employee_reason",
      headerName: "Reason",
      flex: 1,
      hideable: false,
    },
    {
      field: "additional_reason",
      headerName: "Additional Reason",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      hideable: false,
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "requested_relieving_date",
      headerName: "Requested Date",
      flex: 1,
      hideable: false,
       valueGetter: (value, row) =>
        moment(row.requested_relieving_date).format("DD-MM-YYYY"),
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
      field: "noDueComments",
      headerName: "Approver Comments",
      flex: 1,
      hideable: false,
    },
    {
      field: "approver_date",
      headerName: "Approve Date",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        moment(params.row.approver_date).format("DD-MM-YYYY LT"),
    },
  ];

  return (
    <>
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

export default NoduesApproverHistoryIndex;
