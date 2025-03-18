import {useEffect,useState,lazy} from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "../../../services/Api";
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useLocation } from "react-router-dom";
import OutwardCommunicationSubmission from "./owsubmission";
const OutwardDocuments = lazy(() => import("./OWDocuments"));
const InwardDocuments = lazy(() => import("./InwardDocument"));

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const DEFAULT_ERRORS = {
	reference: false,
	contractNo: false,
	category: false,
};

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

const GROUP_TYPE = "Staff";
const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "created_date";

const tabsData = [
	{ label: "Outward", value: "outward",component:OutwardDocuments},
	{ label: "Inward", value: "inward", component:InwardDocuments},
  ];

export default function DocumentsRepo() {
	const [value, setValue] = useState(0);
	const [loading, setLoading] = useState(false);
	const [dataLoading, setDataLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
	const [totalRows, setTotalRows] = useState(0);
	const [sort, setsort] = useState(DEFAULT_SORT);
	const [errors, setErrors] = useState(DEFAULT_ERRORS);
	const [groupType, setGroupType] = useState(GROUP_TYPE);
	const [reference, setReference] = useState("");
	const [contractNo, setContractNo] = useState("");
	const [attachment, setAttachment] = useState(null);
	const [attachmentName, setAttachmentName] = useState("No File Choosen");
	const [documents, setDocuments] = useState([]);
	const [tableRows, setTableRows] = useState([]);
	const [tableColumns, setTableColumns] = useState([]);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value || "outward";
    const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value || "outward"
    );
});

  const handleChange = (event, newValue) => {
    setTab(newValue);
    navigate(`/document-repo-user-${newValue}`);
  };

	useEffect(() => {
		getAlldata();
	}, [currentPage, sort, pageSize]);

	useEffect(() => {
		if (documents.length <= 0) return;

		updateTable();
	}, [documents]);

	const getAlldata = async () => {
		try {
			setDataLoading(true);
			const res = await axios.get(
				`/api/institute/fetchAllDocuments?page=${currentPage}&page_size=${pageSize}&sort=${sort}`
			);
			const data = res.data.data.Paginated_data;

			if (data.content.length <= 0) return;
			setTotalRows(data.totalElements);
			setDocuments(data.content);
			setDataLoading(false);
		} catch (error) {
			setDataLoading(false);
			console.log(error);
			// alert("Failed to fetch data");
		}
	};

	const updateTable = () => {
		if (documents.length <= 0) return;

		const rowsToShow = [];
		for (const obj of documents) {
			const {
				contract_number,
				document_attachment_path,
				group_type,
				id,
				staff_student_reference,
				created_username,
				created_date
			} = obj;
			rowsToShow.push({
				id,
				contract_number,
				document_attachment_path,
				group_type,
				staff_student_reference,
				created_username,
				created_date
			});
		}

		let columns = [];
		// columns.push({ field: "id", headerName: "Id", flex: 1 });
		// columns.push({ field: "category", headerName: "Category", flex: 1 });
		columns.push({
			field: "contract_number",
			headerName: "Contract number",
			flex: 1,
		});
		columns.push({ field: "group_type", headerName: "Group Type", flex: 1 });
		columns.push({
			field: "staff_student_reference",
			headerName: "Staff / Student Reference",
			flex: 1,
		});
		columns.push({
			field: "document_attachment_path",
			headerName: "Documents",
			flex: 1,
			renderCell: (params) => {
				const path = params.row.document_attachment_path;
				let count = 0;
				if (path === null || path === undefined) count = 0;
				else count = path.split(",").length;

				return (
                    // <Button href={`/documentsrepo/${params.row.id}`}>{`${count} ${
                    //   count <= 1 ? "File" : "Files"
                    // }`}</Button>
                    <IconButton
						onClick={() => navigate(`/documentsrepo/${params.row.id}`)}
					>
                        <VisibilityIcon color="primary" />
                    </IconButton>
                );
			},
		});
		columns.push({
			field: "created_username",
			headerName: "Created By",
			flex: 1,
		});
		columns.push({
			field: "created_date",
			headerName: "Created Date",
			flex: 1,
			renderCell: (params) =>
				moment(params.row.created_date).format("DD-MM-YYYY"),
		});

		setTableColumns(columns);
		setTableRows(rowsToShow);
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAttachment(file);
			setAttachmentName(file.name);
		} else {
			setAttachment(null);
			setAttachmentName("No File Choosen");
		}
	};

	const handleSubmit = async () => {
		let err = { ...errors };
		if (reference === "") err.reference = true;
		else err.reference = false;

		if (contractNo === "") err.contractNo = true;
		else err.contractNo = false;

		if (err.reference || err.contractNo) {
			setErrors(err);
			return;
		}
		setErrors(DEFAULT_ERRORS);

		if (!attachment || attachmentName === "")
			return alert("Please add attachment");

		const payload = {
			group_type: groupType,
			staff_student_reference: reference,
			contract_number: contractNo,
			active: true,
		};

		try {
			setLoading(true);
			const documentId = await uploadData(payload);
			await uploadAttachment(documentId);

			setErrors(DEFAULT_ERRORS);
			setReference("");
			setAttachmentName("");
			setGroupType(GROUP_TYPE);
			setContractNo("");
			setAttachment(null);
			setLoading(false);
			getAlldata();
		} catch (error) {
			setLoading(false);
			console.log(error);
			alert("Failed to save documents");
		}
	};

	const uploadData = (payload) => {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.post("/api/institute/saveDocuments", payload);
				resolve(res.data.data.documents_id);
			} catch (error) {
				reject(error);
			}
		});
	};

	const uploadAttachment = (documentId) => {
		return new Promise(async (resolve, reject) => {
			try {
				const formData = new FormData();
				formData.append("file", attachment);
				formData.append("documents_id", documentId);
				await axios.post("/api/institute/studentStaffUploadFile", formData);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	return (
        // <Box sx={{ width: "100%" }}>
        // 	<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        // 		<Tabs
        // 			value={value}
        // 			onChange={(e, newValue) => {
        // 				setValue(newValue);
        // 			}}
        // 			aria-label="basic tabs example"
        // 		>
        // 			<Tab label="OUTWARDS" {...a11yProps(0)} />
        // 			<Tab label="Outward Communication" {...a11yProps(1)} />
        // 			<Tab label="INWARDS" {...a11yProps(2)} />
        // 			<Tab label="INWARD COMMUNICATION" {...a11yProps(3)} />
        // 		</Tabs>
        // 	</Box>
        // 	<CustomTabPanel value={value} index={0}>
        // 		<OutwardCommunicationDocuments />
        // 	</CustomTabPanel>
        // 	<CustomTabPanel value={value} index={1}>
        // 		<OutwardCommunicationSubmission moveToFirstTab={() => setValue(0)} />
        // 	</CustomTabPanel>
        // 	<CustomTabPanel value={value} index={2}>
        // 		<Box mt={3}>
        // 			<GridIndex
        // 				rows={tableRows}
        // 				columns={tableColumns}
        // 				getRowId={(row) => row.id}
        // 				pageSize={pageSize}
        // 				rowCount={totalRows}
        // 				page={currentPage}
        // 				handleOnPageChange={(newPage) => setCurrentPage(newPage)}
        // 				handleOnPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // 				loading={dataLoading}
        // 			/>
        // 		</Box>
        // 	</CustomTabPanel>
        // 	<CustomTabPanel value={value} index={3}>
        // 		<FormWrapper>
        // 			<Grid container mt={3}>
        // 				<Grid container spacing={3}>
        // 					<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        // 						<FormControl fullWidth>
        // 							<InputLabel id="demo-simple-select-label">
        // 								Group Type
        // 							</InputLabel>
        // 							<Select
        // 								labelId="demo-simple-select-label"
        // 								id="demo-simple-select"
        // 								value={groupType}
        // 								label="Group Type"
        // 								onChange={(e) => setGroupType(e.target.value)}
        // 								error={errors.groupType}
        // 							>
        // 								<MenuItem value="Staff">Staff</MenuItem>
        // 								<MenuItem value="Student">Student</MenuItem>
        // 								<MenuItem value="General">
        // 									General
        // 								</MenuItem>
        // 							</Select>
        // 						</FormControl>
        // 					</Grid>
        // 					<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        // 						<TextField
        // 							error={errors.reference}
        // 							fullWidth
        // 							id="outlined-error-helper-text"
        // 							label="Staff / Student / Doc Reference no"
        // 							value={reference}
        // 							placeholder="Staff / Student Reference no"
        // 							onChange={(e) => setReference(e.target.value)}
        // 						/>
        // 					</Grid>
        // 					<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        // 						<TextField
        // 							error={errors.contractNo}
        // 							fullWidth
        // 							id="outlined-error-helper-text"
        // 							label="Additional Info"
        // 							value={contractNo}
        // 							placeholder="Additional Info"
        // 							onChange={(e) => setContractNo(e.target.value)}
        // 						/>
        // 					</Grid>
        // 					<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        // 						<Button
        // 							component="label"
        // 							variant="contained"
        // 							startIcon={<CloudUploadIcon />}
        // 						>
        // 							Upload file
        // 							<VisuallyHiddenInput
        // 								type="file"
        // 								accept="application/pdf"
        // 								onChange={handleFileUpload}
        // 							/>
        // 						</Button>
        // 						<Typography variant="h6">{attachmentName}</Typography>
        // 					</Grid>
        // 					<Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
        // 						<LoadingButton
        // 							onClick={handleSubmit}
        // 							loading={loading}
        // 							//   loadingPosition="start"
        // 							//   startIcon={<SaveIcon />}
        // 							variant="contained"
        // 						>
        // 							<span>Save</span>
        // 						</LoadingButton>
        // 					</Grid>
        // 				</Grid>
        // 			</Grid>

        // 			{/* <Box mt={3}> */}
        // 			{/* <Button variant='contained' onClick={handleSubmit}>Submit</Button> */}
        // 			{/* </Box> */}
        // 		</FormWrapper>
        // 	</CustomTabPanel>
        // </Box>
        <>
            <Tabs value={tab} onChange={handleChange}>
            {tabsData.map((tabItem) => (
              <Tab
                key={tabItem.value}
                value={tabItem.value}
                label={tabItem.label}
              />
            ))}
          </Tabs>
            {tabsData.map((tabItem) => (
              <div key={tabItem.value}>
                {tab === tabItem.value && <tabItem.component />}
              </div>
            ))}
        </>
    );
}
