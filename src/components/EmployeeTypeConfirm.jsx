import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress
} from "@mui/material";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import FormWrapper from "../components/FormWrapper";
import CustomSelect from "../components/Inputs/CustomSelect";
import CustomFileInput from "../components/Inputs/CustomFileInput";
import CustomTextField from "../components/Inputs/CustomTextField";
import axios from "../services/Api";
import useAlert from "../hooks/useAlert";

const ModalSection = styled.div`
  visibility: 1;
  opacity: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  transition: opacity 1s;
  z-index: 999;
`;

const ModalContainer = styled.div`
  max-width: 66%;
  min-height: 60%;
  max-height: 90%;
  margin: 100px auto;
  border-radius: 5px;
  width: 100%;
  position: relative;
  transition: all 2s ease-in-out;
  padding: 30px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media screen and (max-width: 1024px) {
    min-width: 85%;
  }
`;

const CloseButton = styled(CloseIcon)`
  position: relative;
  color: #132353;
  cursor: pointer;
`;

const Title = styled.h2`
  position: relative;
`;

const employeeTypeList = [
  { value: "probationary", label: "Probationary" },
  { value: "permanent", label: "Permanent" },
];

const requiredFields = [
  "employeeTypeId",
  "employeeTypeAttachment",
  "employeeTypeRemarks",
];

const initialState = {
  employeeTypeId: "probationary",
  employeeTypeAttachment: "",
  employeeTypeRemarks: "",
};

export const EmployeeTypeConfirm = ({
  empNameCode,
  handleConfirmModal,
  probationEndDate,
  empId
}) => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    employeeTypeId: [state.employeeTypeId !== null],
    employeeTypeAttachment: [
      state.employeeTypeAttachment !== "",
      state.employeeTypeAttachment &&
        state.employeeTypeAttachment.name.endsWith(".pdf"),
      state.employeeTypeAttachment &&
        state.employeeTypeAttachment.size < 2000000,
    ],
    employeeTypeRemarks: [
      state.employeeTypeRemarks !== "",
      state.employeeTypeRemarks.replace(/\s/g, "").length <101,
    ],
  };

  const errorMessages = {
    employeeTypeId: ["This field required"],
    employeeTypeAttachment: [
      "This field required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    employeeTypeRemarks: [
      "This field is required",
      "Must not be longer than 100 characters",
    ],
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!state[field]) return false;
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
      let payload = {
        "permanentRemarks": state.employeeTypeRemarks
      }
      await axios
        .post(`/api/employee/makeEmployeePermanent/${empId}`,payload)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            handleConfirmModal();
            handleUploadAttachment();
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
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

  const handleUploadAttachment = async () => {
    const employeeTypeAttachment = new FormData();
    employeeTypeAttachment.append("file", state.employeeTypeAttachment);
    return await axios
      .post(`/api/employee/employeePermanentFileUpload`, employeeTypeAttachment)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Employee Type Attachment Uploaded Successfully",
          });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message:
            "Some thing went wrong !! unable to  uploaded the research Attachment",
        });
        setAlertOpen(true);
      });
  };

  return (
    <>
      <ModalSection>
        <ModalContainer>
          <Grid
            container
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item sx={{ display: "flex", gap: "30px" }}>
              <Title>{empNameCode !== "" ? empNameCode : "No Name"}</Title>
            </Grid>
            <Grid item sx={{ display: "flex", gap: "30px" }}>
              <CloseButton fontSize="large" onClick={handleConfirmModal} />
            </Grid>
          </Grid>

          <Box component="form" overflow="auto" p={1}>
            <FormWrapper>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-start"
                rowSpacing={4}
                columnSpacing={{ xs: 2, md: 4 }}
              >
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    name="probationEndDate"
                    label="Probationary End Date"
                    value={probationEndDate}
                    readOnly
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomSelect
                    name="employeeTypeId"
                    label="Employee Type"
                    items={employeeTypeList}
                    value={state.employeeTypeId}
                    handleChange={handleChange}
                    checks={checks.employeeTypeId}
                    errors={errorMessages.employeeTypeId}
                    required
                  />
                </Grid>

                {state.employeeTypeId == "permanent" && (
                  <Grid item xs={12} md={6}>
                    <CustomFileInput
                      name="employeeTypeAttachment"
                      label="Pdf File Attachment"
                      helperText="PDF - smaller than 2 MB"
                      file={state.employeeTypeAttachment}
                      handleFileDrop={handleFileDrop}
                      handleFileRemove={handleFileRemove}
                      checks={checks.employeeTypeAttachment}
                      errors={errorMessages.employeeTypeAttachment}
                      required
                    />
                  </Grid>
                )}
                {state.employeeTypeId == "permanent" && (
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      multiline
                      rows={5}
                      name="employeeTypeRemarks"
                      label="Remarks"
                      value={state.employeeTypeRemarks}
                      handleChange={handleChange}
                      checks={checks.employeeTypeRemarks}
                      errors={errorMessages.employeeTypeRemarks}
                      required
                    />
                  </Grid>
                )}
              </Grid>
            </FormWrapper>
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </div>
        </ModalContainer>
      </ModalSection>
    </>
  );
};
