import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const CustomSelect = lazy(() => import("../../../components/Inputs/CustomSelect"));
const CustomRadioButtons = lazy(() => import("../../../components/Inputs/CustomRadioButtons"));

const initialValues = {
  itemName: "",
  shortName: "",
  goodsType: "",
  library_book_status: false,
  isAccession: false,
};

const requiredFields = ["itemName", "shortName"];

function ItemCreation() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [programId, setProgramId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    itemName: [values.itemName !== ""],
    shortName: [values.shortName !== ""],
  };
  const errorMessages = {
    itemName: ["This field is required"],
    shortName: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/inventorymaster/item/new") {
      setIsNew(true);
      setCrumbs([
        { name: "InventoryMaster", link: "/InventoryMaster/Item" },
        { name: "Item" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const getProgramData = async () => {
    await axios
      .get(`/api/inventory/itemsCreation/${id}`)
      .then((res) => {
        setValues({
          itemName: res.data.data.item_names,
          shortName: res.data.data.item_short_name,
          goodsType: res.data.data.item_type,
          library_book_status: res.data.data.library_book_status,
          isAccession: res.data.data.isAccession,
        });
        setProgramId(res.data.data.item_id);
        setCrumbs([
          { name: "InventoryMaster", link: "/InventoryMaster/Item" },
          { name: "Item" },
          { name: "Update" },
          { name: res.data.data.item_names },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.item_names = values.itemName;
      temp.item_short_name = values.shortName.toUpperCase();
      temp.item_type = values.goodsType;
      temp.library_book_status = values.library_book_status;
      temp.isAccession = values.isAccession;

      await axios
        .post(`/api/inventory/itemsCreation`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Item Created",
            });
            navigate("/InventoryMaster/Item", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.item_id = programId;
      temp.item_names = values.itemName;
      temp.item_short_name = values.shortName.toUpperCase();
      temp.item_type = values.goodsType;
      temp.isAccession = values.isAccession;
      temp.library_book_status = values.library_book_status;

      await axios
        .put(`/api/inventory/itemsCreation/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Item Updated",
            });
            navigate("/InventoryMaster/Item", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="itemName"
              label="Item"
              value={values.itemName}
              handleChange={handleChange}
              errors={errorMessages.itemName}
              checks={checks.itemName}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              errors={errorMessages.shortName}
              checks={checks.shortName}
              inputProps={{
                minLength: 1,
                maxLength: 5,
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="goodsType"
              label="Type"
              value={values.goodsType}
              handleChange={handleChange}
              items={[
                { label: "Goods", value: "Goods" },
                { label: "Service", value: "Service" },
              ]}
            />
          </Grid>
          {values.goodsType === "Goods" && (
            <>
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  name="library_book_status"
                  label="Library Book"
                  value={values.library_book_status}
                  items={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  name="isAccession"
                  label="Is Accession"
                  value={values.isAccession}
                  items={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
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
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ItemCreation;
