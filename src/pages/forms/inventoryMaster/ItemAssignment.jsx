import { useState, useEffect, lazy } from "react";
import { Box, Button, Grid } from "@mui/material";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  itemId: null,
  itemDescription: "",
  make: "",
  units: "",
  titleOfBook: "",
  author: "",
  edition: "",
  yearOfPublishers: "",
  publisherDetails: "",
  booksAvailable: "",
  referenceCode: "",
  itemSerialNo: "",
};

const requiredFields = ["itemId", "itemDescription"];
const maxLength = 150;

function ItemAssignment() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [itemOptions, setItemOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [envItemId, setEnvItemId] = useState(null);

  const [selectedItem, setSelectedItem] = useState(false);

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

  const getRemainingCharacters = (field) => maxLength - values[field]?.length;

  useEffect(() => {
    getItems();
    getUnits();
    if (pathname.toLowerCase() === "/inventorymaster/assignment/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Inventory Master", link: "/InventoryMaster/Assignment" },
        { name: "Items In Stores" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      setCrumbs([
        { name: "Inventory Master", link: "/InventoryMaster/Assignment" },
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
          title_of_book: res.data.data.title_of_book,
          author: res.data.data.author,
          edition: res.data.data.edition,
          yr_of_Publish: res.data.data.yr_of_Publish,
          publisher_details: res.data.data.publisher_details,
          isbn_code: res.data.data.isbn_code,
          available_books: res.data.data.available_books,
          itemSerialNo: res.data.data.item_serial_no,
          openingBalance: res.data.data.opening_balance,
        });
        if (res.data.data.title_of_book) {
          setSelectedItem(true);
        } else {
          setSelectedItem(false);
        }
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
            library_book_status: obj.library_book_status,
          });
        });
        setItemOptions(data);
      })
      .catch((err) => console.error(err));
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
          });
        });
        setUnitOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e?.target?.value?.length > maxLength) {
      return;
    }
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

  const handleChangeAdvanceItem = (name, newValue) => {
    const selectedItemOption = itemOptions[newValue - 1];
    setSelectedItem(selectedItemOption?.library_book_status);

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

      const selectedItem = itemOptions.find(
        (item) => item.value === values.itemId
      );

      temp.active = true;
      temp.item_id = values.itemId;
      temp.item_description = values.itemDescription
        ? values.itemDescription
        : null;
      temp.make = values.make ? values.make : null;
      temp.measure_id = values.units;
      temp.title_of_book = values.title_of_book;
      temp.author = values.author;
      temp.edition = values.edition;
      temp.yr_of_Publish = values.yr_of_Publish;
      temp.publisher_details = values.publisher_details;
      temp.available_books = values.available_books;
      temp.reference_code = values.referenceCode;
      temp.stock_type_id = 1;
      temp.total_available_in_stores = 1;
      temp.total_issued = 1;
      temp.reference_code = "reference_code";
      temp.isbn_code = values.isbn_code;
      temp.item_assigment_name = [
        selectedItem?.label,
        values.itemDescription,
        values.make
      ]
        .filter(Boolean)
        .join("-");
      

      await axios
        .post(`/api/inventory/envItemsStores`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Created",
            });
            setAlertOpen(true);
            navigate("/InventoryMaster/Assignment", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) =>
          setAlertMessage({
            severity: "error",
            message: err.response.data.message,
          })
        );
      setAlertOpen(true);
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
      const selectedItem = itemOptions.find(
        (item) => item.value === values.itemId
      );

      temp.active = true;
      temp.env_item_id = envItemId;
      temp.item_creation_id = values.itemId;
      temp.item_id = values.itemId;
      temp.item_serial_no = values.itemSerialNo;
      temp.item_description = values.itemDescription;
      temp.ledger_id = values.ledger;
      temp.make = values.make;
      temp.measure_id = values.units;
      temp.item_assignment_id = id;
      temp.title_of_book = values.title_of_book;
      temp.author = values.author;
      temp.edition = values.edition;
      temp.yr_of_Publish = values.yr_of_Publish;
      temp.publisher_details = values.publisher_details;
      temp.available_books = values.available_books;
      temp.isbn_code = values.isbn_code;
      temp.opening_balance = values.openingBalance;
      temp.item_assigment_name = `${selectedItem?.label}-${values.itemDescription}-${values.make}`;

      await axios
        .put(`/api/inventory/envItemsStores/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated",
            });
            setAlertOpen(true);
            navigate("/InventoryMaster/Assignment", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) =>
          setAlertMessage({
            severity: "error",
            message: err.response.data.message,
          })
        );
      setAlertOpen(true);
    }
  };

  return (
    <Box mt={2}>
      <FormWrapper>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="itemId"
              label="Item"
              value={values.itemId}
              options={itemOptions}
              handleChangeAdvance={handleChangeAdvanceItem}
              required
              disabled={!isNew}
            />
          </Grid>

          {!selectedItem && (
            <>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="itemDescription"
                  label="Item Description"
                  value={values.itemDescription}
                  handleChange={handleChange}
                  checks={checks.itemDescription}
                  errors={errorMessages.itemDescription}
                  multiline
                  helperText={`Remaining characters : ${getRemainingCharacters(
                    "itemDescription"
                  )}`}
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
                  // checks={checks.make}
                  // errors={errorMessages.make}
                  multiline
                  rows={2}
                />
              </Grid>
            </>
          )}

          {selectedItem && (
            <>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="title_of_book"
                  label="Title of Book(character less than 50)"
                  value={values.title_of_book}
                  handleChange={handleChange}
                  checks={checks.titleOfBook}
                  errors={errorMessages.titleOfBook}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="author"
                  label="Author"
                  value={values.author}
                  handleChange={handleChange}
                  checks={checks.author}
                  errors={errorMessages.author}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="edition"
                  label="Edition"
                  value={values.edition}
                  handleChange={handleChange}
                  checks={checks.edition}
                  errors={errorMessages.edition}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="yr_of_Publish"
                  label="Year of Publish(yyyy)"
                  value={values.yr_of_Publish}
                  handleChange={handleChange}
                  checks={checks.yearOfPublishers}
                  errors={errorMessages.yearOfPublishers}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="publisherDetails"
                  label="Publisher Details"
                  value={values.publisher_details}
                  handleChange={handleChange}
                  checks={checks.publisherDetails}
                  errors={errorMessages.publisherDetails}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="booksAvailable"
                  label="Count of books available in library"
                  value={values.available_books}
                  handleChange={handleChange}
                  checks={checks.booksAvailable}
                  errors={errorMessages.booksAvailable}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="isbn_code"
                  label="ISBN Code"
                  value={values.isbn_code}
                  handleChange={handleChange}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {isNew ? "Create" : "Update"}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ItemAssignment;
