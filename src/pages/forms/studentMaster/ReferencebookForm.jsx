import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programId: null,
  programSpeId: null,
  yearsemId: null,
  titleOfBook: "",
  author: "",
  edition: "",
  yearOfPublishers: "",
  publisherDetails: "",
  booksAvailable: "",
  referenceCode: "",
};

const requiredFields = [
  "acYearId",
  "schoolId",
  "programId",
  "programSpeId",
  "yearsemId",
  "titleOfBook",
  "author",
  "edition",
  "yearOfPublishers",
  "publisherDetails",
  "booksAvailable",
];

function ReferencebookForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [bookId, setBookId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getSchoolData();
    getProgramSpecializationData();
    if (pathname.toLowerCase() === "/studentmaster/referencebookform") {
      setIsNew(true);
      setCrumbs([
        {
          name: "Reference Book Index",
          link: "/StudentMaster/ReferencebookIndex",
        },
        { name: "Reference Book" },
        {
          name: "Create",
        },
      ]);
    } else {
      setIsNew(false);
      getReferenceBookData();
    }
  }, [pathname]);

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpecializationData = async () => {
    await axios
      .get(`/api/academic/ProgramSpecilization`)
      .then((res) => {
        setProgramSpeOptions(
          res.data.data.map((obj) => ({
            value: obj.program_specialization_id,
            label: obj.program_specialization_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getReferenceBookData = async () => {
    await axios(`/api/academic/ReferenceBooks/${id}`)
      .then((res) => {
        setValues({
          schoolId: res.data.data.school_id,
          programId: res.data.data.program_id,
          programSpeId: res.data.data.program_specialization_id,
          yearsemId: res.data.data.year,
          titleOfBook: res.data.data.title_of_book,
          author: res.data.data.author,
          edition: res.data.data.edition,
          yearOfPublishers: res.data.data.yr_of_Publish,
          publisherDetails: res.data.data.publisher_details,
          booksAvailable: res.data.data.available_books,
        });
        setBookId(res.data.data.book_id);
        setCrumbs([
          {
            name: "Reference Book Index",
            link: "/StudentMaster/ReferencebookIndex",
          },
          { name: "Reference Book" },
          {
            name: "Update",
          },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const checks = {
    titleOfBook: [values.titleOfBook !== ""],
    author: [values.author !== ""],
    edition: [values.edition !== ""],
    yearOfPublishers: [values.yearOfPublishers !== ""],
    publisherDetails: [values.publisherDetails !== ""],
    booksAvailable: [values.booksAvailable !== ""],
  };

  const errorMessages = {
    titleOfBook: ["This field is required"],
    author: ["This field is required"],
    edition: ["This field is required"],
    yearOfPublishers: ["This field is required"],
    publisherDetails: ["This field is required"],
    booksAvailable: ["This field is required"],
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_specialization_id = values.programSpeId;
      temp.year = values.yearsemId;
      temp.title_of_book = values.titleOfBook;
      temp.author = values.author;
      temp.edition = values.edition;
      temp.yr_of_Publish = values.yearOfPublishers;
      temp.publisher_details = values.publisherDetails;
      temp.available_books = values.booksAvailable;

      await axios
        .post(`/api/academic/ReferenceBooks`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/StudentMaster/ReferencebookIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Reference Book created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.book_id = bookId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_specialization_id = values.programSpeId;
      temp.year = values.yearsemId;
      temp.title_of_book = values.titleOfBook;
      temp.author = values.author;
      temp.edition = values.edition;
      temp.yr_of_Publish = values.yearOfPublishers;
      temp.publisher_details = values.publisherDetails;
      temp.available_books = values.booksAvailable;
      await axios
        .put(`/api/academic/ReferenceBooks/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/StudentMaster/ReferencebookIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Reference Book Updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
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
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
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

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="titleOfBook"
              label="Title of Book(character less than 50)"
              value={values.titleOfBook}
              handleChange={handleChange}
              checks={checks.titleOfBook}
              errors={errorMessages.titleOfBook}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="yearOfPublishers"
              label="Year of Publish(yyyy)"
              value={values.yearOfPublishers}
              handleChange={handleChange}
              checks={checks.yearOfPublishers}
              errors={errorMessages.yearOfPublishers}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="publisherDetails"
              label="Publisher Details"
              value={values.publisherDetails}
              handleChange={handleChange}
              checks={checks.publisherDetails}
              errors={errorMessages.publisherDetails}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="booksAvailable"
              label="Count of books available in library"
              value={values.booksAvailable}
              handleChange={handleChange}
              checks={checks.booksAvailable}
              errors={errorMessages.booksAvailable}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="referenceCode"
              label="ISBN Code"
              value={values.referenceCode}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item textAlign="right">
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

export default ReferencebookForm;
