import { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import FeeTemplateView from "./FeeTemplateView";
import axios from "../../../services/Api";

function PreScholarshipApprover() {
  const [values, setValues] = useState();
  const [scholarshipValues, setScholarshipValues] = useState();
  const [feeTemplateData, setFeeTemplateData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/1`)
      .then((res) => {
        const templateData = res.data.data[0];
        // for getting no of years / sem
        axios
          .get(
            `/api/academic/FetchAcademicProgram/${templateData.ac_year_id}/${templateData.program_id}/${templateData.school_id}`
          )
          .then((res) => {
            const yearSem = [];

            for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
              if (templateData.program_type_name.toLowerCase() === "yearly") {
                yearSem.push({ key: i.toString(), value: "Year " + i });
                setScholarshipValues((prev) => ({
                  ...prev,
                  ["year" + i]: 0,
                }));
              } else {
                yearSem.push({ key: i.toString(), value: "Sem " + i });
                setScholarshipValues((prev) => ({
                  ...prev,
                  ["sem" + i]: 0,
                }));
              }
            }
            setNoOfYears(yearSem);
          })
          .catch((err) => console.error(err));
        // end
        setFeeTemplateData(templateData);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = () => {
    console.log(values);
    console.log(scholarshipValues);
  };
  return (
    <>
      <Box>
        <Grid container>
          {Object.keys(feeTemplateData).length > 0 ? (
            <Grid item xs={12}>
              <FeeTemplateView
                feeTemplateId={1}
                values={values}
                scholarshipValues={scholarshipValues}
                noOfYears={noOfYears}
                feeTemplateData={feeTemplateData}
                handleChange={handleChange}
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12}>
            <Button onClick={handleCreate}>Check</Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PreScholarshipApprover;
