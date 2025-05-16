import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
} from "@mui/material";
import axios from "../../../services/Api.js";
import moment from "moment";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));

const initialValues = {
  loading:false,
};;

function LaptopIssueHistoryIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [reportPath, setReportPath] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    (values.startDate && values.endDate) && getData(values);
  }, [values.startDate,values.endDate]);


  const setLoading = (val) => {
    setValues((prevState)=>({
      ...prevState,
      loading:val
    }))
  };

  const getData = async (value) => {
    // setLoading(true);

  };

  const columns = [
    {
      field: "createdUsername", headerName: "Auid", flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "serialNo",
      headerName: "Serial No.",
      flex: 1,
    },
    {
      field: "grnRefNo",
      headerName: "GRN Ref No.",
      flex: 1,
      type: "number",
      hideable: false,
      valueGetter: (value, row) => (Number(row?.INRCASH % 1 !== 0 ? row?.INRCASH?.toFixed(2) : row?.INRCASH) || 0)
    },
    {
      field: "issuedBy",
      headerName: "Issued By",
      flex: 1,
    },
    {
      field: "issuedDate",
      headerName: "Issued Date",
      flex: 1,
    },
    {
      field: "attachment",
      headerName: "Attachment",
      flex: 1,
    },
    {
      field: "acknowledge",
      headerName: "Acknowledge",
      flex: 1,
    },
        {
      field: "printacknowledge",
      headerName: "Print Acknowledge",
      flex: 1,
    },
  ];


  return (
    <Box>
      <Box sx={{ position: "relative", marginTop: { xs: 8, md:1 } }}>
        <Box sx={{ position: "absolute", width: "100%",}}>
          <GridIndex rows={rows} columns={columns} loading={values.loading}/>
        </Box>
      </Box>
      <ModalWrapper
        title=""
        maxWidth={1000}
        open={isPrintModalOpen}
        setOpen={setIsPrintModalOpen}
      >
        <Box borderRadius={3}>
          {!!reportPath && (
            <object
              data={reportPath}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>
      </ModalWrapper>
    </Box>
  );
}

export default LaptopIssueHistoryIndex;
