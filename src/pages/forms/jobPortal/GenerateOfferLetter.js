import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import moment from "moment";

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  pageLayout: {
    fontFamily: "Roboto",
    fontSize: "10px",
  },

  image: { position: "absolute", width: "100%" },

  layout: { margin: "140px 25px 20px 25px" },

  flex: {
    display: "flex",
    flexDirection: "row",
  },

  mt: { marginTop: "20px" },

  paragraphMargin: { marginTop: "10px" },
});

const logos = require.context("../../../assets", true);

export const GenerateOfferLetter = (offerData, empData) => {
  const FteContent = () => {
    return (
      <View style={styles.layout}>
        <View style={styles.flex}>
          <View style={{ width: "50%" }}>
            <Text style={{ fontStyle: "bold", padding: "3px" }}>
              Ref :&nbsp;
              <Text
                style={{
                  fontStyle: "normal",
                  display: "inline",
                }}
              >
                {offerData.offercode}
              </Text>
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                fontStyle: "bold",
                padding: "3px",
                textAlign: "right",
              }}
            >
              Date :&nbsp;
              <Text
                style={{
                  fontStyle: "normal",
                  display: "inline",
                }}
              >
                {moment().format("DD-MM-YYYY")}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.mt}>
          <View style={{ lineHeight: "1.5" }}>
            <Text>{empData.firstname}</Text>
            <Text>{empData.street},</Text>
            <Text>{empData.locality},</Text>
            <Text>{empData.city_name + " - " + empData.pincode},</Text>
            <Text>{empData.email},</Text>
          </View>
        </View>

        <View style={styles.mt}>
          <Text
            style={{
              fontStyle: "bold",
              fontSize: "11px",
              textAlign: "center",
              textDecoration: "underline",
            }}
          >
            FIXED TERM EMPLOYMENT OFFER
          </Text>
        </View>

        <View style={styles.mt}>
          <Text
            style={{
              fontStyle: "normal",
            }}
          >
            Dear&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
              }}
            >
              {empData.firstname},
            </Text>
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              fontStyle: "normal",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            With reference to the application and subsequent discussion you had
            with us, we are pleased to offer you employment as Junior Executive
            at&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
                textTransform: "capitalize",
              }}
            >
              {offerData.school_name.toLowerCase()}
            </Text>
            &nbsp;on a FIXED TERM from&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
              }}
            >
              {offerData.from_date}
            </Text>
            &nbsp;to&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
              }}
            >
              {offerData.to_date}
            </Text>
            . FTE Contract commences from Date of reporting.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              fontStyle: "bold",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            Job Description :&nbsp;
            <Text
              style={{
                fontStyle: "normal",
                display: "inline",
              }}
            >
              {offerData.remarks}
            </Text>
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              fontStyle: "bold",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            Place of Posting :&nbsp;
            <Text
              style={{
                fontStyle: "normal",
                display: "inline",
              }}
            >
              You will be posted at&nbsp;{offerData.school_name}. However,
              during the employment with us you may be transferred or deputed to
              any of our Offices / branches / Departments without any additional
              remuneration.
            </Text>
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              fontStyle: "bold",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            Remuneration :&nbsp;
            <Text
              style={{
                fontStyle: "normal",
                display: "inline",
              }}
            >
              You will be paid an all-inclusive amount of Rs.
              <Text
                style={{
                  fontStyle: "bold",
                  display: "inline",
                }}
              >
                {Math.round(offerData.ctc)}
              </Text>
              /- pm during the term of employment with us. The said remuneration
              is subject to applicable statutory deductions.
            </Text>
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              fontStyle: "bold",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            Your FTE offer is subject to fulfillment of following terms &
            conditions
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            1. You are required to enter into a Fixed Term Employment
            Contract/Agreement (FTE) at the time of joining/reporting to work.
            Your employment (FTE) is governed by the HR Policies in force and
            FTE Agreement.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            2. Your appointment is further subject to the information /
            references furnished by you being correct. In case particulars
            mentioned in your application are found false or unsatisfactory,
            your services are liable for termination without notice or payment.
            of any remuneration in lieu thereof.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            3.You shall be required to sign and abide by the NDA (Non-Disclosure
            Agreement) and shall undertake to sign such declarations that the
            Policy may demand from time to time.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            4.You are required to submit attested copies of certificates in
            support of your educational / professions qualifications and
            experience date of birth and other testimonials and cause production
            of originals as and when demanded.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
              marginBottom: "40px",
            }}
          >
            We look forward to your joining the Organization for a pleasant
            association with your remarkable contribution for&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
                textTransform: "capitalize",
              }}
            >
              {offerData.school_name.toLowerCase()}.
            </Text>
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              fontStyle: "bold",
            }}
          >
            Authorised Signatory
          </Text>
        </View>
      </View>
    );
  };

  const Content = () => {
    return (
      <View style={styles.layout}>
        <View style={styles.mt}>
          <Text
            style={{
              fontStyle: "bold",
              fontSize: "11px",
              textAlign: "center",
              textDecoration: "underline",
            }}
          >
            OFFER LETTER
          </Text>
        </View>

        <View style={{ marginTop: "8px" }}>
          <Text
            style={{
              fontStyle: "bold",
              fontSize: "11px",
              textAlign: "center",
              textDecoration: "underline",
            }}
          >
            Office of HR Department
          </Text>
        </View>

        <View style={styles.flex}>
          <View style={{ width: "50%" }}>
            <Text style={{ fontStyle: "bold", padding: "3px" }}>
              Ref :&nbsp;
              <Text
                style={{
                  fontStyle: "normal",
                  display: "inline",
                }}
              >
                {offerData.offercode}
              </Text>
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                fontStyle: "bold",
                padding: "3px",
                textAlign: "right",
              }}
            >
              Date :&nbsp;
              <Text
                style={{
                  fontStyle: "normal",
                  display: "inline",
                }}
              >
                {moment().format("DD-MM-YYYY")}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.mt}>
          <View style={{ lineHeight: "1.5" }}>
            <Text>To,</Text>
            <Text>{empData.firstname}</Text>
            <Text>{empData.street},</Text>
            <Text>{empData.locality},</Text>
            <Text>{empData.city_name + " - " + empData.pincode},</Text>
            <Text>{empData.email},</Text>
          </View>
        </View>

        <View style={styles.mt}>
          <Text
            style={{
              fontStyle: "bold",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            Subject :&nbsp;
            <Text
              style={{
                fontStyle: "normal",
                display: "inline",
              }}
            >
              Offer for the post of {offerData.designation}
            </Text>
          </Text>
        </View>

        <View style={styles.mt}>
          <Text
            style={{
              fontStyle: "normal",
            }}
          >
            Dear&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
              }}
            >
              {empData.firstname},
            </Text>
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            With reference to your application and subsequent interview, we are
            pleased to offer you the post of&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
                textTransform: "capitalize",
              }}
            >
              {offerData.designation.toLowerCase()}
            </Text>
            &nbsp;in the Department of&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
                textTransform: "capitalize",
              }}
            >
              {offerData.dept_name.toLowerCase()}
            </Text>
            &nbsp;at&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
                textTransform: "capitalize",
              }}
            >
              {offerData.school_name.toLowerCase()}
            </Text>
            . You will be on Probation for a period of one year or six months
            from the date of reporting to duty and your performance will be
            reviewed at the end of every 6 months.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            You are requested to contact HR Office first, on the day of
            reporting at the College. We look forward to a fruitful and long
            term association together.
          </Text>
        </View>

        <View style={{ marginTop: "30px" }}>
          <Text>Yours Sincerely,</Text>
        </View>

        <View style={{ marginTop: "40px" }}>
          <Text style={{ fontStyle: "bold" }}>Managing Director</Text>
        </View>

        <View
          style={{
            position: "absolute",
            width: "100%",
            top: "625px",
            lineHeight: "1.5",
            fontStyle: "normal",
          }}
        >
          <Text>*Note: This offer is valid for 7 days from offer date.</Text>
          <Text>
            *Encl: The details of the CTC/Salary breakup in the Annexure 1 is
            appended here to.
          </Text>
        </View>
      </View>
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Offer Letter">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <Image
                style={styles.image}
                src={logos(
                  `./${offerData.school_name_short.toLowerCase()}.jpg`
                )}
              />
              {offerData.employee_type === "FTE" ? <FteContent /> : <Content />}
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(generateDocument).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
