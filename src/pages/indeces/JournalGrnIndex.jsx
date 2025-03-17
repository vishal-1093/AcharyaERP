import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";

const JournalGrnForm = lazy(() =>
  import("../forms/accountMaster/JournalGrnForm")
);

function JournalGrnIndex() {
  const [rows, setRows] = useState([]);
  const [modalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("/api/purchase/indexPageForGrn", {
        params: { page: 0, page_size: 10000, sort: "created_date" },
      });
      setRows(
        response.data.data.Paginated_data.content.map((obj, i) => {
          return { ...obj, id: i + 1 };
        })
      );
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleJournalVoucher = (data) => {
    setRowData(data);
    setModalWrapperOpen(true);
  };

  console.log("rows", rows);
  const columns = [
    { field: "po_po_reference_no", headerName: "PO No.", flex: 1 },
    { field: "env_grn_no", headerName: "GRN No.", flex: 1 },
    { field: "env_invoice_number", headerName: "Invoice No.", flex: 1 },
    { field: "env_vendor_name", headerName: "Vendor", flex: 1 },
    { field: "school_name", headerName: "School", flex: 1 },
    {
      field: "id",
      headerName: "Journal",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleJournalVoucher(params.row)}>
          <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <ModalWrapper
        open={modalWrapperOpen}
        setOpen={setModalWrapperOpen}
        maxWidth={1000}
        title={rowData?.env_grn_no}
      >
        <JournalGrnForm rowData={rowData} />
      </ModalWrapper>

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default JournalGrnIndex;
