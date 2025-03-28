import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import { IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import ModalWrapper from "../../components/ModalWrapper";

const JournalVerify = lazy(() =>
  import("../forms/accountMaster/JournalVerify")
);

function JournalVerifierIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);

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

  const columns = [
    {
      field: "id",
      headerName: "Verify",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleVerify(params.row)}>
          <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    { field: "debit_total", headerName: "Amount", flex: 1 },
    { field: "pay_to", headerName: "Vendor", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
    },
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

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default JournalVerifierIndex;
