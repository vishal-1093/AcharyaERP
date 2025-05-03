import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import { IconButton, Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import ModalWrapper from "../../components/ModalWrapper";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Visibility } from "@mui/icons-material";

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const JournalVerify = lazy(() =>
  import("../forms/accountMaster/JournalVerify")
);

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  modalOpen: false,
  modalContent: modalContents,
  attachmentModal: false,
  fileUrl: null,
};

function JournalVerifierIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    dept_name: false,
    remarks: false,
  });
  const [{ fileUrl, attachmentModal }, setState] = useState(initialState);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "JV Verifier" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/finance/fetchAllDraftJournalVoucher",
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
      );
      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleVerify = (data) => {
    setRowData(data);
    setJvWrapperOpen(true);
  };

  const getUploadGrnData = async (ddAttachment) => {
    await axios(`/api/purchase/grnFileDownload?fileName=${ddAttachment}`, {
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        setState((prevState) => ({
          ...prevState,
          attachmentModal: !attachmentModal,
          fileUrl: url,
        }));
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: "An error occured",
        });
        setAlertOpen(true);
      });
  };

  const getUploadData = async (ddAttachment) => {
    await axios(
      `/api/finance/EnvBillDetailsFileviews?fileName=${ddAttachment}`,
      {
        method: "GET",
        responseType: "blob",
      }
    )
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        setState((prevState) => ({
          ...prevState,
          attachmentModal: !attachmentModal,
          fileUrl: url,
        }));
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: "An error occured",
        });
        setAlertOpen(true);
      });
  };

  const handleAttachment = async (data) => {
    try {
      const response = await axios.get(
        `/api/finance/draftPaymentVoucherFileviews?fileName=${data.attachment_path}`,
        {
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(file);
      setState((prevState) => ({
        ...prevState,
        attachmentModal: !attachmentModal,
        fileUrl: url,
      }));
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: "Error while fetching file",
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Verify",
      flex: 1,

      // renderCell: (params) => (
      //   <IconButton onClick={() => handleVerify(params.row)}>
      //     <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
      //   </IconButton>
      // ),
      renderCell: (params) =>
        params.row.created_by !== userID &&
        params.row.verified_status === null ? (
          <IconButton onClick={() => handleVerify(params.row)}>
            <AddBoxIcon color="primary" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : params.row.verified_status ? (
          <IconButton variant="subtitle2" color="green">
            <PendingActionsIcon color="primary" />
          </IconButton>
        ) : (
          <IconButton variant="subtitle2" color="green">
            <PendingActionsIcon color="primary" />
          </IconButton>
        ),
    },
    {
      field: "envAttachment_path",
      headerName: "Attachment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params?.row?.envAttachment_path ? (
          <IconButton
            onClick={() => getUploadData(params.row?.envAttachment_path)}
          >
            <VisibilityIcon color="primary" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : params?.row?.grnAttachment_path ? (
          <IconButton
            onClick={() => getUploadGrnData(params.row?.grnAttachment_path)}
          >
            <VisibilityIcon color="primary" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : params?.row?.attachment_path ? (
          <>
            <IconButton onClick={() => handleAttachment(params.row)}>
              <Visibility sx={{ fontSize: 17 }} color="primary" />
            </IconButton>
          </>
        ) : (
          <></>
        ),
      ],
    },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "pay_to", headerName: "Vendor", flex: 1 },
    { field: "debit_total", headerName: "Amount", flex: 1 },

    { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
  ];

  return (
    <>
      <ModalWrapper
        open={jvWrapperOpen}
        setOpen={setJvWrapperOpen}
        maxWidth={1000}
      >
        <JournalVerify
          rowData={rowData}
          getData={getData}
          setJvWrapperOpen={setJvWrapperOpen}
        />
      </ModalWrapper>

      <GridIndex
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        setColumnVisibilityModel={setColumnVisibilityModel}
      />
    </>
  );
}

export default JournalVerifierIndex;
