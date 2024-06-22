import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import Consumables from "../../../pages/masters/Consumables";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

function Expenditure() {
  const [rows, setRows] = useState([]);
  const [legderOptions, setLegderOptions] = useState([]);
  const [values, setValues] = useState({ ledgerId: null });
  const [itemName, setitemName] = useState([]);
  const [GRNData, setGRNData] = useState([]);
  const [StockData, setStockData] = useState([]);
  const [GRNModalOpen, setGRNModalOpen] = useState(false);
  const [StockmodalOpen, setStockModalOpen] = useState(false);
  const [itemNameStock, setitemNameStock] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { groupName, groupId } = useParams();
  const classes = useStyles();

  useEffect(() => {
    getLedgerOptions();
  }, [groupId]);

  useEffect(() => {
    getData();
  }, [values.ledgerId]);

  const getLedgerOptions = async () => {
    await axios
      .get(`/api/purchase/getLegderbyGroupId?groupId=${groupId}`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ledgerId,
            label: obj.ledgerName,
          });
        });
        setValues((prev) => ({ ...prev, ledgerId: null }));
        setLegderOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    setRows([]);
    if (values.ledgerId)
      await axios
        .get(
          `/api/purchase/getListOfStockRegisterByLegderId?ledgerId=${values.ledgerId}`
        )
        .then((res) => {
          const mainRow = res.data.data.filter((obj, index) => {
            if (obj.closingStock !== 0 && obj.grnQuantity !== 0) {
              return { ...obj };
            }
          });

          const rowId = mainRow.map((obj, index) => ({
            ...obj,
            id: index + 1,
          }));
          setRows(rowId);
        })
        .catch((err) => console.error(err));
  };

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
      field: "opening_balance",
      headerName: "Opening Stock",
      flex: 1,
      hideable: false,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "grnQuantity",
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
      field: "issueQuantity",
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
            navigate(`/ClosingstockReport/${params.row.itemAssignmentId}`, {
              state: { rowData: params.row },
            })
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
      field: "uomName",
      headerName: "UOM",
      flex: 1,
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Consumables" }, { name: `${groupName}` }]);
  }, [groupName]);

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleGRN = async (rowData) => {
    setitemName(rowData);
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <ModalWrapper
          open={GRNModalOpen}
          setOpen={setGRNModalOpen}
          maxWidth={1000}
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
                      <TableCell>{itemName?.itemName}</TableCell>
                      <TableCell>{itemName?.itemDescription}</TableCell>

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
          maxWidth={1000}
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

        <Grid
          container
          justifycontents="flex-start"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12}>
            <Consumables groupName={groupName} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              label="Ledger"
              name="ledgerId"
              value={values.ledgerId}
              options={legderOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <GridIndex rows={rows} columns={columns} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Expenditure;
