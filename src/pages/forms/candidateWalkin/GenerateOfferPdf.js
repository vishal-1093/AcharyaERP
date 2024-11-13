import domainUrl from "../../../services/Constants";
import {
  Document,
  Image,
  Link,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import ait from "../../../assets/aisait.jpg";
import moment from "moment";
import sign from "../../../assets/offersign.png";
import seal from "../../../assets/offerseal2.jpg";
import footer from "../../../assets/footer.jpg";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  image: { position: "absolute", width: "100%" },
  layout: { margin: "140px 45px 45px 45px" },
  subLayout: { margin: "45px" },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  margin: { marginTop: "25px" },
  subMargin: { marginTop: "15px" },
  paragraphMargin: { marginTop: "10px" },
  paragraph: { textAlign: "justify", lineHeight: 1.4 },
  alignCenter: { alignItems: "center" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  footerText: {
    color: "grey",
    fontSize: 14,
    textAlign: "center",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  heading: { fontSize: 14, fontFamily: "Times-Bold", textAlign: "center" },
  subHeading: { fontSize: 12, fontFamily: "Times-Bold" },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    // padding: "3px",a
  },
  tableRow: {
    flexDirection: "row",
  },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  marginBottom: { marginBottom: "10px" },
  link: { fontFamily: "Times-Bold", fontSize: 14, textDecoration: "none" },
  acceptText: {
    textAlign: "center",
    fontSize: 12,
    color: "grey",
    fontFamily: "Times-Bold",
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const refundTable = [
  {
    firstValue: "Registration",
    secondValue: "Non-refundable Any time of notice",
  },
  {
    firstValue: "100% of Tuition fee",
    secondValue: "15 days or more before the commencement of classes",
  },
  {
    firstValue: "90% of Tuition fee",
    secondValue: "Less than 15 days before the commencement of classes",
  },
  {
    firstValue: "80% of Tuition fee",
    secondValue: "Less than 15 days after the commencement of classes",
  },
  {
    firstValue: "50% of Tuition fee",
    secondValue:
      "More than 15 days and less than 30 days after the commencement of classes",
  },
  {
    firstValue: "0%",
    secondValue: "More than 30 days after the commencement of classes",
  },
];

const acceptanceDetail = [
  { label: "Candidate Name", value: "candidateName" },
  { label: "DOB", value: "dateOfBirth" },
  { label: "Parent Name", value: "fatherName" },
  { label: "Application No", value: "application_no_npf" },
  { label: "Candidate ID", value: "candidateId" },
];

const bankDetails = [
  { label: "Bank Name", value: "YES BANK" },
  { label: "Account Name", value: "ACHARYA INST CMS A/C" },
  { label: "Account No", value: "002294600002503" },
  { label: "IFSC Code", value: "YESB0000022" },
  { label: "Swift Code", value: "YESBINBB" },
];

const feeTemplateHeads = ["registrationFee", "campusFee", "compositeFee"];

const logos = require.context("../../../assets", true);

export const GenerateOfferPdf = (data, feeTemplateData, noOfYears) => {
  const {
    permanentPincode: pincode,
    application_no_npf: applicationNo,
    candidateName,
    candidateEmail,
    program_short_name: programshortName,
    program_specialization_name: specialization,
    school_name: school,
    ac_year: acYear,
    fatherName,
    npf_status: npfStatus,
    candidateId,
    candidateSex: gender,
    cityName,
    stateName,
    countryName,
    ip_address: ipAddress,
    offerAcceptedDate,
    laptop_status: laptopStatus,
    school_name_short: schoolShortName,
    org_type: orgType,
    fee_admission_category_id: admissionCategory,
  } = data;

  const { scholarShip, addOnFee, uniformFee, curreny } = feeTemplateData;

  const fullAddress = [stateName, pincode, countryName]
    .filter(Boolean)
    .join(", ");
  const program = `${programshortName} - ${specialization}`;
  const fullName =
    gender === "Male" ? `Mr.${candidateName}` : `Ms.${candidateName}`;

  const DisplayDate = () => (
    <View style={styles.row}>
      <View>
        <Text>Ref.No: {applicationNo}</Text>
      </View>
      <View style={styles.textRight}>
        <Text>{`Date: ${moment().format("DD-MM-YYYY")}`}</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.margin}>
      <View>
        <Text style={styles.bold}>{fullName}</Text>
      </View>
      <View>
        <Text style={styles.paragraph}>
          {[cityName].filter(Boolean).join(", ")}
        </Text>
      </View>
      <View>
        <Text style={styles.paragraph}>{fullAddress}</Text>
      </View>
      <View>
        <Text>{candidateEmail}</Text>
      </View>
    </View>
  );

  const Subject = () => (
    <View style={styles.margin}>
      <View>
        <Text>Dear Student,</Text>
      </View>
      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          Subject: Formal Admission Offer for
          <Text style={styles.bold}>{` ${program} `}</Text>
          Program at<Text style={styles.bold}>{` ${school}`}</Text>.
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          We trust this letter finds you well. It is with great pleasure that We
          extend our congratulations on your successful application to the
          {` ${program} `} at ACHARYA INSTITUTE OF TECHNOLOGY. We are delighted
          to inform you that you have been accepted for the
          <Text style={styles.bold}>{` ${acYear} `}</Text> Academic Session.
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          Please be advised that this formal offer is contingent upon your
          fulfilment of the academic requirements as stipulated by the
          Constituent body/University. To secure your place in the program, we
          kindly request you to digitally accept this offer by clicking on the
          'Accept Now' button in the Acceptance Letter attached herewith.
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          Upon accepting this offer, you are committing to the payment of the
          prescribed fees outlined below. It is imperative that you carefully
          review and accept the terms, conditions, and regulations of Acharya
          Institutes to ensure a smooth academic journey
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          {admissionCategory === 2
            ? "For any clarifications or assistance, please do not hesitate to contact us at +91 9731700408 / +919731779233 or email : international@acharya.ac.in"
            : "For any clarifications or assistance,please do not hesitate to contact us at +91 74066 44449 , admissions@acharya.ac.in"}
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          We look forward to welcoming you to
          <Text style={styles.bold}>{`  ${school} `}</Text>
          and wish you every success in your academic endeavours.
        </Text>
      </View>

      <View style={{ marginTop: "50px" }}>
        <Text style={styles.paragraph}>Sincerely,</Text>
      </View>
    </View>
  );

  const SignatureSection = () => (
    <View style={[styles.row, styles.alignCenter]}>
      <View>
        <Image src={sign} style={{ width: "80px" }} />
        <Text style={styles.bold}>Director of Admissions</Text>
        <Text style={{ fontSize: 9, fontFamily: "Times-Bold" }}>{school}</Text>
      </View>
      <View>
        <Image src={seal} style={{ width: "80px" }} />
      </View>
      <View>
        <Text>Annexure 1: Terms and Conditions & Fees</Text>
        <Text>Annexure 2: Acceptance letter</Text>
      </View>
    </View>
  );

  const FooterText = () => (
    <View style={styles.footerText}>
      <Text style={styles.bold}>
        This is a Letter of Offer and cannot be used for Visa purposes.
      </Text>
    </View>
  );

  const FirstPage = () => (
    <>
      <DisplayDate />
      <Address />
      <Subject />
      <SignatureSection />
    </>
  );

  const PageData = () => (
    <View style={styles.pageLayout}>
      <Image
        style={styles.image}
        src={logos(
          `./${orgType.toLowerCase()}${schoolShortName.toLowerCase()}.jpg`
        )}
      />
      <View style={styles.layout}>
        <FirstPage />
      </View>
    </View>
  );

  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({
    label,
    style,
    right,
    bottom,
    align,
    customWidth = 1,
  }) => (
    <View
      style={{
        flex: customWidth,
        borderStyle: "solid",
        borderRightWidth: right,
        borderBottomWidth: bottom,
        borderColor: "black",
        outline: "none",
        padding: "3px",
        fontSize: 10,
        marginRight: right === 0 ? 1 : 0,
      }}
    >
      <Text style={{ fontFamily: style, textAlign: align }}>{label}</Text>
    </View>
  );

  const DisplayTableheader = () => (
    <DispayRow>
      <DisplayCells
        label="Fee Type & Percentage of Refund"
        style="Times-Bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label="Point of notice"
        style="Times-Bold"
        right={0}
        bottom={1}
        align="center"
      />
    </DispayRow>
  );

  const RefundData = () => (
    <View style={[styles.borderTable]}>
      <DisplayTableheader />
      {refundTable.map((obj, i) => (
        <DispayRow key={i}>
          <DisplayCells
            label={obj.firstValue}
            style="Times-Roman"
            right={1}
            bottom={i !== 5 ? 1 : 0}
            align="justify"
          />
          <DisplayCells
            label={obj.secondValue}
            style="Times-Roman"
            right={0}
            bottom={i !== 5 ? 1 : 0}
            align="justify"
          />
        </DispayRow>
      ))}
    </View>
  );

  const CancelPolicy = () => (
    <View style={styles.pageLayout}>
      <View style={styles.subLayout}>
        {laptopStatus && (
          <>
            <Text style={styles.subHeading}>Laptop Issuance and Usage</Text>
            <View style={styles.paragraphMargin}>
              <Text style={styles.paragraph}>
                • All students, who have enrolled for the particular Programmes,
                will be provided with laptops by the institution.
              </Text>
              <Text style={styles.paragraph}>
                • Laptops will be equipped with proprietary software necessary
                for the program of study.
              </Text>
              <Text style={styles.paragraph}>
                • Mandatory usage of laptops is required for both theory and
                practical sessions.
              </Text>
              <Text style={styles.paragraph}>
                • Issued laptops cannot be returned to the institution. In the
                event of admission cancellation post-laptop issuance, a penalty
                shall be applicable.
              </Text>
            </View>
          </>
        )}

        <View style={laptopStatus ? styles.subMargin : {}}>
          <Text style={styles.subHeading}>Cancellation Policy</Text>
        </View>
        <View style={styles.paragraphMargin}>
          <Text style={styles.paragraph}>
            Candidates seeking admission cancellation must submit a written
            request to the Director of Admissions, including reasons and
            supporting documentary proof.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text style={[styles.subHeading, styles.marginBottom]}>
            Refund Policy
          </Text>
        </View>

        <RefundData />
      </View>
    </View>
  );

  const FeeTemplate = () => (
    <>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="Particulars"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
          />
          {noOfYears?.map((obj, i) => (
            <DisplayCells
              key={i}
              label={obj.value}
              style="Times-Bold"
              right={i === noOfYears.length - 1 ? 0 : 1}
              bottom={1}
              align="center"
            />
          ))}
        </DispayRow>

        {feeTemplateHeads.map((obj, i) => (
          <DispayRow key={i}>
            <DisplayCells
              label={feeTemplateData[obj]?.feeType}
              style="Times-Roman"
              right={1}
              bottom={1}
              align="left"
              customWidth={2}
            />
            {noOfYears?.map((yearSem, j) => (
              <DisplayCells
                key={j}
                label={feeTemplateData?.[obj]?.[`year${yearSem.key}`]}
                style="Times-Roman"
                right={j === noOfYears.length - 1 ? 0 : 1}
                bottom={1}
                align="right"
              />
            ))}
          </DispayRow>
        ))}

        <DispayRow>
          <DisplayCells
            label="Total"
            style="Times-Bold"
            right={1}
            bottom={(curreny === "INR" && uniformFee) || scholarShip ? 1 : 0}
            align="center"
            customWidth={2}
          />
          {noOfYears?.map((obj, i) => (
            <DisplayCells
              key={i}
              label={feeTemplateData[`sem${obj.key}Total`]}
              style="Times-Bold"
              right={i === noOfYears.length - 1 ? 0 : 1}
              bottom={(curreny === "INR" && uniformFee) || scholarShip ? 1 : 0}
              align="right"
            />
          ))}
        </DispayRow>

        {scholarShip && (
          <DispayRow>
            <DisplayCells
              label={feeTemplateData["scholarShip"]?.feeType}
              style="Times-Roman"
              right={1}
              bottom={1}
              align="left"
              customWidth={2}
            />
            {noOfYears?.map((yearSem, j) => (
              <DisplayCells
                key={j}
                label={feeTemplateData["scholarShip"][`year${yearSem.key}`]}
                style="Times-Bold"
                right={j === noOfYears.length - 1 ? 0 : 1}
                bottom={1}
                align="right"
              />
            ))}
          </DispayRow>
        )}

        {curreny === "INR" && uniformFee && scholarShip && (
          <DispayRow>
            <DisplayCells
              label="Total"
              style="Times-Bold"
              right={1}
              bottom={1}
              align="center"
              customWidth={2}
            />
            {noOfYears?.map((yearSem, j) => (
              <DisplayCells
                key={j}
                label={feeTemplateData[`sem${yearSem.key}GrantTotal`]}
                style="Times-Bold"
                right={j === noOfYears.length - 1 ? 0 : 1}
                bottom={1}
                align="right"
              />
            ))}
          </DispayRow>
        )}

        {curreny === "INR" && uniformFee && (
          <DispayRow>
            <DisplayCells
              label={feeTemplateData["uniformFee"]?.feeType}
              style="Times-Roman"
              right={1}
              bottom={1}
              align="left"
              customWidth={2}
            />
            {noOfYears?.map((yearSem, j) => (
              <DisplayCells
                key={j}
                label={feeTemplateData["uniformFee"][`year${yearSem.key}`]}
                style="Times-Roman"
                right={j === noOfYears.length - 1 ? 0 : 1}
                bottom={1}
                align="right"
              />
            ))}
          </DispayRow>
        )}

        {((curreny === "INR" && (uniformFee || scholarShip)) ||
          (curreny === "USD" && scholarShip)) && (
          <DispayRow>
            <DisplayCells
              label="Grand Total"
              style="Times-Bold"
              right={1}
              bottom={0}
              align="center"
              customWidth={2}
            />
            {noOfYears?.map((obj, i) => (
              <DisplayCells
                key={i}
                label={
                  curreny === "INR"
                    ? feeTemplateData[`sem${obj.key}FinalGrantTotal`]
                    : feeTemplateData[`sem${obj.key}GrantTotal`]
                }
                style="Times-Bold"
                right={i === noOfYears.length - 1 ? 0 : 1}
                bottom={0}
                align="right"
              />
            ))}
          </DispayRow>
        )}
      </View>

      {curreny === "USD" && (
        <>
          {addOnFee && (
            <>
              <View style={styles.paragraphMargin}>
                <Text style={styles.textRight}>(Amount in INR)</Text>
              </View>

              <View style={styles.paragraphMargin}>
                <View style={[styles.borderTable]}>
                  <DispayRow>
                    <DisplayCells
                      label="Particulars"
                      style="Times-Bold"
                      right={1}
                      bottom={1}
                      align="center"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={obj.value}
                        style="Times-Bold"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={1}
                        align="center"
                      />
                    ))}
                  </DispayRow>
                  <DispayRow>
                    <DisplayCells
                      label={addOnFee?.feeType}
                      style="Times-Roman"
                      right={1}
                      bottom={0}
                      align="left"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={addOnFee?.[`year${obj.key}`]}
                        style="Times-Roman"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={0}
                        align="right"
                      />
                    ))}
                  </DispayRow>
                </View>
              </View>
            </>
          )}

          {uniformFee && (
            <>
              <View style={styles.paragraphMargin}>
                <Text style={styles.textRight}>(Amount in INR)</Text>
              </View>

              <View style={styles.paragraphMargin}>
                <View style={[styles.borderTable]}>
                  <DispayRow>
                    <DisplayCells
                      label="Particulars"
                      style="Times-Bold"
                      right={1}
                      bottom={1}
                      align="center"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={obj.value}
                        style="Times-Bold"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={1}
                        align="center"
                      />
                    ))}
                  </DispayRow>
                  <DispayRow>
                    <DisplayCells
                      label={uniformFee?.feeType}
                      style="Times-Roman"
                      right={1}
                      bottom={0}
                      align="left"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={uniformFee?.[`year${obj.key}`]}
                        style="Times-Roman"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={0}
                        align="right"
                      />
                    ))}
                  </DispayRow>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </>
  );

  const SecondPageData = () => (
    <View style={styles.pageLayout}>
      <View style={styles.subLayout}>
        <Text style={styles.heading}>Annexure 1 - Terms & Conditions</Text>
        <View style={styles.subMargin}>
          <Text>
            Please carefully review the Terms & Conditions outlined below:
          </Text>
        </View>
        <View>
          <Text>Fees Payment Timelines: For the 1st Sem / Year</Text>
        </View>
        <View style={styles.paragraphMargin}>
          <Text style={styles.paragraph}>
            • Registration fees must be paid immediately upon acceptance of the
            Offer Letter.
          </Text>
          <Text style={styles.paragraph}>
            • 50% of the total balance fees is to be settled within 3 working
            days.
          </Text>
          <Text style={styles.paragraph}>
            • The remaining balance fees must be paid within 15 days.
          </Text>
          <View>
            <Text style={styles.textRight}>(Amount in {curreny})</Text>
          </View>
          <View style={styles.paragraphMargin}>{<FeeTemplate />}</View>
          <Text style={[styles.paragraphMargin, styles.bold]}>Note :</Text>
          <Text style={[styles.paragraphMargin, styles.paragraph]}>
            • Delayed fee payments will incur a late fee.
          </Text>
          <Text style={styles.paragraph}>
            • Registration fees are to be paid exclusively through the link
            provided in the Acceptance Letter.
          </Text>
          <Text style={styles.paragraph}>
            • The balance fee is to be transacted through the individual login
            of the ERP Portal / ACERP APP.
          </Text>
          <Text style={styles.paragraph}>
            • Cash payments for fees are not accepted.
          </Text>
          <Text style={styles.paragraph}>
            • Students are responsible for the payment of exam and convocation
            fees as prescribed by the Board/University.
          </Text>
          <Text style={styles.paragraph}>
            • Admission ID is generated upon successful payment of the
            registration fee
          </Text>
          <Text style={styles.paragraph}>
            • A Provisional Admission letter, including admission details and
            the student's official Acharya email ID with the password, will be
            sent upon Admission ID generation. On completion of course email ID
            will be deactivated.
          </Text>
          <Text style={styles.paragraph}>
            • Admission will be finalized upon submission, verification of
            original documents, and approval from the respective
            Board/University.
          </Text>
          <Text style={styles.paragraph}>
            • To complete the enrolment process, we kindly request you to submit
            the original documents (Marks sheets of relevant academic years)
            with 2 sets of photocopies from your previous college or a
            provisional letter within two days from the issuance of this offer
            letter.
          </Text>
          <Text style={styles.paragraph}>
            • Failure to submit the aforementioned documents within the
            stipulated timeframe may result in the cancellation of your
            admission.
          </Text>
          <Text style={styles.paragraph}>
            • Please ensure that all documents are authentic and duly attested.
            If you face any challenges or require an extension, kindly contact
            the Admission Office at
            {admissionCategory === 2
              ? ` (international@acharya.ac.in) `
              : ` (admissions@acharya.ac.in) `}
            at the earliest.
          </Text>
          <Text style={styles.paragraph}>
            • Failure to complete admission formalities and payment as
            prescribed may result in the withdrawal of provisional admission
          </Text>
          <Text style={styles.paragraph}>• Fees are subject to change.</Text>
        </View>
      </View>
    </View>
  );

  const displayName = (index, value) => {
    if (index === 0)
      return gender === "Male" ? `Mr.${data[value]}` : `Ms.${data[value]}`;
    if (index === 2) return `Mr.${data[value]}`;
    return data[value];
  };

  const AcceptanceData = () => (
    <View style={styles.pageLayout}>
      <View style={styles.subLayout}>
        <Text style={styles.heading}>Annexure 2 - Letter of Acceptance</Text>
        <View style={styles.margin}>
          <Text>To,</Text>
          <Text>Director Admissions</Text>
          <Text>Acharya Institutes</Text>
          <Text>Soldevanahalli, Bengaluru</Text>
          <Text>Karnataka, India</Text>
        </View>

        <View style={[styles.margin, { width: "50%" }]}>
          <View style={[styles.borderTable, styles.marginBottom]}>
            {acceptanceDetail?.map((obj, i) => (
              <DispayRow key={i}>
                <DisplayCells
                  label={obj.label}
                  style="Times-Roman"
                  right={1}
                  bottom={i === 4 ? 0 : 1}
                  align="left"
                />
                <DisplayCells
                  label={displayName(i, obj.value)}
                  style="Times-Roman"
                  right={0}
                  bottom={i === 4 ? 0 : 1}
                  align="left"
                />
              </DispayRow>
            ))}
          </View>
        </View>

        <View style={styles.margin}>
          <Text style={styles.paragraph}>
            I {fullName} son/daughter of {`Mr.${fatherName}`} have thoroughly
            reviewed the Offer Letter and accompanying Terms and conditions for
            admission to the {` ${program} `} program at
            {` ${school} `} for the Academic Year {` ${acYear} `}.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text style={styles.paragraph}>
            By digitally accepting this offer, I hereby confirm that I
            comprehend all the details outlined in the letter and willingly
            commit to paying the prescribed fees as specified in my Offer
            Letter.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text style={styles.paragraph}>
            I formally accept the offer for the BACHELOR OF
            {` ${program} `} program for the Academic Year {` ${acYear}`},
            acknowledging and agreeing to abide by all the terms and conditions
            as explicitly stated in the Offer Letter.
          </Text>
        </View>

        {npfStatus === 3 && (
          <>
            <View style={styles.margin}>
              <Text style={styles.bold}>Digital Acceptance Details</Text>
            </View>

            <View style={styles.subMargin}>
              <Text style={styles.paragraph}>
                Date & Time:{moment(offerAcceptedDate).format("DD-MM-YYYY LT")}
              </Text>
              <Text style={styles.paragraph}>{`IP Address: ${ipAddress}`}</Text>
            </View>
          </>
        )}

        {npfStatus === 3 ? (
          <View style={styles.subMargin}>
            <Link
              src={`/registration-payment/${candidateId}`}
              style={styles.link}
            >
              Pay Now
            </Link>
          </View>
        ) : (
          <View style={styles.subMargin}>
            <Link
              src={`${domainUrl}offer-acceptance/${candidateId}`}
              style={styles.link}
            >
              Accept Offer
            </Link>
          </View>
        )}

        <View style={styles.margin}>
          <Text style={styles.textRight}>Student Signature</Text>
        </View>

        {admissionCategory === 2 && npfStatus === 3 && (
          <>
            <View style={styles.margin}>
              <Text
                style={[styles.subHeading, { textDecoration: "underline" }]}
              >
                Bank Details For Payment Transfer
              </Text>
            </View>

            <View style={[styles.subMargin, { width: "48%" }]}>
              <View style={[styles.borderTable, styles.marginBottom]}>
                {bankDetails?.map((obj, i) => (
                  <DispayRow key={i}>
                    <DisplayCells
                      label={obj.label}
                      style="Times-Bold"
                      right={1}
                      bottom={i === 4 ? 0 : 1}
                      align="left"
                    />
                    <DisplayCells
                      label={obj.value}
                      style="Times-Roman"
                      right={0}
                      bottom={i === 4 ? 0 : 1}
                      align="left"
                    />
                  </DispayRow>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.margin}>
          <Text style={styles.acceptText}>
            This Letter of Acceptance is a binding document, and any breach of
            the terms and conditions may result in the withdrawal of admission
          </Text>
        </View>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Offer Letter">
          <Page size="A4" style={styles.pageLayout}>
            <PageData />
            <FooterText />
            <Image style={styles.footerImage} src={footer} />
          </Page>
          <Page size="A4" style={styles.pageLayout}>
            <SecondPageData />
          </Page>
          <Page size="A4" style={styles.pageLayout}>
            <CancelPolicy />
          </Page>
          <Page size="A4" style={styles.pageLayout}>
            <AcceptanceData />
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
