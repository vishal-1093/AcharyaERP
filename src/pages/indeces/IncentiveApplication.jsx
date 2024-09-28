import { useState, useEffect, lazy } from "react";
import {
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  Grid,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import { Button, Box } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import acharyaLogo from "../../assets/acharyaLogo.png";
import userImage from "../../assets/maleplaceholderimage.jpeg";
import Paper from "@mui/material/Paper";
import PrintIcon from "@mui/icons-material/Print";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  modalOpen: false,
  modalContent: modalContents,
};

const IncentiveApplication = () => {
  const [{ modalOpen, modalContent }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Add On Report", link: "/AddonReport" }]);
  }, []);

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const setModalContent = (title, message, buttons) => {
    setState((prevState) => ({
      ...prevState,
      modalContent: {
        ...prevState.modalContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const handleSubmit = () => {
    setModalOpen(true);
    const handleToggle = async () => {
      console.log("submit");
    };
    setModalContent("", "Do you want to submit incentive application?", [
      { name: "No", color: "primary", func: () => {} },
      { name: "Yes", color: "primary", func: handleToggle },
    ]);
  };

  return (
    <>
      {!!modalOpen && (
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
      )}

      {/* <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: 30,
          marginTop: { xs: -2, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<PrintIcon />}
            >
              Print
            </Button>
          </Grid>
        </Grid>
      </Box> */}

      <Box>
        <Grid container>
          <Grid xs={12}>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                component={Paper}
                xs={8}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "0.3px solid lightgray",
                  backgroundColor: "rgba(74, 87, 169, 0.1)",
                  height: "70px",
                }}
              >
                <div>
                  <img src={acharyaLogo} style={{ width: "80px" }} />
                </div>
                <div>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    JMJ EDUCATION SOCIETY
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    ACHARYA INSTITUTE OF TECHNOLOGY
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    APPLICATION FOR INCENTIVE - BOOK CHAPTER
                  </Typography>
                </div>
                <div style={{ height: "66px" }}>
                  <img
                    src={userImage}
                    style={{ width: "80px", height: "66px" }}
                  />
                </div>
              </Grid>
              <Grid xs={8} component={Paper}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Faculty Name</b> : &nbsp; &nbsp; Test name
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Employee Code</b> : &nbsp; &nbsp; AI00843
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Designation</b> : &nbsp; &nbsp; Assistant Professor
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Exp at Acharya</b> : &nbsp; &nbsp; 0Y 0M 0D
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Department</b> : &nbsp; &nbsp; AIML
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Date Of Joining</b> : &nbsp; &nbsp; 26-09-2024
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Phone</b> : &nbsp; &nbsp; 988765444
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Email</b> : &nbsp; &nbsp; Test@acharya.ac.in
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid
                mt={4}
                xs={10}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disableElevation
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default IncentiveApplication;
