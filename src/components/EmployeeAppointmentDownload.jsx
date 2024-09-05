import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import PdfIcon from "../../src/assets/pdfIcon.png";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { getImage } from "../../src/components/EmployeeIDCardDownload";

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    padding: 40,
    fontFamily: "Times-Roman",
    position: "relative",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  boldHeader: {
    marginBottom: 10,
    fontFamily: "Times-Bold",
  },
  section: {
    marginTop: 20,
  },
  sectionStart: {
    marginTop: 30,
  },
  sectionText: {
    marginBottom: 5,
  },
  sectionHeader: {
    marginTop: 120,
  },
  center: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    textAlign: "center",
    padding: 10,
    margin: 5,
  },
  list: {
    marginBottom: 10,
    marginLeft: 10,
    display: "flex",
    flexDirection: "row",
  },
  subList: {
    marginBottom: 10,
    marginLeft: 40,
  },
  option: {
    marginLeft: 10,
  },
  optionText: {
    marginLeft: 10,
    flex: 1,
  },
  subOption: {
    marginBottom: 10,
    marginLeft: 50,
    display: "flex",
    flexDirection: "row",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  logoHeader: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  text: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionBody: {
    marginTop: 50,
    fontFamily: "Times-Bold",
    fontSize: 12,
  },
  pageCon: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 50,
    textAlign: "right",
  },
});

