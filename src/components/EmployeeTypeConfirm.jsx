import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Toolbar,
  Paper,
} from "@mui/material";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import FormWrapper from "../components/FormWrapper";
import CustomSelect from "../components/Inputs/CustomSelect";
import CustomDatePicker from "../components/Inputs/CustomDatePicker";
import CustomFileInput from "../components/Inputs/CustomFileInput";
import CustomTextField from "../components/Inputs/CustomTextField";
import axios from "../services/Api";

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
    { value: "permanent", label: "Permanent"}
  ];

export const EmployeeTypeConfirm = ({empNameCode,handleConfirmModal ,probationEndDate}) => {

    const [endDate, setEndDate] = useState(probationEndDate);
    const [loading, setLoading] = useState(false);

    const handleChange = (newValue) => {
        // console.log('handlechNge====',newValue);
    }

  return (
    <>
      <ModalSection>
        <ModalContainer>
          <Grid
              container
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid item sx={{ display: "flex", gap: "30px" }}>
                <Title>
                  {empNameCode !== "" ? empNameCode : "No Name"}
                </Title>
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
                  <CustomDatePicker
                    name="endDate"
                    label="Probationary End Date"
                    readOnly
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomSelect
                    name="phdHolderPursuing"
                    label="Employee Type"
                    items={employeeTypeList}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
            <CustomFileInput
              name="researchAttachment"
              label="Pdf File Attachment"
              helperText="PDF - smaller than 2 MB"
            />
          </Grid>
          <Grid item xs={12} md={6}>
                <CustomTextField
                  multiline
                  rows={5}
                  name="yesNumberOfProjects"
                  label="Remarks"
                />
              </Grid>
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
