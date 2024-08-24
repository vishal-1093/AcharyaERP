import { useState, lazy, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);

const initialState = {
  bonafideTypeId: "",
  auid: "",
  bonafideTypeList: [],
  loading: false,
};

const BonafideForm = () => {
  const [{ bonafideTypeId, auid, bonafideTypeList, loading }, setState] =
    useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "ACERP Bonafide", link: "/AcerpBonafideIndex" },
      { name: "Create" },
    ]);
    getBonafideTypeList();
  }, []);

  const getBonafideTypeList = async () => {
    try {
      const res = await axios.get("api/categoryTypeDetailsOnBonafide");
      const lists = res?.data?.data.map((obj) => ({
        label: obj.category_detail,
        value: obj.category_details_id,
      }));
      setState((prevState) => ({
        ...prevState,
        bonafideTypeList: lists,
      }));
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const createStudentBonafide = async () => {
    try {
      setLoading(true);
      const bonafideType = bonafideTypeList.find(
        (ele) => ele.value === bonafideTypeId
      ).label;
      const payload = {
        active: true,
        auid: auid,
        bonafide_type: bonafideType,
        hostel_fee_template_id: null,
        from_sem: null,
        to_sem: null,
      };
      const res = await axios.post("/api/student/studentBonafide", payload);
      if (res.status == 200 || res.status == 201) {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: `Student bonafide created successfully`,
        });
        const bonafideType = bonafideTypeList.find(
          (ele) => ele.value === bonafideTypeId
        ).label;
        navigate(`/AcerpBonafideView`, {
          state: {
            studentAuid: auid,
            bonafideType: bonafideType,
            page: "Create",
          },
        });
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, md: 4 }}
          alignItems="center"
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="bonafideTypeId"
              label="Bonafide Type"
              value={bonafideTypeId || ""}
              options={bonafideTypeList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3} mr={4}>
            <CustomTextField
              name="auid"
              label="Auid"
              value={auid}
              handleChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !auid || !bonafideTypeId}
              onClick={createStudentBonafide}
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
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default BonafideForm;
