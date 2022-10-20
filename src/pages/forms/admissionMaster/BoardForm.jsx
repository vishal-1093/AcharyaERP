import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  boardName: "",
  boardShortName: "",
};

const requiredFields = ["boardName", "boardShortName"];
function BoardForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [isNew, setIsNew] = useState(true);
  const [boardId, setBoardId] = useState(null);
  const [values, setValues] = useState(initialValues);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const checks = {
    boardName: [values.boardName !== "", /^[A-Za-z ]+$/.test(values.boardName)],
    boardShortName: [
      values.boardShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.boardShortName),
    ],
  };
  const errorMessages = {
    boardName: ["This field required", "Enter Only Characters"],
    boardShortName: [
      "This field is required",
      "Enter only characters and its length should be three",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/admissionmaster/board/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AdmissionMaster", link: "/AdmissionMaster" },
        { name: "Board" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getBoardData();
    }
  }, [pathname]);
  const getBoardData = async () => {
    await axios.get(`${ApiUrl}/student/Board/${id}`).then((res) => {
      setValues({
        boardName: res.data.data.board_unique_name,
        boardShortName: res.data.data.board_unique_short_name,
      });
      setBoardId(res.data.data.board_unique_id);
      setCrumbs([
        { name: "AdmissionMaster", link: "/AdmissionMaster" },
        { name: "Board" },
        { name: "Update" },
        { name: res.data.data.board_unique_name },
      ]);
    });
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
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.board_unique_name = values.boardName;
      temp.board_unique_short_name = values.boardShortName.toUpperCase();
      await axios
        .post(`${ApiUrl}/student/Board`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Board Created",
            });
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
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.board_unique_id = boardId;
      temp.board_unique_name = values.boardName;
      temp.board_unique_short_name = values.boardShortName.toUpperCase();
      await axios
        .put(`${ApiUrl}/student/Board/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Board Updated",
            });
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

  return (
    <>
      <Box component="form">
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="boardName"
                  label="Board "
                  value={values.boardName}
                  handleChange={handleChange}
                  fullWidth
                  errors={errorMessages.boardName}
                  checks={checks.boardName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="boardShortName"
                  label=" Short Name"
                  value={values.boardShortName}
                  handleChange={handleChange}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  errors={errorMessages.boardShortName}
                  checks={checks.boardShortName}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                >
                  <Grid item xs={2}>
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
              </Grid>
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default BoardForm;
