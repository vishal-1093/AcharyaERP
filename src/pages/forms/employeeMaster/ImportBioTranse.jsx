import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
} from "@mui/material";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useAlert from "../../../hooks/useAlert";
import file from "../../../assets/importBiofile.csv";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = { document: "" };

function ImportBioTrans() {
  const [values, setValues] = useState(initialValues);
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 50,
    total: 0,
  });
  const [showImport, setShowImport] = useState(true);
  const setCrumbs = useBreadcrumbs();

  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".csv"),
      values.document && values.document.size < 2000000,
    ],
  };
  useEffect(() => {
    setCrumbs([{ name: "Import" }]);
  }, []);
  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a CSV",
      "Maximum size 2 MB",
    ],
  };

  //   useEffect(() => {
  //     getData();
  //   }, [paginationData.page, paginationData.pageSize]);

  const getData = async () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));

    return await axios
      .get(
        `/api/student/fetchAllCandidateResults?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date`
      )
      .then((res) => {
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data.Paginated_data.content,
          total: res.data.data.Paginated_data.totalElements,
          loading: false,
        }));
        return res.data.data.Paginated_data.content;
      })
      .catch((err) => console.error(err));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleCreate = async () => {
    const dataArray = new FormData();

    dataArray.append("file", values.document);

    await axios
      .post(`/api/employee/uploadBiometricTransactionDetails`, dataArray)
      .then((res) => {
        if (res.data.success === true) {
          setValues(initialValues);

          //setShowImport(false);
          setAlertMessage({
            severity: "success",
            message: "Results are imported successfully",
          });
          setAlertOpen(true);
          getData();
        } else {
          setAlertMessage({
            severity: "error",
            message: "Incorrect format !!",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Incorrect format !!",
        });
        setAlertOpen(true);
      });
  };

  return (
    <Box>
      <Grid container rowSpacing={4} justifyContent="center">
        {showImport ? (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Import"
                titleTypographyProps={{ variant: "subtitle2" }}
                sx={{
                  backgroundColor: "blue.main",
                  color: "headerWhite.main",
                  padding: 1,
                }}
                // action={
                //   <IconButton onClick={() => setShowImport(false)}>
                //     <CancelIcon sx={{ color: "headerWhite.main" }} />
                //   </IconButton>
                // }
              />
              <CardContent>
                <CustomFileInput
                  name="document"
                  label="Document"
                  file={values.document}
                  helperText="CSV - smaller than 2 MB"
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  checks={checks.document}
                  errors={errorMessages.document}
                />
              </CardContent>
              <CardActions sx={{ padding: 2 }}>
                <Grid container justifyContent="flex-end">
                  <Grid item xs={12} md={3} align="right">
                    <Button size="small" href={file} download="Document Format">
                      Download Format
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={3} align="right">
                    <Button
                      variant="contained"
                      onClick={handleCreate}
                      disabled={checks.document.includes(false) === true}
                    >
                      Import
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} align="right">
            <IconButton onClick={() => setShowImport(true)}>
              <BrowserUpdatedIcon sx={{ color: "blue.main", fontSize: 30 }} />
            </IconButton>
          </Grid>
        )}

        {/* <Grid item xs={12}>
          <GridIndex
            rows={paginationData.rows}
            columns={columns}
            rowCount={paginationData.total}
            page={paginationData.page}
            pageSize={paginationData.pageSize}
            handleOnPageChange={handleOnPageChange}
            handleOnPageSizeChange={handleOnPageSizeChange}
            loading={paginationData.loading}
          />
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default ImportBioTrans;
