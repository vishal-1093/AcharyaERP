import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../../components/CustomModal";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddTaskIcon from "@mui/icons-material/AddTask";
import axios from "../../../services/Api";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import useAlert from "../../../hooks/useAlert";
import VendorDetails from "../../../pages/forms/inventoryMaster/VendorDetails";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const styles = makeStyles(() => ({
  tableContainer: {
    borderRadius: 25,
    margin: "10px 10px",
    maxWidth: 400,
  },
}));

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function VendorIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const classes = styles();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [values, setValues] = useState({});
  const [vendorId, setVendorId] = useState(null);
  const [valueUpdate, setValueUpdate] = useState({});
  const [obIds, setObIds] = useState({});
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState();

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/vendor?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((error) => console.error(error));
  };
  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getData();
    getSchool();
  }, []);

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/inventory/vendor/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/inventory/activateVendor/${id}`)
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
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleChange = (e) => {
    const temp = { ...values, [e.target.name]: e.target.value };
    setValues(temp);
  };

  const handleSubmit = async () => {
    const entered = Object.keys(values);
    const existing = Object.keys(valueUpdate);
    const newData = entered.filter((e) => existing.includes(e) === false);
    const exData = entered.filter((e) => existing.includes(e) === true);
    const newObId = Object.values(obIds).toString();

    const putFormat = exData.map((val) => ({
      school_id: val,
      vendor_id: vendorId,
      active: true,
      ob_id: obIds[val],
      opening_balance: values[val],
    }));

    const post = {};

    newData.map((v) => {
      post[v] = values[v];
    });

    const postFormat = {};
    postFormat["active"] = true;
    postFormat["school_id"] = post;
    postFormat["vendor_id"] = vendorId;

    if (Object.keys(post).length > 0) {
      await axios
        .post(`/api/inventory/vendorOpeningBalance`, postFormat)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Updated Opening Balance",
          });
          setWrapperOpen(false);
          navigate("/InventoryMaster/Vendor", { replace: true });
          setAlertOpen(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });

          console.error(err);
        });
    }

    if (putFormat.length > 0) {
      await axios
        .put(`/api/inventory/UpdateVendorOpeningBalance1/${newObId}`, putFormat)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Updated Opening Balance",
          });
          setWrapperOpen(false);
          navigate("/InventoryMaster/Vendor", { replace: true });
          setAlertOpen(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleOpeningBalance = async (params) => {
    setWrapperOpen(true);
    setVendorId(params.row.id);
    await axios
      .get(`/api/inventory/getVendorOpeningBalance/${params.row.id}`)
      .then((res) => {
        const ob = {};
        const id = {};
        res.data.data.map((val) => {
          ob[val.school_id] = val.opening_balance;
          id[val.school_id] = val.ob_id;
        });
        setValues(ob);
        setValueUpdate(ob);
        setObIds(id);
      })
      .catch((err) => console.error(err));
  };

  const handleDetails = async (params) => {
    await axios
      .get(`/api/inventory/vendorById/${params.row.id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
    setDetailsOpen(true);
  };

  const handleApprove = async (params) => {
    await axios
      .get(`/api/inventory/vendorById/${params.row.id}`)
      .then((res) => {
        const newObj = {
          ...res.data.data,
          ...{
            account_verification_status: true,
            account_verifier_date: new Date(),
            verifier_user_id: userID,
          },
        };
        setUpdateData(newObj);
      })
      .catch((err) => console.error(err));

    const handleToggle = async () => {
      await axios
        .put(`/api/inventory/vendor/${params.row.id}`, updateData)
        .then((res) => {
          if (res.data.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Verified Successfully",
            });
            setAlertOpen(true);
            setModalOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    };

    setModalContent({
      title: "",
      message: "Are you sure you want to approve this account number ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });

    setModalOpen(true);
  };

  const columns = [
    {
      field: "vendor_name",
      headerName: "Vendor",
      width: 220,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDetails(params)}
            >
              {params.row.vendor_name}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "vendor_email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "vendor_contact_no",
      headerName: "Contact Number",
      flex: 1,
      hide: true,
    },
    {
      field: "vendor_gst_no",
      headerName: "GST Number",
      flex: 1,
      hide: true,
    },
    { field: "account_no", headerName: "Account No", flex: 1 },
    {
      field: "vendor_bank_ifsc_code",
      headerName: "IFSC",
      flex: 1,
    },
    { field: "pan_number", headerName: "Pan No", flex: 1 },
    { field: "vendor_type", headerName: "Vendor Type", flex: 1 },
    {
      field: "verifiedtatus",
      headerName: "Verification Status",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.created_by === userID &&
        params.row.account_verification_status === null ? (
          <>
            <Typography variant="subtitle2">Pending</Typography>
          </>
        ) : params.row.account_verification_status === null ? (
          <IconButton onClick={() => handleApprove(params)}>
            <AddTaskIcon fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <Typography variant="subtitle2">Approved</Typography>
        ),
      ],
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    {
      field: "vendor_id",
      headerName: "Attachment",
      flex: 1,
      type: "actions",
      renderCell: (params) => {
        return (
          <IconButton
            color="primary"
            onClick={() => navigate(`/VendorIndex/View/${params.row.id}`)}
          >
            <RemoveRedEyeIcon fontSize="small" />
          </IconButton>
        );
      },
    },
    {
      field: "modified_username",
      headerName: "OB",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() => {
            handleOpeningBalance(params);
          }}
          color="primary"
        >
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "created_by",
      headerName: "Update",
      flex: 1,
      type: "actions",
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(`/InventoryMaster/Vendor/Update/${params.row.id}`)
            }
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        );
      },
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff fontSize="small" />
          </IconButton>
        ),
      ],
    },
  ];
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <ModalWrapper open={wrapperOpen} maxWidth={550} setOpen={setWrapperOpen}>
        <>
          <Box component="form" p={1}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              rowSpacing={2}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <TableContainer
                component={Paper}
                className={classes.tableContainer}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>School</StyledTableCell>
                      <StyledTableCell align="right">
                        Opening Balance
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schoolOptions.map((val, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row">
                          {val.label}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <CustomTextField
                            label=""
                            value={values[val.value] ? values[val.value] : ""}
                            style={{ width: 100 }}
                            name={val.value.toString()}
                            handleChange={handleChange}
                            inputProps={{
                              style: {
                                height: "10px",
                              },
                            }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-start"
                textAlign="right"
              >
                <Grid item xs={12} md={6}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      </ModalWrapper>
      <ModalWrapper open={detailsOpen} maxWidth={1000} setOpen={setDetailsOpen}>
        <VendorDetails data={data} />
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Button
          onClick={() => navigate("/InventoryMaster/Vendor/New")}
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
export default VendorIndex;
