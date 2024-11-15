import React, { useEffect, useState ,lazy} from "react";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField,CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate } from "react-router";
import { GenerateStudentAdmissionCancellation } from "./templates/StudentAdmissionCancellation";
import { GenerateStudentAdmission } from "./templates/StudentAdmission";
import PDFPreview from "./PDFPreview";
import { GenerateJoiningOrder } from "./templates/JoiningOrder";
import { GenerateRelievingOrder } from "./templates/RelievingOrder";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput")
);


const groupTypeLists = [
  {label:"Staff Related",value:"staff related"},
  {label:"Student Related",value:"student related"}
];

const initialState = {
    groupType:null,
    refNo:"",
    additional:"",
    loading:false,
    attachment:null,
    schoolId:"",
    schoolList:[],
    groupTypeList:groupTypeLists
};

const OutwardCommunicationSubmission = () => {
  const [{groupType,refNo,additional,groupTypeList,attachment,loading,schoolId,schoolList},setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const [dataLoading, setDataLoading] = React.useState(false);
  const [templateList, setTemplateList] = React.useState([])
	const [selectedTemplate, setSelectedTemplate] = React.useState("Select Template")
	const [withLetterhead, setWithLetterhead] = React.useState("Yes")
	const [userData, setUserdata] = React.useState({})
	const [useridErrorText, setuserIdErrorText] = React.useState("")
	const [userIdSearchError, setUserIdSearchError] = React.useState(false)
	const [searchUserId, setSearchUserId] = React.useState("")
    const [filePath, setFilePath] = useState("")
    const [fileName, setFileName] = useState("")
    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate();
    const { setAlertMessage, setAlertOpen } = useAlert();

    useEffect(() => {
      setCrumbs([
        { name: "Document Repo", link: "/document-repo" },
        { name: "Inward"},
        { name: "Create" },
      ]);
		// getCategories()
    getSchoolData();
	}, [])

    useEffect(() => {
        if(Object.keys(userData).length > 0){
            generateBlobFile()
        }
    }, [userData]);

    const getSchoolData = async () => {
      try {
        const res = await axios.get(`api/institute/getSchoolDetails`);
        if (res?.data?.data?.length) {
          setState((prevState)=>({
            ...prevState,
            schoolList: res?.data?.data.map((el) => ({
              ...el,
              label: el.school_name,
              value: el.id,
              orgType: el.org_type,
              shortName: el.school_name_short,
            }))
          }))
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getCategories = async () => {
		try {
			const res = await axios.get(`/api/getCategories`)
			const data = res.data.data

			if (data.length <= 0) return;
			setTemplateList([{ "categoryDetailsId": "Select Template", "categoryName": "Select Template" }, ...data])
		} catch (error) {
			console.log(error);
			alert("Failed to fetch category list data");
		}
	}

    const generateBlobFile = async () => {
        const today = moment(new Date().toLocaleDateString()).format("DD/MM/YYYY")
		if(selectedTemplate === 18){
			// Student Admission Cancellation
			const { name, userCode, dateOfAdmission, cancelAdmissionDate } = userData
            const doa = moment(dateOfAdmission).format("DD/MM/YYYY")
            const dateOfCancellAdmission = moment(cancelAdmissionDate).format("DD/MM/YYYY")
			const blobFile = await GenerateStudentAdmissionCancellation("", name, userCode, withLetterhead, today, doa, dateOfCancellAdmission)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("student_admission_cancellation_")
		}else if(selectedTemplate === 17){
			// Student Admission
			const { name, userCode, dateOfAdmission, academicYear } = userData
            const doa = moment(dateOfAdmission).format("DD/MM/YYYY")
			const blobFile = await GenerateStudentAdmission("", name, userCode, withLetterhead, today, academicYear, doa)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("student_admission_")
		}else if(selectedTemplate === 20){
			// Staff Relieving
            const { name, dateOfRelieving, designationName } = userData
            if(dateOfRelieving === null || dateOfRelieving === undefined || dateOfRelieving === "") return alert("Date of leaving not found") 
            if(designationName === null || designationName === undefined || designationName === "") return alert("Designation not found") 
            
            const dol = moment(dateOfRelieving).format("DD/MM/YYYY")
			const blobFile = await GenerateRelievingOrder("", name, dol, withLetterhead, today, designationName)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("Relieving_order_")
		}else if(selectedTemplate === 19){
			// Joining Order
            const { name, dateOfJoining, designationName, salary } = userData
            if(dateOfJoining === null || dateOfJoining === undefined || dateOfJoining === "") return alert("Date of Joining not found") 
            if(designationName === null || designationName === undefined || designationName === "") return alert("Designation not found") 
            const doj = moment(dateOfJoining).format("DD/MM/YYYY")
			const blobFile = await GenerateJoiningOrder("", name, doj, withLetterhead, today, designationName, salary)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("Joining_order_")
		}
	}

	const getUserDetails = async () => {
		try {
            if(selectedTemplate === "Select Template") return alert("Please select template")

            if(searchUserId === null || searchUserId === undefined || searchUserId === ""){
                setuserIdErrorText("Please provide userid to search")
                setUserIdSearchError(true)
                return
            }

            setUserIdSearchError(false)
            setuserIdErrorText("")

			setDataLoading(true);
			const res = await axios.get(`/api/getUserDetailsWithSearchText?userCode=${searchUserId}`)
			const data = res.data.data
			setuserIdErrorText("")
			setUserIdSearchError(false)
            if(Object.keys(data).length <= 0){
                setUserIdSearchError(true)
                setuserIdErrorText("No User Found")
                return
            } 

			setUserdata(data)
		} catch (error) {
			console.log(error);
			setuserIdErrorText("Failed to get user details")
			setUserIdSearchError(true)
            setFilePath("")
            setFileName("")
		}
	};

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleChangeFormField = (e) => {
    const { name, value } = e.target;
      setState((prev) => ({
        ...prev,
        [name]:value
      }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null
    }));
  };

    // const handleSave = () => {
    //     if(searchUserId === "") return alert("Please provide proper user id")
    //     if(selectedTemplate === "Select Template") return alert("Please select template")

    //     const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
    //     const usertype = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;

    //     const selectedTemplateDetails = templateList.find(obj => obj.categoryDetailsId === selectedTemplate)
    //     const { categoryTypeId, categoryShortName, categoryDetailsId } = selectedTemplateDetails

    //     const payload = {
    //         userId: userData.userId,
    //         userCode: userData.userCode,
    //         categoryTypeId: categoryTypeId,
    //         categoryDetailId: categoryDetailsId,
    //         content: "",
    //         categoryShortName: categoryShortName,
    //         createdBy: userId,
    //         usertype: usertype,
    //         templateType: "CUSTOM",
    //         withLetterHead: withLetterhead === "Yes" ? true : false
    //     }

    //     axios.post("/api/customtemplate/createCustomTemplate", payload)
    //     .then(res => {
    //         setUserdata({})
    //         setFileName("")
    //         setFilePath("")
    //         setSearchUserId("")
    //         moveToFirstTab()
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         const message = err.response ? err.response.data.message : "Failed to save the content"
    //         alert(message)
    //     })
    // }

    const setLoading = (val) => {
      setState((prevState)=>({
        ...prevState,
        loading:val
      }))
    }

    const handleCreate = async () => {
      try {
        // let payload = {
        //   student_id: studentDetail?.student_id,
        //   ac_year_id: acYearId,
        //   total_amount: formField.totalAmount,
        //   type: formField.paidType,
        //   remarks: formField.remarks,
        //   active: true,
        // };
        const payload = {
          group_type: groupType,
          staff_student_reference: refNo,
          contract_number: additional,
          school_id:schoolId,
          active: true,
        };
        setLoading(true);
        // if (!!location.state) {
        //   payload["hostel_waiver_id"] = location.state?.id;
        //   const res = await axios.put(
        //     `/api/finance/updatehostelwaiver/${location.state?.id}`,
        //     payload
        //   );
        //   if (formField.paidType === "Waiver" && !!formField.hwAttachment) {
        //     handleFileUpload(
        //       formField.hwAttachment,
        //       res.data.data.hostel_waiver_id,
        //       "update"
        //     );
        //   } else {
        //     actionAfterResponse(res, "update");
        //   }
        // } else {
          const res = await axios.post("/api/institute/saveDocuments", payload);
          if(res.status == 200 || res.status == 201){
            handleFileUpload(attachment,res.data.data.documents_id)
          }
        // }
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      }
    };
  
    const handleFileUpload = async (
      fileAttachment,
      document_id
    ) => {
      try {
        if (!!fileAttachment) {
          const formData = new FormData();
          formData.append("documents_id", document_id);
          formData.append("file", fileAttachment);
          const res = await axios.post(
            "/api/institute/studentStaffUploadFile",
            formData
          );
          if(res.status == 200 || res.status == 201){
            actionAfterResponse();
          }
        }
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      }
    };
  
    const actionAfterResponse = () => {
        navigate("/document-repo", { replace: true });
        setAlertMessage({
          severity: "success",
          message: `Data created successfully !!`,
        });
      setAlertOpen(true);
      setLoading(false);
    };

    return (
      <>
        {showModal && (
          <PDFPreview
            fileName={fileName}
            filePath={filePath}
            openModal={showModal}
            handleModal={setShowModal}
            templateType=""
            showDownloadButton={false}
          />
        )}
        <FormWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }} sx={{display:"flex",alignItems:"center"}}>
            <Grid item xs={12} md={4}>
            <CustomAutocomplete
            name="schoolId"
            value={schoolId}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="groupType"
                label="Group Type"
                value={groupType || ""}
                options={groupTypeList}
                handleChangeAdvance={handleChangeAdvance}
                // checks={checks.groupType}
                // errors={errorMessages.groupType}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <TextField
                  error={errors.reference}
                  fullWidth
                  id="outlined-error-helper-text"
                  label="Staff / Student / Doc Reference no"
                  value={reference}
                  placeholder="Staff / Student Reference no"
                  onChange={(e) => setReference(e.target.value)}
                /> */}
              <CustomTextField
              fullWidth
                name="refNo"
                label="Staff / Student / Doc Reference No"
                value={refNo}
                handleChange={handleChangeFormField}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <TextField
              fullWidth
                name="additional"
                label="Additional Info"
                value={additional}
                placeholder="Additional Info"
                handleChange={handleChangeFormField}
              /> */}
              <CustomTextField
              fullWidth
                name="additional"
                label="Additional Info"
                value={additional}
                handleChange={handleChangeFormField}
                multiline={true}
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={3}>
                <CustomFileInput
                  name="attachment"
                  label="Pdf File Attachment"
                  helperText="PDF - smaller than 2 MB"
                  file={attachment}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  // checks={checksAttachment.hwAttachment}
                  // errors={errorAttachmentMessages.hwAttachment}
                  required
                />
            </Grid>
            <Grid item xs={12} md={5} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              // disabled={loading || !auid || !acYearId}
              onClick={handleCreate}
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
      </>
    );
}

export default OutwardCommunicationSubmission