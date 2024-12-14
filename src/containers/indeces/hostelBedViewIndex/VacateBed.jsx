import React, { lazy, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));

const initialValues = { comments: "", vacateDate: "" };

const VacateBed = ({ rowDetails, getData }) => {
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    if (rowDetails?.commentsVacate && rowDetails?.toDate) {
      setValues({ comments: rowDetails?.commentsVacate, vacateDate: rowDetails?.toDate });
    }
  }, [rowDetails]);
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    const temp = {};
    temp.commentsVacate = values?.comments;
    temp.hostelBlockId = rowDetails?.hostelBlockId;
    temp.hostelFloorId = rowDetails?.hostelFloorId;
    temp.hostelRoomId = rowDetails?.hostelRoomId;
    temp.acYearId = rowDetails?.acYearId;
    temp.hostelBedId = rowDetails?.hostelBedId;
    temp.studentId = rowDetails?.studentId;
    temp.hostelFeeTemplateId = rowDetails?.hostelFeeTemplateId;
    temp.fromDate = rowDetails?.fromDate;
    temp.toDate = moment(values.vacateDate).format("YYYY-MM-DD");
    temp.foodStatus = values?.foodType;
    temp.vacateBy = 1;
    temp.expectedJoiningDate = rowDetails?.expectedJoiningDate;
    temp.bedStatus = "Free";
    temp.active = true;
    await axios
      .put(`/api/hostel/updateHostelBedAssignment/${rowDetails?.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Vacate Status updated",
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
  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  return (
    <>
      <StudentDetails id={rowDetails?.auid} />
      <Grid container rowSpacing={2} columnSpacing={6} mt={1}>
        <Grid item xs={12} md={4}>
          <CustomTextField
            name="comments"
            label="Comments"
            value={values.comments}
            handleChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} md={4} mt={2}>
          <CustomDatePicker
            name="vacateDate"
            label="Vacate Date"
            value={values.vacateDate}
            // minDate={new Date()}
            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 10))}
            handleChangeAdvance={handleChangeAdvance}
            required
          />

        </Grid>
        <Grid item xs={12} align="right">
          <Button
            sx={{ borderRadius: 2 }}
            variant="contained"
            onClick={handleCreate}
            disabled={!values?.comments || !values?.vacateDate}
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
      </Grid>
    </>
  );
};

export default VacateBed;