export const AppointmentDocument = ({ employeeDocuments }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoHeader}>
          <Image src={getImage(employeeDocuments)} />
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.text}>
            <Text>{employeeDocuments?.hrReferenceNo}</Text>
            <Text>Date :{employeeDocuments?.dateOfJoining}</Text>
          </View>
          <Text style={styles.center}>APPOINTMENT ORDER</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>To</Text>
          <View style={styles.option}>
            <Text>
              {employeeDocuments?.gender === "M" ? "Mr." : "Ms."}
              {employeeDocuments?.employeeName},
            </Text>
            {/* {employeeDocuments?.address?.split(",")?.map((line, index) => (
              <React.Fragment key={index}>
                <Text> {line?.trim()}</Text>
                <br />
              </React.Fragment>
            ))} */}
            <Text>{employeeDocuments?.street},</Text>
            <Text>{employeeDocuments?.locality} - {employeeDocuments?.pincode}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            Dear {employeeDocuments?.gender === "M" ? "Mr." : "Ms."}{" "}
            {employeeDocuments?.employeeName},
          </Text>
          <Text style={styles.option}>
            In pursuance of the decision of the staff selection committee
            meeting held, you are hereby appointed as{" "}
            <Text style={styles.bold}>
              {employeeDocuments?.designationName}
            </Text>{" "}
            and posted at{" "}
            <Text style={styles.bold}>{employeeDocuments?.schoolName}</Text>.
            Some of the more significant terms and conditions that govern your
            employment, subject to modifications from time to time are detailed
            below:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldHeader}>1. Place of Employment:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>1.1</Text>
            <Text style={styles.optionText}>
              You shall be reporting to the head of the institute{" "}
              {employeeDocuments?.reportingStaffName ? (
                employeeDocuments?.reportingStaffName
              ) : (
                <Text></Text>
              )}
              .
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldHeader}>2. Salary and Benefits:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>2.1</Text>
            <Text style={styles.optionText}>
              You will be paid a CTC Salary of INR{" "}
              <Text style={styles.bold}>{employeeDocuments?.ctc}</Text>/- per
              month.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>2.2</Text>
            <Text style={styles.optionText}>
              Salary shall be reviewed on an annual basis depending on the date
              of joining and you shall be notified of the amount on your salary
              entitlement for the succeeding year, depending upon your
              performance in job and commitment to the ethics of the profession.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>2.3</Text>
            <Text style={styles.optionText}>
              In addition to salary, you shall also be entitled to receive other
              benefits as applicable under the Institute policy. The Institute
              shall, in its sole discretion, be entitled to amend, vary, and
              modify any of the terms and conditions of the policy with regard
              to the benefits that are offered to you.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldHeader}>3. Resignation / Termination:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>3.1</Text>
            <Text style={styles.optionText}>
              You can terminate your employment with the institute by giving one
              month’s prior notice during the probation period.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>3.2</Text>
            <Text style={styles.optionText}>
              You can terminate your employment with the institute by giving
              three months prior notice after the probation period.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>3.3</Text>
            <Text style={styles.optionText}>
              The Institute shall have the right to terminate your employment
              during probation period without payment of any compensation or
              notice.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>3.4</Text>
            <Text style={styles.optionText}>
              The Institute shall have the right to terminate your employment
              after the probation period by giving one month’s notice, if you
              are unable to perform any of your duties or comply with
              Institute’s policies and code of conduct.
            </Text>
          </View>
          <View style={styles.section}></View>
          <View style={styles.list}>
            <Text style={styles.option}>3.5</Text>
            <Text style={styles.optionText}>
              The Institute reserves the right to, at its sole discretion, waive
              off the notice period by paying you salary in lieu of the notice
              period.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>3.6</Text>
            <Text style={styles.optionText}>
              <Text style={styles.bold}>
                It is hereby clarified that you cannot waive the notice period
                requirement in the event you wish to terminate your employment
                with Institute,
              </Text>{" "}
              and that your resignation will be accepted by the Institute only
              on your satisfying the required notice period as stated in
              Appointment Order. Further, till such time as the Institute
              accepts your resignation letter, you will be deemed to be an
              employee of the Institute and the terms and conditions of your
              employment will still continue to bind you.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>3.7</Text>
            <Text style={styles.optionText}>
              In case you want to be relieved immediately, you may do so only by
              paying back notice period month salary to the Institute in lieu of
              notice, subject to the following:
            </Text>
          </View>
          <Text style={styles.option}></Text>
          <View style={styles.subOption}>
            <Text style={styles.option}>3.7.1</Text>
            <Text style={styles.optionText}>
              You can resign only at the end of the semester.
            </Text>
          </View>
          <View style={styles.subOption}>
            <Text style={styles.option}>3.7.2</Text>
            <Text style={styles.optionText}>
              Your resignation will not be accepted if you resign in the middle
              of the semester.
            </Text>
          </View>
          <View style={styles.subOption}>
            <Text style={styles.option}>3.7.3</Text>
            <Text style={styles.optionText}>
              Your resignation will be accepted only with effect from the last
              date of working of the Semester.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>3.8</Text>
            <Text style={styles.optionText}>
              You have to handover library books, keys and any other material
              received by you from the Department/Institution and gets a NO DUE
              clearance certificate before receiving relieving orders.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>3.9</Text>
            <Text style={styles.optionText}>
              If you are guilty of any misconduct whether or not in the
              performance of your duties (including but not limited to being an
              undischarged insolvent, being convicted by any criminal court,
              being involved in fraudulent acts, etc) or commit any act which in
              the opinion of the Institute is likely to bring the Institute any
              disrepute whether or not such act is directly related to the
              affairs of the Institute, you will be terminated.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>4.0</Text>
            <Text style={styles.optionText}>
              If there is any discrepancy in the copies of the documents /
              certificate given by you as a proof in support of the information
              provided by you, you will be terminated. If your termination is
              due to clause 3.9 or 4.0, then there is no compensation
              applicable.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldHeader}>4. Mode of Communication:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>4.1</Text>
            <Text style={styles.optionText}>
              For any service of notice or communications of any kind, you will
              be informed by written communication/ email or ordinary post at
              the address given by you at the time of your employment or such
              other address as may be intimated by you to the management
              thereafter.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldHeader}>5. Warranty:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>5.1</Text>
            <Text style={styles.optionText}>
              You warrant that your joining the Institute will not violate any
              agreement to which you are or have been a party to.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>5.2</Text>
            <Text style={styles.optionText}>
              You warrant that you will not use or disclose any confidential or
              proprietary information obtained from a third party prior to your
              employment with the Institute.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>5.3</Text>
            <Text style={styles.optionText}>
              You warrant that you will comply with all JMJ Education
              Institute’s applicable policies and standards and shall perform
              your services in a manner consistent with ethical and professional
              standards of the Institute.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>5.4</Text>
            <Text style={styles.optionText}>
              You warrant that you possess all the requisite certificates, to be
              able to lawfully perform the services.
            </Text>
          </View>
        </View>
        <View style={styles.section}></View>
        <View style={styles.section}>
          <Text style={styles.boldHeader}>6. Indemnification:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>6.1</Text>
            <Text style={styles.optionText}>
              You agree to indemnify the Institute for any losses or damages
              sustained by the organization caused by or related to your breach
              of any of the provisions contained in this Terms of Employment.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldHeader}>7. General:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>7.1</Text>
            <Text style={styles.optionText}>
              You will have to produce the original certificates along with the
              attested Xerox copies at the time of reporting duty.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>7.2</Text>
            <Text style={styles.optionText}>
              This terms & conditions contain the entire agreement between the
              Faculty and Institute and no alteration or variations of the terms
              of this agreement shall be valid unless made in writing and signed
              by both parties here to. This agreement supersedes any prior
              agreements or understandings between the parties relating to the
              matter of employment with Institute.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>7.2</Text>
            <Text style={styles.optionText}>
              This agreement is made under and shall be construed according to
              the laws of India and Employee agrees to submit to the
              jurisdiction of the courts of Bangalore (Karnataka).
            </Text>
          </View>
        </View>
        <View style={styles.sectionBody}>
          <Text>SECRETARY</Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
        <Text
          style={styles.pageCon}
          render={({ pageNumber, totalPages }) =>
            pageNumber !== totalPages ? `cont....` : ""
          }
          fixed
        />
      </Page>
    </Document>
  );
};

