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
  schoolId: null,
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
  cost: "",
  remarks: "",
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
  uom: "",
};
const maxLength = 550;

const requiredFields = [];

function DirectPOCreation() {
  const [isNew, setIsNew] = useState(false);
  const [values, setValues] = useState(initValues);
  const [valuesTwo, setValuesTwo] = useState([initialValuesTwo]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [tempPurchaseOrderId, setTempPurchaseOrderId] = useState(null);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsValid, setRowsValid] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = useLocation();
  const approverStatus = location.state?.approverStatus;

  const checks = {};

  const getRemainingCharacters = (field) => maxLength - values[field]?.length;

  useEffect(() => {
    getVendorData();
    getSchoolData();
    if (pathname.toLowerCase() === "/directpocreation") {
      setIsNew(true);
      setCrumbs([{ name: "Draft Purchase Order", link: "/Draftpo" }]);
    } else {
      setIsNew(false);
      getPoData();
    }
  }, [pathname]);

  useEffect(() => {
    getItemData();
  }, [values.requestType]);

  useEffect(() => {
    const isRowValid =
      values.vendorId &&
      values.schoolId && values.accountPaymentType &&
      values.requestType &&
      values.quotationNo &&
      values.termsAndConditions && values.remarks;

    const isRowItemsValid = valuesTwo.every(
      (obj) => obj.itemId && obj.rate && obj.quantity
    );

    setRowsValid(isRowValid && isRowItemsValid);
  }, [values, valuesTwo]);

  const getSchoolData = async () => {
    await axios(`/api/institute/school`)
      .then((res) => {
        const schoolData = [];
        res.data.data.forEach((obj) => {
          schoolData.push({
            value: obj.school_id,
            label: obj.school_name,
            school_name_short: obj.school_name_short,
          });
        });
        setSchoolOptions(schoolData);
      })
      .catch((err) => console.error(err));
  };

  const getPoData = async () => {
    await axios
      .get(`/api/purchase/getDraftPurchaseOrderById?id=${id}`)
      .then((res) => {
        setValues({
          vendorId: res.data.data.vendorId,
          quotationNo: res.data.data.quotationNo,
          destination: res.data.data.destination,
          accountPaymentType: res.data.data.accountPaymentType,
          requestType: res.data.data.requestType,
          termsAndConditions: res.data.data.termsAndConditions,
          destination: res.data.data.destination,
          otherReferences: res.data.data.otherReference,
          schoolId: res.data.data.instituteId,
          remarks: res.data.data.remarks,
        });
        const temp = [];
        res.data.data.temporaryPurchaseItems.map((obj) => {
          temp.push({
            tempItemId: obj.temporary_purchase_item_id,
            balanceQuantity: obj.balanceQuantity,
            rate: obj.rate,
            quantity: res.data.data.requestType === "SRN" ? 1 : obj.quantity,
            gst: obj.gst,
            discount: obj.discount,
            totalAmount: obj.totalAmount,
            itemNameWithDescription: obj.itemName,
            itemId: obj.envItemsInStoresId,
            cost: obj.costTotal,
            gstValue: obj.gstTotal,
            mainDiscount: obj.discountTotal,
            uom: obj.measureName,
          });
        });
        setValuesTwo(temp);
        setTempPurchaseOrderId(res.data.data.temporary_purchase_order_id);

        approverStatus
          ? setCrumbs([{ name: "Draft Po Update", link: "/approvepo" }])
          : setCrumbs([{ name: "Draft Po Update", link: "/AssignPoApprover" }]);
      })
      .catch((err) => console.error(err));
  };

  const getVendorData = async () => {
    await axios
      .get(`/api/inventory/vendorActiveDetails`)
      .then((res) => {
        const vendorData = res.data.data.filter(
          (obj) => obj.account_verification_status
        );
        const data = [];
        vendorData.forEach((obj) => {
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
    try {
      const res = await axios.get(`/api/inventory/allActiveitemsDetails`);
      const items = res.data.data;
  
      let filteredItems = [];
  
      if (values.requestType === "Library") {
        filteredItems = items.filter((obj) => obj.libraryBookStatus === true);
      } else if (values.requestType === "GRN") {
        filteredItems = items.filter(
          (obj) => obj.itemType.toLowerCase().startsWith("g") && !obj.libraryBookStatus
        );
      } else {
        filteredItems = items.filter(
          (obj) => obj.itemType.toLowerCase().startsWith(values.requestType.toLowerCase().charAt(0))
        );
      }
  
      const formattedItems = filteredItems.map((val) => {
       
        let nameParts = val.itemNamesWithDiscriprtionAndMake.trim().split("-").map(part => part.trim());
      
     
        if (nameParts[nameParts.length - 1] === "") {
          nameParts.pop();
        }
      
        return {
          label: nameParts.slice(0, 3).join(" - "),
          value: val.envItemId,
          itemNameWithDescription: val.itemNamesWithDiscriprtionAndMake.trim(),
          itemName: val.itemNames.trim(),
          uom: val.measure_name,
        };
      });
      
  
      setItemOptions(formattedItems);
    } catch (err) {
      console.error("Error fetching item data:", err);
    }
  };
  

  const handleChange = (e) => {
    if (e.target.value.length > maxLength) {
      return;
    }
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
              ["uom"]: item?.uom,
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
    const { name, value } = e.target;
    if (name === "rate") {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (i === index) {
            const quantity = values.requestType === "SRN" ? 1 : obj.quantity;
            const actualValue = value * quantity;
            const discountedValue = (actualValue * obj.discount) / 100;
            const gstValue = (actualValue * obj.gst) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;
  
            return {
              ...obj,
              rate: value,
              quantity,
              totalAmount: finalAmount.toFixed(2),
              cost: actualValue,
              gstValue,
              mainDiscount: discountedValue,
            };
          }
          return obj;
        })
      );
    } else if (name === "quantity") {
      if (values.requestType === "SRN") return;
  
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (i === index) {
            const actualValue = obj.rate * value;
            const gstValue = (actualValue * obj.gst) / 100;
            const discountedValue = (actualValue * obj.discount) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;
  
            return {
              ...obj,
              quantity: value,
              actualAmount: actualValue,
              totalAmount: finalAmount.toFixed(2),
              cost: actualValue,
              gstValue,
              mainDiscount: discountedValue,
            };
          }
          return obj;
        })
      );
    } else if (name === "discount") {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (i === index) {
            const quantity = values.requestType === "SRN" ? 1 : obj.quantity;
            const actualValue = obj.rate * quantity;
            const discountedValue = (actualValue * value) / 100;
            const gstValue = (actualValue * obj.gst) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;
  
            return {
              ...obj,
              discount: value,
              quantity,
              totalAmount: finalAmount.toFixed(2),
              mainDiscount: discountedValue,
              gstValue,
            };
          }
          return obj;
        })
      );
    } else if (name === "gst") {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (i === index) {
            const quantity = values.requestType === "SRN" ? 1 : obj.quantity;
            const actualValue = obj.rate * quantity;
            const discountedValue = (actualValue * obj.discount) / 100;
            const gstValue = (actualValue * value) / 100;
            const finalAmount = actualValue - discountedValue + gstValue;
  
            return {
              ...obj,
              gst: value,
              quantity,
              totalAmount: finalAmount.toFixed(2),
              gstValue,
              mainDiscount: discountedValue,
            };
          }
          return obj;
        })
      );
    } else {
      setValuesTwo((prev) =>
        prev.map((obj, i) => {
          if (i === index) return { ...obj, [name]: value };
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      const tempOne = [];
      temp.active = true;
      temp.vendorId = values.vendorId;
      temp.storeName = storeName;
      temp.remarks = values.remarks;
      temp.quotationNo = values.quotationNo;
      temp.noOfDays = values.noOfDays;
      temp.accountPaymentType = values.accountPaymentType;
      temp.requestType = values.requestType;
      temp.termsAndConditions = values.termsAndConditions;
      temp.destination = values.destination;
      temp.otherReference = values.otherReferences;
      temp.instituteId = values.schoolId;
      temp.institute = schoolOptions
        .filter((obj) => obj.value === values.schoolId)
        .map((obj1) => obj1.school_name_short)
        .toString();

      temp.remarks = values.remarks;

      valuesTwo.map((obj) => {
        tempOne.push({
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

      temp.temporaryPurchaseItems = tempOne;

      await axios
        .post(`/api/purchase/draftPurchaseOrder`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Created Successfully",
            });
            setLoading(false);
            navigate(`/Draftpo`, { replace: true });
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

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      const tempOne = [];
      temp.active = true;
      temp.vendorId = values.vendorId;
      temp.storeName = storeName;
      temp.remarks = values.remarks;
      temp.quotationNo = values.quotationNo;
      temp.noOfDays = values.noOfDays;
      temp.accountPaymentType = values.accountPaymentType;
      temp.requestType = values.requestType;
      temp.termsAndConditions = values.termsAndConditions;
      temp.destination = values.destination;
      temp.otherReference = values.otherReferences;
      temp.instituteId = values.schoolId;
      temp.institute = schoolOptions
        .filter((obj) => obj.value === values.schoolId)
        .map((obj1) => obj1.school_name_short)
        .toString();
      temp.remarks = values.remarks;

      valuesTwo.map((obj) => {
        tempOne.push({
          temporary_purchase_item_id: obj.tempItemId,
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

      temp.temporaryPurchaseItems = tempOne;

      await axios
        .put(
          `/api/purchase/updateDraft?temporaryPurchaseOrderId=${tempPurchaseOrderId}`,
          temp
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            setLoading(false);

            approverStatus
              ? navigate(`/Approvepo`, { replace: true })
              : navigate(`/AssignPoApprover`, { replace: true });
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
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="vendorId"
              label="Vendor"
              value={values.vendorId}
              options={vendorOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="quotationNo"
              label="Quotation No"
              value={values.quotationNo}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="destination"
              label="Destination"
              value={values.destination}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="otherReferences"
              label="Other References"
              value={values.otherReferences}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="accountPaymentType"
              label="Account Payment Type"
              value={values.accountPaymentType}
              items={[
                { value: "Advance", label: "Advance" },
                {
                  value: "After GRN/SRN",
                  label: "After GRN/SRN",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
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
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <CustomTextField
              multiline
              rows={3}
              name="termsAndConditions"
              label="Terms and Conditions"
              value={values.termsAndConditions}
              handleChange={handleChange}
              helperText={`Remaining characters : ${getRemainingCharacters(
                "termsAndConditions"
              )}`}
              required
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
            />
          </Grid>
        </Grid>

        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} align="right" mt={2}>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                marginRight: 5,
              }}
              onClick={deleteRow}
            >
              <RemoveIcon />
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleAdd}
              align="right"
              sx={{ borderRadius: 2 }}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>

        {valuesTwo.map((obj, i) => {
          return (
            <>
              <Grid item xs={12} mt={2} key={i}>
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
                              : values.requestType === "GRN"
                              ? "Item"
                              : "Library"
                          }
                          value={obj.itemId}
                          options={itemOptions}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <CustomTextField
                          name="uom"
                          value={obj.uom}
                          label="Uom"
                          handleChange={(e) => handleChangeItems(e, i)}
                          required
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="rate"
                          value={obj.rate}
                          label="Rate"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          handleChange={(e) => handleChangeItems(e, i)}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="quantity"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={values.requestType === "SRN" ? 1 : (obj.quantity ?? 0)}
                          disabled ={values.requestType === "SRN" ? true : false}
                          label="Quantity"
                          handleChange={(e) => handleChangeItems(e, i)}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="cost"
                          value={obj.cost}
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          label="Cost"
                          handleChange={(e) => handleChangeItems(e, i)}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="discount"
                          value={obj.discount}
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          label="Disc(%)"
                          handleChange={(e) => handleChangeItems(e, i)}
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <CustomTextField
                          name="gst"
                          value={obj.gst}
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          label="GST(%)"
                          handleChange={(e) => handleChangeItems(e, i)}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <CustomTextField
                          name="totalAmount"
                          value={obj.totalAmount}
                          label="Total Amount"
                          handleChange={(e) => handleChangeItems(e, i)}
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
            disabled={!rowsValid || loading}
            onClick={isNew ? handleCreate : handleUpdate}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>{isNew ? "Create" : "Update"}</strong>
            )}
          </Button>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default DirectPOCreation;
