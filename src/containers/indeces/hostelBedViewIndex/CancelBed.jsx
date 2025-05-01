import React, { lazy, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  styled,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import DOCView from "../../../components/DOCView";
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));

const initialValues = {
  remarks: "",
  studentRemarks: "",
  studentCancelBedTypeAttachment: "",
};
const requiredFields = ["studentCancelBedTypeAttachment"];
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CancelBed = ({ rowDetails, getData }) => {
  console.log(rowDetails, "rowDetails");
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    studentCancelBedTypeAttachment: [
      values.studentCancelBedTypeAttachment !== "",
      values.studentCancelBedTypeAttachment &&
        values.studentCancelBedTypeAttachment.name.endsWith(".pdf"),
      values.studentCancelBedTypeAttachment &&
        values.studentCancelBedTypeAttachment.size < 2000000,
    ],
  };

  const errorMessages = {
    studentCancelBedTypeAttachment: [
      "This field required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    studentRemarks: [
      "This field is required",
      "Must not be longer than 100 characters",
    ],
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

  useEffect(() => {
    if (rowDetails?.cancelledRemarks) {
      setValues({
        remarks: rowDetails.cancelledRemarks,
        studentRemarks: rowDetails?.studentCancelledRemarks,
      });
    }
  }, [rowDetails]);
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUploadAttachment = async () => {
    const studentCancelBedTypeAttachment = new FormData();
    studentCancelBedTypeAttachment.append(
      "file",
      values.studentCancelBedTypeAttachment
    );
    studentCancelBedTypeAttachment.append(
      "hostelBedAssignmentId",
      rowDetails?.id
    );
    return await axios
      .post(
        `/api/hostel/cancelHostelBedAssignmentUploadFile`,
        studentCancelBedTypeAttachment
      )
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Employee Type Attachment Uploaded Successfully",
          });
          getData();
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
  const handleCreate = async () => {
    const temp = {};
    temp.cancelledRemarks = values?.remarks;
    temp.studentCancelledRemarks = values?.studentRemarks;
    temp.hostelBlockId = rowDetails?.hostelBlockId;
    temp.hostelFloorId = rowDetails?.hostelFloorId;
    temp.hostelRoomId = rowDetails?.hostelRoomId;
    temp.acYearId = rowDetails?.acYearId;
    temp.hostelBedId = rowDetails?.hostelBedId;
    temp.studentId = rowDetails?.studentId;
    temp.hostelFeeTemplateId = rowDetails?.hostelFeeTemplateId;
    temp.fromDate = rowDetails?.fromDate;
    temp.expectedJoiningDate = rowDetails?.expectedJoiningDate;
    temp.bedStatus = rowDetails?.bedStatus;
    temp.active = true;
    temp.toDate = rowDetails?.toDate;
     temp.foodStatus = rowDetails?.foodStatus;
    temp.vacateBy = 1;

    await axios
      .put(`/api/hostel/updateHostelBedAssignment/${rowDetails?.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          handleUploadAttachment();
          setAlertMessage({
            severity: "success",
            message: "Bed Cancelled",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        getData();
      })
      .catch((err) => console.error(err));
  };

  const handleFileDrop = (name, newFile) => {
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

  return (
    <>
      <StudentDetails id={rowDetails?.auid} />
      <Grid container rowSpacing={2} columnSpacing={6} mt={1}>
        <Grid item xs={12} md={6}>
          <CustomTextField
            name="studentRemarks"
            label="Student Cancelled Remarks"
            value={values.studentRemarks}
            handleChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            name="remarks"
            label="Warden Remarks"
            value={values.remarks}
            handleChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        {!rowDetails?.hostelCancelledAttachmentPath && (
          <>
            <Grid item xs={12} md={12} align="center">
              <CustomFileInput
                name="studentCancelBedTypeAttachment"
                label="Pdf File Attachment"
                helperText="PDF - smaller than 2 MB"
                file={values.studentCancelBedTypeAttachment}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.studentCancelBedTypeAttachment}
                errors={errorMessages.studentCancelBedTypeAttachment}
                required
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                sx={{ borderRadius: 2 }}
                variant="contained"
                onClick={handleCreate}
                disabled={!values.studentCancelBedTypeAttachment}
              >
                {isLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
      {rowDetails?.hostelCancelledAttachmentPath && (
        <>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              titleTypographyProps={{
                variant: "subtitle2",
              }}
              sx={{
                backgroundColor: "tableBg.main",
                color: "tableBg.textColor",
                textAlign: "center",
                padding: 1,
                marginTop: 2,
              }}
            >
              Attachment
            </Typography>
          </Grid>
          <DOCView attachmentPath={`/api/hostel/fileDownload?pathName=${rowDetails?.hostelCancelledAttachmentPath}`} />
        </>
      )}
    </>
  );
};

export default CancelBed;
