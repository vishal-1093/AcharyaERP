import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  tableCellClasses,
  styled,
  Button,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate } from "react-router-dom";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const initialValues = {
  itemId: null,
  quantity: null,
  approximateRate: null,
  totalValue: null,
  vendorName: "",
  vendorContactNo: "",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));
function PurchaseIndent() {
  const itemsLength = 5;
  const temp = [];
  for (let i = 0; i <= itemsLength; i++) {
    temp.push(initialValues);
  }

  const [values, setValues] = useState(temp);
  const [itemOptions, setItemOptions] = useState([]);
  const [validRows, setValidRows] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {};
  const errorMessages = {};

  useEffect(() => {
    getItemsData();
    setCrumbs([{ name: "Purchase Indent" }]);
  }, []);

  useEffect(() => {
    const isRowsValid = values.some(
      (obj) =>
        obj.itemId !== null &&
        obj.quantity !== null &&
        obj.vendorName !== "" &&
        obj.vendorContactNo !== ""
    );
    setValidRows(isRowsValid);
  }, [values]);

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
        setItemOptions(data);
      })
      .catch((err) => console.error(err));
  };

  // values.forEach((obj, i) => {
  //   // checks[obj.quantity] = [/^[0-9]{1,100}$/.test(obj.quantity)];
  //   // errorMessages[obj.quantity] = ["Enter only numbers"];

  //   // checks[obj.approximateRate] = [/^[0-9]{1,100}$/.test(obj.approximateRate)];
  //   // errorMessages[obj.approximateRate] = ["Enter only numbers"];

  //   checks[obj.vendorContactNo] = [/^[0-9]{10}$/.test(obj.vendorContactNo)];
  //   errorMessages[obj.vendorContactNo] = ["Invalid contact no"];
  // });

  const handleChangeAdvance = (name, newValue) => {
    const splitName = name.split("-");
    const keyName = splitName[0];
    const index = splitName[1];

    const selectedItem = itemOptions.find((obj) => obj.value === newValue);

    const isItemSelected = values.some((row) => row.itemId === newValue);

    if (!isItemSelected) {
      setValues((prev) =>
        prev.map((obj, i) => {
          if (Number(index) === i)
            return {
              ...obj,
              [keyName]: newValue,
              ["itemNameDescription"]: selectedItem.label,
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

  const handleChange = (e, index) => {
    const keyName = e.target.name;

    if (keyName === "approximateRate") {
      setValues((prev) =>
        prev.map((obj, i) => {
          if (Number(index) === i)
            return {
              ...obj,
              [keyName]: e.target.value,
              ["totalValue"]: obj.quantity * e.target.value,
            };
          return obj;
        })
      );
    } else {
      setValues((prev) =>
        prev.map((obj, i) => {
          if (Number(index) === i) return { ...obj, [keyName]: e.target.value };
          return obj;
        })
      );
    }
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleCreate = async () => {
    try {
      const payload = [];
      values.forEach((obj) => {
        payload.push({
          envItemId: obj.itemId,
          ledgerId: obj.ledgerId,
          quantity: obj.quantity,
          approxRate: obj.approximateRate,
          vendorName: obj.vendorName,
          vendorContactNo: obj.vendorContactNo,
          createdBy: userId,
          remark: obj.remark,
          itemDescription: obj.itemNameDescription,
        });
      });

      await axios.post(`/api/purchaseIndent/saveIndent`, payload);

      setAlertMessage({
        severity: "success",
        message: "Purchase Indent Created",
      });

      setAlertOpen(true);
      navigate("/PurchaseIndentIndex");
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "",
      });
      setAlertOpen(true);
      setValues(initialValues);
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        {/* <FormWrapper> */}
        <Grid
          container
          justifyContent="flex-start"
          // alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12}>
            <TableContainer sx={{ padding: "5px" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: "25%", textAlign: "center" }}>
                      Item
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Qty
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Approx rate
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Total Value
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Vendor Name
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      Vendor Contact No.
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCellBody>
                          <CustomAutocomplete
                            name={`itemId` + "-" + i}
                            label="Item"
                            value={obj.itemId}
                            options={itemOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                          />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <CustomTextField
                            name="quantity"
                            value={obj.quantity}
                            handleChange={(e) => handleChange(e, i)}
                            checks={checks[obj.quantity]}
                            errors={errorMessages[obj.quantity]}
                          />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <CustomTextField
                            name="approximateRate"
                            value={obj.approximateRate}
                            handleChange={(e) => handleChange(e, i)}
                            checks={checks[obj.approximateRate]}
                            errors={errorMessages[obj.approximateRate]}
                          />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <CustomTextField
                            name="totalValue"
                            value={obj.totalValue}
                            handleChange={(e) => handleChange(e, i)}
                            disabled
                          />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <CustomTextField
                            name="vendorName"
                            multiline
                            rows={2}
                            value={obj.vendorName}
                            handleChange={(e) => handleChange(e, i)}
                          />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <CustomTextField
                            name="vendorContactNo"
                            value={obj.vendorContactNo}
                            handleChange={(e) => handleChange(e, i)}
                            checks={checks[obj.vendorContactNo]}
                            errors={errorMessages[obj.vendorContactNo]}
                          />
                        </StyledTableCellBody>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2.5}
              name="remarks"
              label="Remarks"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleCreate}
              disabled={!validRows}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        {/* </FormWrapper> */}
      </Box>
    </>
  );
}
export default PurchaseIndent;
