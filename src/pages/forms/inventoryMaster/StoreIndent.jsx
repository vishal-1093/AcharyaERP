import { useState, useEffect, lazy } from "react";
import {
  Box,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  styled,
  TableCell,
  TableBody,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const empId = sessionStorage.getItem("empId");

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = {
  itemId: null,
  storeItemId: null,
  measureId: null,
  description: "",
  quantity: "",
  units: "",
  remarks: "",
  requestedDate: "",
  approverStatus: "",
};

const requiredFields = [];

function StoreIndent() {
  const [values, setValues] = useState([
    initialValues,
    initialValues,
    initialValues,
    initialValues,
    initialValues,
  ]);

  const [data, setData] = useState({ remarks: "" });
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unit, setUnit] = useState([]);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([
      { name: "Store Indent", link: "/InventoryMaster/StoreIndentIndex  " },
    ]);
    getItemsData();
    getUnitData();
  }, [values]);

  const checks = {};
  const errorMessages = {};

  values.forEach((obj) => {
    checks[obj.itemId] = [obj.itemId !== null];
    checks[obj.quantity] = [obj.quantity !== ""];

    errorMessages[obj.itemId] = ["This field is required"];
    errorMessages[obj.quantity] = ["This field is required"];
  });

  const getItemsData = async () => {
    await axios
      .get(`/api/inventory/getItemNameConcatWithdescriptionAndMake`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.env_item_id,
            label: obj.ITEM_NAME,
            uom: obj.measure_id,
            closingStock: obj.closingStock,
            storeItemId: obj.item_id,
          });
        });
        setItems(data);
      })
      .catch((err) => console.error(err));
  };

  const getUnitData = async () => {
    await axios(`/api/activeMeasure`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.measure_id,
            label: obj.measure_name,
          });
        });
        setUnit(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e, index) => {
    if (e.target.name === "remarks") {
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    setValues((prev) =>
      prev.map((obj, i) => {
        if (index === i)
          return {
            ...obj,
            [e.target.name]:
              e.target.value > obj.closingStock
                ? obj.closingStock
                : e.target.value,
          };
        return obj;
      })
    );
  };

  const handleChangeAdvance = (name, newValue) => {
    const splitName = name.split("-");
    const index = parseInt(splitName[1]);
    const keyName = splitName[0];
    const selectedItem = items.find((item) => item.value === newValue);
    const itemSelected = values.some((row) => row.itemId === newValue);

    if (!itemSelected) {
      setValues((prev) =>
        prev.map((obj, i) => {
          if (index === i)
            return {
              ...obj,
              [keyName]: newValue,
              closingStock: selectedItem?.closingStock,
              measureId: selectedItem?.uom,
              storeItemId: selectedItem?.storeItemId,
            };
          return obj;
        })
      );
    } else {
      setAlertMessage({
        severity: "error",
        message: "Item is already selected",
      });
      setAlertOpen(true);
    }
  };

  const handleAdd = () => {
    setValues((prev) => [...prev, initialValues]);
  };

  const handleRemove = () => {
    const filtered = [...values];
    filtered.pop();
    setValues(filtered);
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < values.length; i++) {
      if (values[i].itemId == null || values[i].quantity == "") {
        return false;
      }
      return true;
    }
  };

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = [];

      values.map((obj) => {
        if (obj.itemId !== null && obj.description !== null) {
          temp.push({
            active: true,
            remarks: data.remarks,
            financial_year_id: null,
            env_item_id: obj.itemId,
            item_id: obj.storeItemId,
            quantity: obj.quantity,
            measure_id: obj.units,
            requested_date: obj.requestedDate,
            approver1_status: obj.approverStatus,
            emp_id: empId,
          });
        }
      });

      await axios
        .post(`/api/inventory/storeIndentRequest`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InventoryMaster/StoreIndentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Store Indent Created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid item xs={12} mt={2.5} align="right">
          <Button
            variant="contained"
            color="error"
            onClick={handleRemove}
            disabled={values?.length === 1}
            style={{ marginRight: "10px" }}
          >
            <RemoveIcon />
          </Button>

          <Button variant="contained" color="success" onClick={handleAdd}>
            <AddIcon />
          </Button>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12} md={8} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Item Name *
                    </StyledTableCell>

                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      UOM
                    </StyledTableCell>

                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Quantity
                    </StyledTableCell>

                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Closing Stock
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCell>
                          <CustomAutocomplete
                            name={"itemId" + "-" + i}
                            label="select one"
                            value={obj.itemId}
                            handleChangeAdvance={handleChangeAdvance}
                            options={items}
                            checks={checks[obj.itemId]}
                            errors={errorMessages[obj.itemId]}
                            required
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          <CustomAutocomplete
                            name={"measureId" + "-" + i}
                            label="select one"
                            value={obj.measureId}
                            handleChangeAdvance={handleChangeAdvance}
                            options={unit}
                            disabled
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          <CustomTextField
                            name="quantity"
                            label=""
                            value={obj.quantity}
                            handleChange={(e) => handleChange(e, i)}
                            checks={checks[obj.quantity]}
                            errors={errorMessages[obj.quantity]}
                          />
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj.closingStock}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid
          container
          rowSpacing={2}
          justifyContent="center"
          alignItems="center"
          columnSpacing={4}
        >
          <Grid item xs={12} md={4} mb={10} mt={2}>
            <CustomTextField
              multiline
              rows={2}
              label="Remarks"
              value={data.remarks}
              name="remarks"
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} mt={-25} align="right">
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default StoreIndent;
