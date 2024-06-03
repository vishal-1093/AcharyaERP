import { useState, useEffect } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import Consumables from "../../../pages/masters/Consumables";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";

function Expenditure() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [legderOptions, setLegderOptions] = useState([]);
  const [values, setValues] = useState({ ledgerId: null });

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { groupName, groupId } = useParams();

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
        setLegderOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    if (values.ledgerId)
      await axios
        .get(
          `/api/purchase/getListOfStockRegisterByLegderId?ledgerId=${values.ledgerId}`
        )
        .then((res) => {
          console.log(res);
          const rowId = res.data.data.map((obj, index) => ({
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
          //   onClick={() => handleGRN(params.row)}
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
          //   onClick={() => handleClosingStock(params.row)}
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
    getData();
    setCrumbs([{ name: "Consumables" }, { name: `${groupName}` }]);
  }, [groupName]);

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
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
