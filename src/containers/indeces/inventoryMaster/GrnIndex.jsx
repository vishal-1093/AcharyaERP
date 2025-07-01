import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const empID = JSON.parse(sessionStorage.getItem("userData"))?.emp_id;

function GrnIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const navigate = useNavigate();

  const columns = [
    { field: "grnNumber", headerName: "GRN No", flex: 1 },
    { field: "poReferenceNo", headerName: "Po No", flex: 1 },
    {
      field: "createdDate",
      headerName: "GRN Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    {
      field: "poTotalAmount",
      headerName: "Grn Amount",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const value = Number(params.value);
        return Math.round(value) ?? ""
      },
    },
    {
      field: "vendorName",
      headerName: "Vendor",
      flex: 1,
    },
    {
      field: "createdByUserName",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "invoiceNo",
      headerName: "Invoice No",
      flex: 1,
      hide: true,
    },
    {
      field: "invoiceDate",
      headerName: "Invoice Date",
      flex: 1,
      hide: true,
      valueGetter: (value, row) =>
        moment(row.invoiceDate).format("DD-MM-YYYY"),
    },
    {
      field: "print",
      headerName: "Actions",
      flex: 1,
      hideable: false,
      renderCell: (params) => [
        <IconButton onClick={() => handleClick(params.row)} color="primary">
          <PrintIcon fontSize="small" />
        </IconButton>,
      ],
    },
    // {
    //   field: "attachment",
    //   headerName: "Attachment",
    //   flex: 1,
    //   hideable: false,
    //   renderCell: (params) => (
    //     <>
    //       {" "}
    //       <IconButton
    //         color="primary"
    //         onClick={() => handleViewAttachment(params.row.attachment)}
    //       >
    //         <RemoveRedEyeIcon />
    //       </IconButton>
    //     </>
    //   ),
    // },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{}]);
  }, [pathname]);

  const getData = async () => {
    const payload = {
      pageNo: 0,
      pageSize: 10000,
      sort: "createdDate",
      empId: pathname === "/grnIndex-user" && empID ? empID : null
    };
    await axios
      .post(`/api/purchase/getListofDirectGRN`, payload)
      .then((res) => {
        const rowId = res.data.data.content.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId);
      })
      .catch((err) => console.error(err));
  };

  const handleClick = (rowdata) => {
    navigate(`/GRNPdf/${rowdata.grnNumber.replace(/\//g, "_")}`);
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2, pt: 7 }}>
        {pathname === "/grnIndex-user" && <Button
          onClick={() => navigate("/create-grn", { state: { fromPath: pathname } })}
          variant="contained"
          disableElevation
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            borderRadius: 2,
          }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>}

        <GridIndex rows={rows} columns={columns} />
      </Box>


    </>
  );
}

export default GrnIndex;
