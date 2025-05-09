import { useEffect, useState } from "react"
import { Box, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "../../../services/Api";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";


const RazorPaySettlementDetail = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    instName: false, 
    createdAt: false   
   })
  const { pathname, state } = useLocation();
  const { settlementId } = useParams()
  const selectedDate = state?.settlementDate;
  const setCrumbs = useBreadcrumbs()
  useEffect(() => {
    getSettlementData()
    setCrumbs([
      { name: "Razorpay Settlements", link: "/razorpay-settlement-master" },
      { name: "Settlement Detail" }
    ])
  }, [settlementId])

  const getSettlementData = () => {
    setLoading(true)
    axios.get(`/api/settelmentBySettlementIdAndDate?settlementId=${settlementId}&date=${selectedDate}`)
      .then(res => {
        const { data } = res?.data
        setRows([...data] || [])
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const columns = [
    {
      field: "instName",
      headerName: " School Name",
      flex: 1
    },
    {
      field: "orderId",
      headerName: "Reference No",
      flex: 1,
    },
    {
      field: "entityId",
      headerName: "Transaction No",
      flex: 1,
      //  hide: true,
    },
    {
      field: "settlementUtr",
      headerName: "Settlement Utr",
      flex: 1,
    },
    { field: "amount", headerName: "Amount", flex: 1, headerAlign: "center", cellClassName: "rightAlignedCell" },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1
    },
  ];

  return (
    <Box mt={2}>
      <GridIndex
        rows={rows}
        columns={columns}
        loading={loading}
        columnVisibilityModel={columnVisibilityModel}
        setColumnVisibilityModel={setColumnVisibilityModel}
        rowSelectionModel={[]}
        getRowId={row => row.razorPaySettlementId}
      />
    </Box>
  )
}

export default RazorPaySettlementDetail