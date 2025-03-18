import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Grid, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

function ReferencebookIndex() {
  const [values, setValues] = useState([{ eresources: "" }]);
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [eresourcesOpen, setEresourcesOpen] = useState(false);
  const [referenceData, setReferenceData] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "concatenated_program_specialization",
      headerName: "Major",
      flex: 1,
    },
    { field: "title_of_book", headerName: "Title", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
    { field: "edition", headerName: "Edition", flex: 1 },
    { field: "yr_of_Publish", headerName: "Year of publish", flex: 1 },
    {
      field: "course_code",
      headerName: "Course Code",
      flex: 1,
    },
    { field: "publisher_details", headerName: "Publisher details", flex: 1 },
    { field: "available_books", headerName: "Count", flex: 1, hide: true },
    {
      field: "eresources",
      type: "actions",
      headerName: "Eresources",
      flex: 1,
      getActions: (params) => [
        <IconButton onClick={() => handleReferenceOpen(params)}>
          <AddIcon />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "created_by",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/StudentMaster/ReferencebookForm/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios(
      `/api/academic/ReferenceBooks?page=${0}&page_size=${10000}&sort=created_date`
    )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/ReferenceBooks/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateReferenceBooks/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
  };

  const handleReferenceOpen = (params) => {
    setEresourcesOpen(true);
    setReferenceData(params.row);
    const RowEresources = params?.row?.eresource?.split(",");
    const ObjectArray = RowEresources?.map((obj) => ({
      eresources: obj,
    }));

    if (params.row.eresource === null) {
      setValues([{ eresources: "" }]);
    } else {
      setValues(ObjectArray);
    }
  };

  const handleChange = (e, index) => {
    setValues((prev) =>
      prev.map((obj, i) => {
        if (Number(index) === i)
          return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const addRow = () => {
    setValues((prev) => [...prev, { eresources: "" }]);
  };

  const deleteRow = () => {
    const filteredRows = [...values];
    filteredRows.pop();
    setValues(filteredRows);
  };

  const handleCreate = async () => {
    try {
      const payload = {
        active: true,
        book_id: referenceData.id,
        school_id: referenceData.school_id,
        course_assignment_id: referenceData.course_assignment_id,
        program_id: referenceData.program_id,
        program_specialization_id: referenceData.program_specialization_id,
        year: referenceData.year,
        title_of_book: referenceData.title_of_book,
        author: referenceData.author,
        edition: referenceData.edition,
        yr_of_Publish: referenceData.yr_of_Publish,
        publisher_details: referenceData.publisher_details,
        available_books: referenceData.available_books,
        isbn_code: referenceData.isbn_code,
        eresource: values.map((obj) => obj.eresources).toString(),
      };
      const res = await axios.put(
        `/api/academic/ReferenceBooks/${referenceData.id}`,
        payload
      );

      if (res.status === 200 || res.status === 201) {
        setEresourcesOpen(false);
        setAlertMessage({ severity: "success", message: "Created" });
        setAlertOpen(true);
        getData();
      }
    } catch (error) {
      setEresourcesOpen(false);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        title="E-Resources"
        maxWidth={500}
        open={eresourcesOpen}
        setOpen={setEresourcesOpen}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
        >
          {values.map((obj, i) => {
            return (
              <>
                <Grid item xs={12}>
                  <CustomTextField
                    name="eresources"
                    label=""
                    value={obj.eresources}
                    handleChange={(e) => handleChange(e, i)}
                  />
                </Grid>
              </>
            );
          })}

          <Grid item xs={12} md={8}>
            <Button
              variant="contained"
              color="success"
              sx={{
                borderRadius: 2,
              }}
              onClick={addRow}
            >
              <AddIcon />
            </Button>

            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                marginLeft: 2,
              }}
              onClick={deleteRow}
              disabled={values.length === 1}
            >
              <RemoveIcon />
            </Button>
          </Grid>

          <Grid item xs={12} md={4} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={handleCreate}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 7 }}>
        <Button
          onClick={() => navigate("/StudentMaster/ReferencebookForm")}
          variant="contained"
          disableElevation
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

export default ReferencebookIndex;
