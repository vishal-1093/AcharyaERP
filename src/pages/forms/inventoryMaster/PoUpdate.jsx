import { useState, useEffect, lazy } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate, useLocation, useParams } from "react-router-dom";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomSelect = lazy(() =>
  import("../../../components/Inputs/CustomSelect")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initValues = {
  schoolId: 1,
  vendorId: "",
  storeId: "",
  remarks: "",
  quotationNo: "",
  termsOfPayment: "",
  destination: "",
  otherReferences: "",
  noOfDays: "",
  accountPaymentType: "",
  requestType: "",
  termsAndConditions: "",
  gstValue: "",
};

const initialValuesTwo = {
  itemId: null,
  itemDescription: "",
  rate: "",
  quantity: "",
  discount: "",
  gst: "",
  totalAmount: "",
  actualAmount: "",
  mainDiscount: "",
  cost: "",
};

const requiredFields = [];

function PoUpdate() {
  const [values, setValues] = useState(initValues);
  const [valuesTwo, setValuesTwo] = useState([initialValuesTwo]);
  const [data, setData] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();

  const checks = {};

  useEffect(() => {
    getVendorData();
    getPoData();
  }, []);

  useEffect(() => {
    getItemData();
  }, [values.requestType]);

  const getPoData = async () => {
    await axios
      .get(`/api/purchase/getPurchaseOrderById?id=${id}`)
      .then((res) => {
        setData(res.data.data);
        setValues({
          vendorId: res.data.data?.purchaseOrder.vendorId,
          quotationNo: res.data.data?.purchaseOrder.quotationNo,
          destination: res.data.data?.purchaseOrder.destination,
          accountPaymentType: res.data.data?.purchaseOrder.accountPaymentType,
          requestType: res.data.data?.purchaseOrder.requestType,
          termsAndConditions: res.data.data?.purchaseOrder.termsAndConditions,
          destination: res.data.data?.purchaseOrder.destination,
          otherReferences: res.data.data?.purchaseOrder.otherReference,
          vendor: res.data.data?.purchaseOrder.vendor,
          institute: res.data.data?.purchaseOrder.institute,
          instituteId: res.data.data?.purchaseOrder.instituteId,
          remarks: res.data.data?.purchaseOrder.remarks,
        });
        const temp = [];
        res.data.data?.purchaseOrder?.purchaseItems.map((obj) => {
          temp.push({
            tempItemId: obj.purchase_item_id,
            balanceQuantity: obj.balanceQuantity,
            rate: obj.rate,
            quantity: obj.quantity,
            gst: obj.gst,
            discount: obj.discount,
            totalAmount: obj.totalAmount,
            itemNameWithDescription: obj.itemName,
            itemId: obj?.envItemsInStoresId?.env_item_id,
            cost: obj.costTotal,
            gstValue: obj.gstTotal,
            mainDiscount: obj.discountTotal,
            uom: obj.measureName,
          });
        });
        setValuesTwo(temp);
        setPurchaseOrderId(res.data.data.purchaseOrder.purchase_order_id);
        setCrumbs([{ name: "PO Update", link: "/PoMaster" }]);
      })
      .catch((err) => console.error(err));
  };

  const getVendorData = async () => {
    await axios
      .get(`/api/inventory/vendorActiveDetails`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.vendor_id,
            label: obj.vendor_name,
          });
        });
        setVendorOptions(data);
      })
      .catch((error) => console.error(error));
  };

  const getItemData = async () => {
    if (values.requestType)
      await axios
        .get(`/api/inventory/allActiveitemsDetails`)
        .then((res) => {
          setItemOptions(
            res.data.data
              .filter(
                (obj) =>
                  obj.itemType.toLowerCase().substr(0, 1) ===
                  values.requestType.toLowerCase().substr(0, 1)
              )
              .map((val) => ({
                label: val.itemNamesWithDiscriprtionAndMake,
                value: val.envItemId,
                itemNameWithDescription: val.itemNamesWithDiscriprtionAndMake,
                itemName: val.itemNames,
              }))
          );
        })
        .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "storeId") {
      await axios
        .get(`/api/inventory/StoresStock`)
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.stock_type_id === newValue) {
              setStoreName(obj.stock_type_name);
            }
          });
        })
        .catch((error) => console.error(error));
      setValues((prev) => ({ ...prev, [name]: newValue }));
    }
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleChangeAdvanceOne = (name, newValue) => {
    const splitName = name.split("-");
    const keyName = splitName[0];
    const index = splitName[1];

    const item = itemOptions.find((item) => item.value === newValue);

    const isItemSelected = valuesTwo.some((row) => row.itemId === newValue);

    if (!isItemSelected) {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (Number(index) === i)
            return {
              ...obj,
              [keyName]: newValue,
              ["itemNameWithDescription"]: item?.itemNameWithDescription,
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
    setValuesTwo((prev) => [initialValuesTwo, ...prev]);
  };

  const deleteRow = () => {
    const filtered = [...valuesTwo];
    filtered.shift();
    setValuesTwo(filtered);
  };

  const handleChangeItems = (e, index) => {
    if (e.target.name === "rate") {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (index === i) {
            const gstValue = (e.target.value * obj.quantity * obj.gst) / 100;
            const actualValue = e.target.value * obj.quantity;
            const discountedValue = (actualValue * obj.discount) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;

            return {
              ...obj,
              ["rate"]: e.target.value,
              ["totalAmount"]: finalAmount ? finalAmount : e.target.value,
              ["cost"]: actualValue ? actualValue : e.target.value,
              ["gstValue"]: gstValue,
              ["mainDiscount"]: discountedValue,
            };
          } else {
            return obj;
          }
        })
      );
    }
    if (e.target.name === "quantity") {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (index === i) {
            const actualValue = obj.rate * e.target.value;
            const gstValue = (actualValue * obj.gst) / 100;
            const discountedValue = (actualValue * obj.discount) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;

            return {
              ...obj,
              ["actualAmount"]: actualValue,
              ["totalAmount"]: finalAmount ? finalAmount : 0,
              ["cost"]: actualValue,
              ["gstValue"]: gstValue,
              ["mainDiscount"]: discountedValue,
            };
          } else {
            return obj;
          }
        })
      );
    }

    if (e.target.name === "discount") {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (index === i) {
            const actualValue = obj.rate * obj.quantity;
            const discountedValue = (actualValue * e.target.value) / 100;
            const gstValue = (actualValue * obj.gst) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;

            return {
              ...obj,
              ["discount"]: e.target.value,
              ["totalAmount"]: finalAmount ? finalAmount : 0,
              ["mainDiscount"]: discountedValue,
              ["gstValue"]: gstValue,
            };
          } else {
            return obj;
          }
        })
      );
    }
    if (e.target.name === "gst") {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (index === i) {
            const actualValue = obj.rate * obj.quantity;
            const discountedValue = (actualValue * obj.discount) / 100;
            const gstValue = (actualValue * e.target.value) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;

            return {
              ...obj,
              ["gst"]: e.target.value,
              ["totalAmount"]: finalAmount ? finalAmount : 0,
              ["gstValue"]: gstValue,
              ["mainDiscount"]: discountedValue,
            };
          } else {
            return obj;
          }
        })
      );
    } else {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (index === i) return { ...obj, [e.target.name]: e.target.value };
          return obj;
        })
      );
    }
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

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);

      const tempTwo = [];

      data?.purchaseOrder?.purchaseItems.map((obj) => {
        tempTwo.push({
          costTotal: obj.costTotal,
          discount: obj.discount,
          discountTotal: obj.discountTotal,
          envItemId: obj.envItemsInStoresId.env_item_id,
          gst: obj.gst,
          gstTotal: obj.gstTotal,
          itemName: obj.itemName,
          poReferenceNo: data?.purchaseOrder?.poReferenceNo,
          purchaseItemId: obj.purchase_item_id,
          purchaseOrderId: id,
          quantity: obj.quantity,
          rate: obj.rate,
          totalAmount: obj.totalAmount,
        });
      });

      const temp = {};
      const tempOne = [];
      temp.active = true;
      temp.vendorId = values.vendorId;
      temp.vendor = values.vendor;
      temp.storeName = storeName;
      temp.remarks = values.remarks;
      temp.quotationNo = values.quotationNo;
      temp.noOfDays = values.noOfDays;
      temp.accountPaymentType = values.accountPaymentType;
      temp.requestType = values.requestType;
      temp.termsAndConditions = values.termsAndConditions;
      temp.destination = values.destination;
      temp.otherReference = values.otherReferences;
      temp.instituteId = values.instituteId;
      temp.institute = values.institute;

      valuesTwo.map((obj) => {
        tempOne.push({
          purchase_item_id: obj.tempItemId,
          costTotal: obj.cost,
          discount: obj.discount,
          gst: obj.gst,
          quantity: obj.quantity,
          rate: parseFloat(obj.rate),
          totalAmount: obj.totalAmount,
          itemName: obj.itemNameWithDescription,
          envItemsInStoresId: obj.itemId,
          discountTotal: obj.mainDiscount,
          gstTotal: obj.gstValue,
        });
      });

      temp.purchaseItems = tempOne;

      await axios
        .post(`/api/purchase/cratePurchaseItemHistory`, tempTwo)
        .then((res) => {})
        .catch((err) => console.error(err));

      await axios
        .put(
          `/api/purchase/updatePurchaseOrder?purchaseOrderId=${purchaseOrderId}`,
          temp
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            setLoading(false);
            navigate(`/PoMaster`, { replace: true });
          } else {
            setLoading(false);
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
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="vendorId"
              label="Vendor"
              value={values.vendorId}
              options={vendorOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="quotationNo"
              label="Quotation No"
              value={values.quotationNo}
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="destination"
              label="Destination"
              value={values.destination}
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="otherReferences"
              label="Other References"
              value={values.otherReferences}
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomSelect
              name="accountPaymentType"
              label="Account Payment Type"
              value={values.accountPaymentType}
              items={[
                { value: "Advance", label: "Advance" },
                {
                  value: "After good received/completion of work",
                  label: "After good received/completion of work",
                },
              ]}
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomSelect
              name="requestType"
              label="Request Type"
              value={values.requestType}
              items={[
                { value: "GRN", label: "GRN" },
                { value: "SRN", label: "SRN" },
                { value: "Library", label: "Library Books" },
              ]}
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              name="termsAndConditions"
              label="Terms and Conditions"
              value={values.termsAndConditions}
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={3}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              required
              disabled
            />
          </Grid>
        </Grid>

        {valuesTwo.map((obj, i) => {
          return (
            <>
              <Grid item xs={12} mt={2}>
                <Card>
                  <CardContent>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={2}
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          name={"itemId" + "-" + i}
                          label={
                            values.requestType === "SRN"
                              ? "Service Description"
                              : "Item"
                          }
                          value={obj.itemId}
                          options={itemOptions}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          required
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <CustomTextField
                          name="rate"
                          value={obj.rate}
                          label="Rate"
                          handleChange={(e) => handleChangeItems(e, i)}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <CustomTextField
                          name="quantity"
                          value={obj.quantity}
                          label="Quantity"
                          handleChange={(e) => handleChangeItems(e, i)}
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="cost"
                          value={obj.cost}
                          label="Cost"
                          handleChange={(e) => handleChangeItems(e, i)}
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="discount"
                          value={obj.discount}
                          label="Disc(%)"
                          handleChange={(e) => handleChangeItems(e, i)}
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="gst"
                          value={obj.gst}
                          label="GST(%)"
                          handleChange={(e) => handleChangeItems(e, i)}
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <CustomTextField
                          name="totalAmount"
                          value={obj.totalAmount}
                          label="Total Amount"
                          handleChange={(e) => handleChangeItems(e, i)}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </>
          );
        })}

        <Grid item xs={12} md={4} mt={2} align="right">
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleUpdate}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>{"Update"}</strong>
            )}
          </Button>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default PoUpdate;
