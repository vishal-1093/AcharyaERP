import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Grid, Button, Box, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../../components/ModalWrapper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { checkAdminAccess } from "../../../utils/DateTimeUtils.js";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = {
  scrap: "",
  remarks: "",
};

function ItemAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [ModalOpen, setModalOpen] = useState(false);
  const [AssignmentId, setAssignmentId] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [Stock, setStock] = useState([]);
  const [UOM, setUOM] = useState([]);
  const [openWrapper, setOpenWrapper] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const navigate = useNavigate();

  const columns = [
    { field: "item_serial_no", headerName: "Sl.No", flex: 1 },
    {
      field: "item_names",
      headerName: "Item Name",
      flex: 1,
      renderCell: (params) => {
        return (
          <span>
            {params?.row?.library_book_status ? (
              <span>
                {params?.row?.title_of_book}-{params?.row?.author}-
                {params?.row?.edition}
              </span>
            ) : (
              <span>
                {params?.row?.item_names}-{params?.row?.item_description}-
                {params?.row?.make}
              </span>
            )}
          </span>
        );
      },
    },
    { field: "ledger_name", headerName: "Ledger", flex: 1 },
    { field: "measure_name", headerName: "Units", flex: 1 },

    {
      field: "Scrap",
      headerName: "Scrap",
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={() =>
            HandleModal({
              id: params.row.id,
              measure_name: params.row.measure_name,
            })
          }
          style={{ cursor: "pointer" }}
        >
          {checkAdminAccess() && <AddCircleOutlineIcon />}
        </div>
      ),
    },

    {
      field: "modified_date",
      headerName: "Update OB",
      renderCell: (params) => {
        return (
          <IconButton label="OS" onClick={() => handleOpeningBalance(params)}>
            <AddCircleOutlineIcon />
          </IconButton>
        );
      },
    },
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
        `/api/inventory/fetchAllEnvItemsStores?page=0&page_size=1000000&sort=created_by`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const getScrapData = async (id) => {
    await axios
      .get(`/api/purchase/getScrapDetails?item_assignment_id=${id}`)
      .then((res) => {
        if (res.data.success && res.data.status === 200) {
          const scrapData = res.data.data;
          setValues({
            scrap: scrapData.enterQuantity || "",
            remarks: scrapData.remarks || "",
          });
          setUOM(scrapData.uom || "");
          setAssignmentId(scrapData.itemAssigmentId || "");
        } else {
          setValues(initialValues);
          setUOM("");
          setAssignmentId("");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
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

  const HandleModal = async ({ id, measure_name }) => {
    setAssignmentId(id);
    setUOM(measure_name);
    setModalOpen(true);
    getScrapData(id);
    await axios
      .get(`/api/purchase/getClosingStock?item_assignment_id=${id}`)
      .then((res) => {
        setStock(res.data.data.closingStock);
      })
      .catch((err) => console.error(err));
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
  const handleSubmit = async () => {
    try {
      const scrapQuantity = values.scrap;
      const remarks = values.remarks;
      if (scrapQuantity > Stock) {
        setAlertMessage({
          severity: "error",
          message: "Scrap quantity cannot exceed available stock.",
        });
        setValues(initialValues);
        setAlertOpen(true);
        return;
      }

      const payload = {
        itemAssigmentId: AssignmentId,
        enterQuantity: scrapQuantity,
        uom: UOM,
        remarks: remarks,
      };
      await axios.post(`/api/purchase/saveScrap`, payload);

      setAlertMessage({
        severity: "success",
        message: "Scrap record created successfully.",
      });
      setValues(initialValues);
      setAlertOpen(true);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      setAlertMessage({
        severity: "error",
        message: "An error occurred while creating scrap record.",
      });
      setAlertOpen(true);
      setValues(initialValues);
    }
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
                value={
                  data.opening_balance ? parseInt(data.opening_balance) : 0
                }
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          disabled={rows.active === false}
          onClick={() => navigate("/InventoryMaster/Assignment/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>

      <ModalWrapper
        open={ModalOpen}
        setOpen={setModalOpen}
        maxWidth={600}
        title={"Scrap"}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={3}>
            <CustomTextField label="Stock" value={Stock} disabled fullWidth />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Measure Name"
              value={UOM}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Scrap"
              value={values.scrap}
              fullWidth
              inputProps={{
                type: "number",
                min: 0,
              }}
              onChange={handleChange("scrap")}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Remarks"
              value={values.remarks}
              fullWidth
              onChange={handleChange("remarks")}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
}

export default ItemAssignmentIndex;