const DownloadAppointmentPdf = ({
  employeeDocuments,
  setOpen = () => null,
  open = false,
  isDownload = false,
}) => {
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setTimeout(() => {
      setOpen(false);
    }, 0);
  };
  return (
    <>
      {isDownload && (
        <PDFDownloadLink
          document={
            <AppointmentDocument employeeDocuments={employeeDocuments} />
          }
          fileName={`Appointment_Letter.pdf`}
          style={{ textDecoration: "none", textAlign: "center" }}
        >
          {({ loading }) =>
            loading ? (
              <CircularProgress />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <img
                  src={PdfIcon}
                  alt="Download PDF"
                  style={{ width: "50px", height: "50px" }}
                />
                <Typography
                  Typography
                  variant="body2"
                  color="blue"
                  style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  Appointment_Letter.pdf
                </Typography>
              </div>
            )
          }
        </PDFDownloadLink>
      )}
      {/* {loading ? (
        <CircularProgress size={25} color="primary" />
      ) : (
        <div
          onClick={() => handleClickOpen()}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={PdfIcon}
            alt="Download PDF"
            style={{ width: "50px", height: "50px" }}
          />
          <Typography
            variant="body2"
            style={{
              color: "blue",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Appointment_Letter.pdf
          </Typography>
        </div>
      )} */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          <PDFViewer width="100%" height={600}>
            <AppointmentDocument employeeDocuments={employeeDocuments} />
          </PDFViewer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <PDFDownloadLink
            document={
              <AppointmentDocument employeeDocuments={employeeDocuments} />
            }
            fileName={`Appointment_Letter.pdf`}
            style={{ textDecoration: "none" }}
            onClick={handleClose}
          >
            {({ loading }) => (
              <Button color="primary" disabled={loading} autoFocus>
                {loading ? <CircularProgress size={14} /> : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DownloadAppointmentPdf;
