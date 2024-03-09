import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import {
  Grid,
  Box,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Chip,
  Stack,
  Collapse,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

function StockSubRegister() {
  const [Data, setData] = useState([]);
  const [GRNData, setGRNData] = useState([]);
  const [StockData, setStockData] = useState([]);
  const [GRNModalOpen, setGRNModalOpen] = useState(false);
  const [StockmodalOpen, setStockModalOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      flex: 1,
      hideable: false,
      renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "itemDescription",
      headerName: "Item Description",
      flex: 1,
      hideable: false,
    },
    {
      field: "openingStock",
      headerName: "Opening Stock",
      flex: 1,
      hideable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "grn",
      headerName: "GRN",
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() => handleGRN(params.row)}
          style={{ cursor: "pointer", color: "Blue" }}
        >
          {params.value}
        </div>
      ),
      headerAlign: "right",
      align: "right",
    },
    {
      field: "stockIssue",
      headerName: "Items Issued",
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() => handleClosingStock(params.row)}
          style={{ cursor: "pointer", color: "Blue" }}
        >
          {params.value}
        </div>
      ),
      headerAlign: "right",
      align: "right",
    },
    {
      field: "scrap",
      headerName: "Scrap",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "closingStock",
      headerName: "Closing Stock",
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() =>
            navigate(
              `/ClosingstockReport/${params.row.itemAssigmentName}/${params.row.itemAssignmentId}`
            )
          }
          style={{ cursor: "pointer", color: "Blue" }}
        >
          {params.row.closingStock.toString().length > 4
            ? params.row.closingStock.toFixed(2)
            : params.row.closingStock}
        </div>
      ),
      headerAlign: "right",
      align: "right",
    },
    {
      field: "uom",
      headerName: "UOM",
      flex: 1,
    },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Stock Register", link: "/ItemMaster/StockRegister" }]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/purchase/getListOfStockRegisterByStoreId?store_id=${id}`)
      .then((res) => {
        const rowsWithId = res.data.data.map((row, index) => ({
          ...row,
          id: index + 1,
        }));

        setData(rowsWithId);
      })
      .catch((err) => console.error(err));
  };

  const [itemName, setitemName] = useState([]);

  const handleGRN = async (rowData) => {
    setitemName(rowData.itemName);
    setGRNModalOpen(true);
    await axios
      .get(
        `/api/purchase/getGrnByItemAssigmentId?item_assignment_id=${rowData.itemAssignmentId}`
      )
      .then((res) => {
        setGRNData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const [itemNameStock, setitemNameStock] = useState([]);
  const handleClosingStock = async (rowData) => {
    setitemNameStock(rowData.itemName);
    setStockModalOpen(true);
    await axios
      .get(
        `/api/purchase/getStockIssueByItemAssigmentId?item_assignment_id=${rowData.itemAssignmentId}`
      )
      .then((res) => {
        setStockData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 1 }}>
        <GridIndex rows={Data} columns={columns} />
      </Box>

      <ModalWrapper
        open={GRNModalOpen}
        setOpen={setGRNModalOpen}
        maxWidth={900}
        title={"GRN"}
      >
        <Box mt={2} p={3}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
              <TableHead className={classes.bg}>
                <TableRow>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Sl. No.
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Item Name
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Item Description
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    GRN Number
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    GRN Date
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Received Quantity
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Created By
                  </TableCell>

                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    UOM
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.table}>
                {GRNData.sort(
                  (a, b) => moment(a.selected_date) - moment(b.selected_date)
                ).map((dataItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{dataItem.itemName}</TableCell>
                    <TableCell>{dataItem.itemAssignmentName}</TableCell>

                    <TableCell>{dataItem.grnNumber}</TableCell>
                    <TableCell>
                      {dataItem.grnDate
                        ? moment(dataItem.grnDate).format("DD-MM-YYYY")
                        : ""}
                    </TableCell>
                    <TableCell>{dataItem.quantity}</TableCell>
                    <TableCell>{dataItem.createdBy}</TableCell>

                    <TableCell>{dataItem.uom}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </ModalWrapper>

      <ModalWrapper
        open={StockmodalOpen}
        setOpen={setStockModalOpen}
        maxWidth={900}
        title={"Stock"}
      >
        <Box mt={2} p={3}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
              <TableHead className={classes.bg}>
                <TableRow>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Sl. No.
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Item Name
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Item Description
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Issue number
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Issue Date
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Issued To
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Issued Quantity
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    UOM
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.table}>
                {StockData.sort(
                  (a, b) => moment(a.selected_date) - moment(b.selected_date)
                ).map((dataItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{itemNameStock}</TableCell>
                    <TableCell>{dataItem.itemAssignmentName}</TableCell>
                    <TableCell>{dataItem.stockNumber}</TableCell>
                    <TableCell>
                      {dataItem.issueDate
                        ? moment(dataItem.issueDate).format("DD-MM-YYYY")
                        : ""}
                    </TableCell>
                    <TableCell>{dataItem.issueTo}</TableCell>
                    <TableCell>{dataItem.quantity}</TableCell>
                    <TableCell>{dataItem.uom}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </ModalWrapper>
    </>
  );
}

export default StockSubRegister;
