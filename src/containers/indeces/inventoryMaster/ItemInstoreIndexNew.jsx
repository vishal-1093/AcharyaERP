import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Grid, Button, Box, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import ModalWrapper from "../../../components/ModalWrapper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";

function ItemInstoreIndexNew() {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [openWrapper, setOpenWrapper] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const columns = [
    { field: "item_serial_no", headerName: "Sl.No", flex: 1 },
    { field: "item_names", headerName: "Item Name", flex: 1 },
    { field: "item_description", headerName: "Item Description", flex: 1 },
    { field: "make", headerName: "Make", flex: 1 },
    { field: "ledger_name", headerName: "Ledger", flex: 1 },
    { field: "measure_name", headerName: "Units", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/InventoryMaster/Assignment/Update/${params.row.id}`)
          }
        >
          <EditIcon />
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
        `/api/inventory/fetchAllEnvItemsStores?page=0&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleOpeningBalance = async (params) => {
    setOpenWrapper(true);
    await axios
      .get(`/api/inventory/envItemsStores/${params.row.id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => console.error(error));
  };
  const handleOb = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateOb = async () => {
    await axios
      .put(`/api/inventory/envItemsStores/${data.item_id}`, data)
      .then((res) => {
        if (res.status === 200) {
          getData();
          setOpenWrapper(false);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <ModalWrapper
        open={openWrapper}
        title=""
        maxWidth={500}
        setOpen={setOpenWrapper}
      >
        <Box component="form">
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12}>
              <Typography variant="subtitle2">Update OB</Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Quantity"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                name="opening_balance"
                handleChange={handleOb}
                value={data.opening_balance}
              />
            </Grid>

            <Grid item textAlign="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={updateOb}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 8 }}>
        <Button
          onClick={() => navigate("/InventoryMaster/Assignment/New")}
          variant="contained"
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default ItemInstoreIndexNew;
