import React from "react"
import { Box, Button, Grid, IconButton, Modal, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { makeStyles } from "@mui/styles";

const useModalStyles = makeStyles((theme) => ({
    box: {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "90vh",
        border: "7px solid white",
        width: "100%",
        background: "white",
        boxShadow: 24,
        overflow: "auto",
        outline: "none",
    },
    header: {
        top: 0,
        padding: "7px 0",
        background: "white",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: "1.3rem",
        fontWeight: 500,
        color: theme.palette.primary.main,
    },
    objectTag: {
        height: "160px",
        width: "100%",
        maxHeight: "100%",
        position: "relative",
        textAlign: "center",
        [theme.breakpoints.up(1024)]: {
            height: "750px",
        },
    },
}));

const PDFPreview = ({ openModal, filePath, fileName, templateType, handleModal, showDownloadButton }) => {
    const popupclass = useModalStyles();

    const downloadBlob = () => {
		const link = document.createElement("a");
		link.href = filePath;
		link.setAttribute(
			"download",
			`${fileName}${new Date().toLocaleDateString()}.pdf`
		);
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);
	}

    return (<Modal
        open={openModal}
        setOpen={handleModal}
        style={{ height: "100%" }}
    >
        <Box className={popupclass.box} borderRadius={3} maxWidth={800}>
            <Grid container className={popupclass.header}>
                <Grid item xs={11} pl={2}>
                    <Typography variant="h6" className={popupclass.title}>
                        {templateType}
                    </Typography>
                    {showDownloadButton && <Button variant="contained" onClick={downloadBlob}>Download</Button>}
                </Grid>
                <Grid item xs={1}>
                    <IconButton
                        onClick={() => handleModal(false)}
                        sx={{ position: "absolute", top: 0, right: 0 }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Box p={2} pt={0}>
                <Box mt={4}>
                    <Grid container rowSpacing={2}>
                        <object
                            className={popupclass.objectTag}
                            data={`${filePath}#toolbar=0&navpanes=0&scrollbar=0`}
                            type="application/pdf"
                        >
                            <p>Unable to preview the document</p>
                        </object>
                    </Grid>
                </Box>
            </Box>
        </Box>
    </Modal>)
}

export default PDFPreview