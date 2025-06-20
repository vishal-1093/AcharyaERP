import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box
} from "@mui/material";
import axios from "../../../services/Api.js";
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";

function LedgerDebitFundTransferDetail() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
   created_date: false
  });
  const location = useLocation()
  const queryValues = location.state;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const { voucherHeadId, fcYearId, schoolId, month, date } = queryValues
    const params = {
      ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
      ...(fcYearId && { fcYearId }),
      ...(schoolId && { schoolId }),
      ...(date && { date }),
      ...(month && { month })
    }
    const baseUrl = '/api/finance/getAllFundTransferByDate'
    await axios
      .get(baseUrl, { params })
      .then((res) => {
        setLoading(false);
        setRows(res?.data?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const columns = [
    {
      field: "voucher_no",
      headerName: "Voucher No",
      flex: 1,
      align: "center",
    },
    {
      field: "credit",
      headerName: "Amount",
      flex: 1,
      type: "number"
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      align: "center",
      renderCell:(params)=>{
        return params?.row?.created_date ? moment(params?.row?.created_date).format("DD-MM-YYYY") : ""
      }
    },
     {
      field: "type",
      headerName: "Type",
      flex: 1,
      align: "center"
    },
     {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
      align: "left"
    },
  ];

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
        <GridIndex
          rows={rows}
          columns={columns}
          loading={loading}
          // columnVisibilityModel={columnVisibilityModel}
          // setColumnVisibilityModel={setColumnVisibilityModel}
          getRowId={(row, index) => row?.payment_voucher_id}
        />
      </Box>
    </Box>
  );
}

export default LedgerDebitFundTransferDetail;

