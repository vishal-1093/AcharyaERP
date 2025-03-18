import { Box, IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment";
import GridIndex from "../../../components/GridIndex";
import axios from "../../../services/Api";

function ContraIndex() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "Voucher No", flex: 1, hideable: false },
    {
      field: "createdDate",
      headerName: "Voucher Date",
      flex: 1,
      hideable: false,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    { field: "bankName", headerName: "Bank Name", flex: 1, hideable: false },
    { field: "debit", headerName: "Debit Total", flex: 1, hideable: false },
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
      hideable: false,
    },
    {
      field: "createdDate2",
      headerName: "Created Date",
      flex: 1,
      hideable: false,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    {
      field: "financialYear",
      headerName: "Financial Year",
      flex: 1,
      hideable: false,
    },
    {
      field: "",
      type: "actions",
      flex: 1,
      headerName: "Print",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/PaymentContraVoucherPdf/${params?.row?.id}/${params?.row?.financialYearId}`
            )
          }
          color="primary"
        >
          <PrintIcon fontSize="small" />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllContraDetails?page=${0}&page_size=${10}&sort=createdDate`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 4 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default ContraIndex;
