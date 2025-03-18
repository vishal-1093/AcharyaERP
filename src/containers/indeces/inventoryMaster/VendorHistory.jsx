import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import VendorDetails from "../../../pages/forms/inventoryMaster/VendorDetails";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function VendorHistory() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [data, setData] = useState([]);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([
      { name: "Inventory Master", link: "/InventoryMaster/Vendor" },
      { name: "History" },
    ]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/fetchVendorHistoryDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((error) => console.error(error));
  };

  const handleDetails = async (params) => {
    setDetailsOpen(true);
    await axios
      .get(`/api/inventory/vendorById/${params.row.id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
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
    },
    {
      field: "vendor_gst_no",
      headerName: "GST Number",
      flex: 1,
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
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    // {
    //   field: "vendor_id",
    //   headerName: "Attachment",
    //   flex: 1,
    //   type: "actions",
    //   renderCell: (params) => {
    //     return (
    //       <IconButton
    //         color="primary"
    //         onClick={() => navigate(`/VendorIndex/View/${params.row.id}`)}
    //       >
    //         <RemoveRedEyeIcon fontSize="small" />
    //       </IconButton>
    //     );
    //   },
    // },
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

        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default VendorHistory;
