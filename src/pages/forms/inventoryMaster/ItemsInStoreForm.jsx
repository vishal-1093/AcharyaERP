import { useState, useEffect, lazy } from "react";
import { Box, Button, Grid } from "@mui/material";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const CustomAutocomplete = lazy(() => import("../../../components/Inputs/CustomAutocomplete"));

const initialValues = {
  itemId: null,
  itemDescription: "",
  ledger: "",
  make: "",
  units: "",
};
const requiredFields = ["itemId", "itemDescription", "make"];

function ItemsInStoreForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [itemOptions, setItemOptions] = useState([]);
  const [ledgerOption, setLedgerOption] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [envItemId, setEnvItemId] = useState(null);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id } = useParams();
  const navigate = useNavigate();

  const checks = {
    itemDescription: [values.itemDescription !== ""],
    make: [values.make !== ""],
  };

  const errorMessages = {
    itemDescription: ["This field is required"],
    make: ["This field is required"],
  };

  useEffect(() => {
    getItems();
    getUnits();
    getLedger();
    if (pathname.toLowerCase() === "/inventorymaster/itemsinstoresform/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Inventory Master", link: "/InventoryMaster/Instr" },
        { name: "Items In Stores" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      setCrumbs([
        { name: "Inventory Master", link: "/InventoryMaster/Instr" },
        { name: "Items In Stores" },
        { name: "Update" },
      ]);
      getData();
    }
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/inventory/envItemsStores/${id}`)
      .then((res) => {
        setValues({
          itemId: res.data.data.item_id,
          itemDescription: res.data.data.item_description,
          make: res.data.data.make,
          ledger: res.data.data.ledger_id,
          units: res.data.data.measure_id,
        });
        setEnvItemId(res.data.data.env_item_id);
      })
      .catch((err) => console.error(err));
  };

  const getItems = async () => {
    await axios
      .get(`/api/inventory/itemsCreation`)
      .then((res) => {
        const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.item_id,
            label: obj.item_names,
            })
          })
        setItemOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getLedger = async () => {
    await axios.get(`/api/finance/Ledger`).then((res) => {
      const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.ledger_id,
          label: obj.ledger_name,
            })
          })
      setLedgerOption(data);
    });
  };

  const getUnits = async () => {
    await axios
      .get(`/api/activeMeasure`)
      .then((res) => {
        const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.measure_id,
              label: obj.measure_name,
            })
          })
        setUnitOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};

      temp.active = true;
      temp.item_id = values.itemId;
      temp.item_description = values.itemDescription;
      temp.ledger_id = values.ledger;
      temp.make = values.make;
      temp.measure_id = values.units;

      await axios
        .post(`/api/inventory/envItemsStores`, temp)
        .then((res) => {
          navigate("/InventoryMaster/InStr", { replace: true });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};

      temp.active = true;
      temp.env_item_id = envItemId;
      temp.item_creation_id = values.itemId;
      temp.item_description = values.itemDescription;
      temp.ledger_id = values.ledger;
      temp.make = values.make;
      temp.measure_id = values.units;
      temp.item_assignment_id = id;

      await axios
        .put(`/api/inventory/envItemsStores/${id}`, temp)
        .then((res) => {
          navigate("/InventoryMaster/InStr", { replace: true });
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box mt={2}>
      <FormWrapper>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="itemId"
              label="Item"
              value={values.itemId}
              options={itemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="itemDescription"
              label="Item Description"
              value={values.itemDescription}
              handleChange={handleChange}
              checks={checks.itemDescription}
              errors={errorMessages.itemDescription}
              multiline
              rows={2}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="make"
              label="Make"
              value={values.make}
              handleChange={handleChange}
              checks={checks.make}
              errors={errorMessages.make}
              multiline
              rows={2}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="ledger"
              label="Ledger"
              value={values.ledger}
              options={ledgerOption}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="units"
              label="Units"
              value={values.units}
              options={unitOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={isNew ? handleCreate : handleUpdate}
              sx={{ borderRadius: 2 }}
            >
              {isNew ? "Create" : "Update"}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ItemsInStoreForm;
