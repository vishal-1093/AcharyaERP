import { Button, Grid, Paper, Typography } from "@mui/material";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import { useEffect, useState } from "react";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import Axios from "axios";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function StudentUniformFee() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    mobile: "",
  });
  const [uniformData, setUniformData] = useState([]);
  const [totalPaying, setTotalPaying] = useState();

  const handleFocus = (e, index) => {
    setUniformData((prev) =>
      prev.map((obj, i) => {
        if (index === i)
          return {
            ...obj,
            ["focused"]: true,
          };

        return obj;
      })
    );
  };

  const handleBlur = (e, index) => {
    setUniformData((prev) =>
      prev.map((obj, i) => {
        if (index === i)
          return {
            ...obj,
            ["focused"]: false,
          };

        return obj;
      })
    );
  };

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    mobile: [data.mobile !== "", /^[0-9]{10}$/.test(data.mobile)],
  };
  const errorMessages = {
    mobile: ["This field is required", "Invalid Mobile Number"],
  };
  useEffect(() => {
    getUniformData();
  }, []);

  useEffect(() => {
    const totalPay = uniformData.reduce((total, sum) => {
      return Number(total) + Number(sum.mainCost);
    }, 0);

    setTotalPaying(totalPay);
  }, [uniformData]);

  const getUniformData = async () => {
    try {
      const studentData = await axios.get(
        `/api/student/studentDetailsByAuid/${username}`
      );

      if (studentData.data.data.length > 0) {
        const studentDueResponse = await axios.get(
          `/api/student/getStudentDetailsForTransaction?studentId=${studentData.data.data[0].student_id}`
        );
        setStudentData(studentDueResponse.data.data);
        setData((prev) => ({
          ...prev,
          ["mobile"]: studentDueResponse.data.data.mobile,
        }));

        setLoading(true);
        const response = await Axios.get(
          `https://www.maruthiassociates.in/index.php?r=acerp-api/fecth-items&auidformat=${studentDueResponse.data.data.auid.slice(
            5,
            9
          )}&school_id=${studentDueResponse.data.data.schoolId}`
        );

        const newArray = [];
        response.data.data.items.forEach((items) => {
          response.data.data.itemsCost.forEach((itemsCost) => {
            if (items.env_item_id === itemsCost.env_item_id) {
              newArray.push({
                focused: false,
                enterQuantity: "",
                mainCost: 0,
                env_item_id: items.env_item_id,
                item_description: items.item_description,
                item_name: items.item_name,
                active: itemsCost.active,
                cgst_input: itemsCost.cgst_input,
                cgst_input_per: itemsCost.cgst_input_per,
                cgst_output: itemsCost.cgst_output,
                cgst_output_per: itemsCost.cgst_output_per,
                cost: itemsCost.cost,
                created_by: itemsCost.created_by,
                created_date: itemsCost.created_date,
                effective_date: itemsCost.effective_date,
                env_item_id_cost: itemsCost.env_item_id,
                gst: itemsCost.gst,
                gst_amt: itemsCost.gst_amt,
                id: itemsCost.id,
                modified_by: itemsCost.modified_by,
                modified_date: itemsCost.modified_date,
                r: itemsCost.r,
                sgst_input: itemsCost.sgst_input,
                sgst_output: itemsCost.sgst_output,
                sgst_output_per: itemsCost.sgst_output_per,
                total_cost: itemsCost.total_cost,
              });
            }
          });
        });

        setUniformData(newArray);
      } else {
        setAlertMessage({ severity: "error", message: "NO DATA FOUND!!!" });
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeMobile = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChange = (e, index) => {
    setUniformData((prev) =>
      prev.map((obj, i) => {
        if (index === i)
          return {
            ...obj,
            [e.target.name]: e.target.value,
            ["mainCost"]: Number(e.target.value) * Number(obj.total_cost),
          };

        return obj;
      })
    );
  };

  const handleCreate = async () => {
    try {
      if (data.mobile === "") {
        setAlertMessage({
          severity: "error",
          message: "Please enter mobile number",
        });
        setAlertOpen(true);
      } else {
        const payload = {
          mobile: data.mobile,
          studentId: studentData.studentId,
          schoolId: studentData?.schoolId,
          currentYear: studentData.currentYear,
          currentSem: studentData.currentSem,
          total: totalPaying,
          acYearId: studentData.acYearId,
        };
        const allItems = [];

        uniformData.forEach((items) => {
          if (items.enterQuantity > 0)
            allItems.push({
              itemName: items.item_name,
              quantity: items.enterQuantity,
              amount: items.total_cost,
              cgst_output: items.cgst_output,
              cgst_input: items.cgst_input,
              sgst_input: items.sgst_input,
              sgst_output: items.sgst_output,
              gst: items.gst,
              type: items.item_name,
              envItemId: items.env_item_id,
            });
        });

        payload.uniformFeeDetails = allItems;

        const paymentResponse = await axios.post(
          `/api/student/uniformFee`,
          payload
        );

        if (paymentResponse.status === 200 || paymentResponse.status === 201) {
          navigate("/student-razor-pay-uniform", {
            state: {
              response: paymentResponse.data,
              student_data: studentData,
              mobile: data.mobile,
              schoolId: studentData?.schoolId,
              feeName: "Uniform",
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "80%" }}
      >
        <Grid item xs={12} md={2.8}>
          <Paper
            elevation={4}
            sx={{
              padding: "20px",
              background: "	#F0F0F0",
              borderRadius: "15px",
            }}
          >
            <Grid
              container
              justifyContent="center"
              rowSpacing={1.5}
              alignItems="center"
            >
              <Grid item xs={12} align="center">
                <img
                  src={acharyaLogo}
                  style={{ width: "25%", borderRadius: "8px" }}
                />
              </Grid>

              {loading ? (
                <>
                  <Grid item xs={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      {studentData?.studentName}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      {studentData?.auid} (
                      {` ${studentData?.currentYear} / ${studentData?.currentSem} `}
                      )
                    </Typography>
                  </Grid>

                  {uniformData?.map((obj, i) => {
                    return (
                      <>
                        <Grid item xs={12} key={i}>
                          <CustomTextField
                            onFocus={(e) => handleFocus(e, i)}
                            onBlur={(e) => handleBlur(e, i)}
                            name="enterQuantity"
                            label={
                              !obj.focused
                                ? `${obj.item_name}` +
                                  " - " +
                                  `${obj.item_description} ` +
                                  `( \u20B9  ${obj.total_cost})`
                                : "Enter Count"
                            }
                            handleChange={(e) => handleChange(e, i)}
                            value={obj.enterQuantity}
                          />
                        </Grid>
                      </>
                    );
                  })}

                  <Grid item xs={12}>
                    <CustomTextField
                      name="mobile"
                      value={data.mobile}
                      label="Mobile Number"
                      handleChange={handleChangeMobile}
                      checks={checks.mobile}
                      errors={errorMessages.mobile}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="payingNow"
                      label={"Total Pay"}
                      value={totalPaying}
                      inputProps={{
                        style: {
                          fontweight: "block",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      sx={{ width: "100%" }}
                      onClick={handleCreate}
                    >
                      Pay Now
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      For any queries please mail / contact us :
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      accounts@acharya.ac.in / 6364883311
                    </Typography>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} align="center">
                    <Typography variant="subtitle2" color="error">
                      NO DATA FOUND!!!
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12} align="center">
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      For any queries please mail / contact us :
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      accounts@acharya.ac.in / 6364883311
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentUniformFee;
