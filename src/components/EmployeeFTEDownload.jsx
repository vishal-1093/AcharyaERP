import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import LetterheadImage from "../../src/assets/auait.jpg";
import PdfIcon from "../../src/assets/pdfIcon.png";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    padding: 40,
    fontFamily: "Times-Roman",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    marginTop: 115,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Times-Bold",
  },
  titleHeader: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "Times-Bold",
  },
  table: {
    fontFamily: "Times-Bold",
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20,
  },
  tableRow: {
    fontFamily: "Times-Bold",
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    fontFamily: "Times-Bold",
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    fontFamily: "Times-Bold",
    margin: 5,
    fontSize: 12,
  },
  center: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  logoHeader: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  list: {
    marginBottom: 10,
    marginLeft: 30,
    display: "flex",
    flexDirection: "row",
  },
  subList: {
    marginBottom: 10,
    marginLeft: 40,
  },
  option: {
    marginRight: 5,
  },
  optionText: {
    flex: 1,
  },
  subOption: {
    marginBottom: 10,
    marginLeft: 50,
    display: "flex",
    flexDirection: "row",
  },
  text: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Create Document Component
export const MyDocument = ({ employeeDocuments }) => {
  console.log(employeeDocuments?.schoolShortName?.toLowerCase(), "eeee");
  const getImage = () => {
    try {
      return require(`../../src/assets/${employeeDocuments?.schoolShortName?.toLowerCase()}.jpg`);
    } catch (error) {
      console.error("Image not found:", employeeDocuments?.schoolShortName);
      return LetterheadImage;
    }
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoHeader}>
          <Image src={getImage()} />
        </View>
        <View style={styles.sectionHeader}>
        <View style={styles.text}>
          <Text>{employeeDocuments?.hrReferenceNo}</Text>
          <Text >Date :{employeeDocuments?.dateOfJoining}</Text>
        </View>
          <Text style={styles.title}>
            {`This Fixed Term Employment Contract is executed As On ${employeeDocuments?.dateOfJoining}, by
          and between:`}
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            M/S <Text style={styles.bold}>{employeeDocuments?.schoolName}</Text>
            , having its registered office at 89 & 90, Acharya Dr.Sarvepalli
            Radhakrishnan Road, Soladevanahalli, Bangalore-560107, duly
            represented by Shri. B. Premnath Reddy, Secretary of the Society
            (hereinafter referred to as the{" "}
            <Text style={styles.bold}>Employer</Text>, which expression shall,
            unless repugnant to the context or meaning thereof, be deemed to
            mean and include its successors and permitted assigns) of the First
            Part;
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.center}>And</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Mr.{" "}
            <Text style={styles.bold}>
              {employeeDocuments?.employeeName},
            </Text>{" "}
            {`resident of ${employeeDocuments?.address}`} (hereinafter referred
            to as the <Text style={styles.bold}>Employee</Text>) of the Second
            Part;
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            Each party hereinafter referred to as a{" "}
            <Text style={styles.bold}>Party</Text> and collectively hereinafter
            referred to as the <Text style={styles.bold}>Parties.</Text>
          </Text>
        </View>
        <View style={styles.section}>
          <Text>
            Both the Parties now wish to set out in writing their understanding
            relating to such undertaking's with respect to the Fixed Term
            Employment to the Second Party by the First Party and the parties
            hereby agree as follows:
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>
            1. Appointment and Job Profile :
          </Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              In pursuit of excellence, the Society pursues/faces tasks related
              to Accreditation from various Statutory/Regulatory Authorities and
              bodies such as NBA/NAAC/AICTE etc for all the Institutes under it,
              also in pursuit of a University Status, this Employment Contract
              is for the completion of Adhoc Academic and Non Academic
              activities involving special Courses/Training/Coaching/Student
              Data mining/Digitalization of data/Data Compiling/Infrastructure
              Restructuring/Restoration/Repairs etc and any other works as may
              be related for such end purposes.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              During the course of this contract, the Employee shall be
              designated as{" "}
              <Text style={styles.bold}>
                {employeeDocuments.designationName}
              </Text>{" "}
              and posted at{" "}
              <Text style={styles.bold}>{employeeDocuments.schoolName}</Text>.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>c.</Text>
            <Text style={styles.optionText}>
              The Employee hereby agrees to accept to be the employee and
              accepts the position as a{" "}
              <Text style={styles.bold}>
                {employeeDocuments.designationName}
              </Text>{" "}
              under the JMJ Education Society and to be posted at{" "}
              <Text style={styles.bold}>{employeeDocuments.schoolName}</Text>{" "}
              for a fixed period from{" "}
              <Text style={styles.bold}>{employeeDocuments.dateOfJoining}</Text>{" "}
              to <Text style={styles.bold}>{employeeDocuments.tillDate}</Text>{" "}
              on the conditions stipulated hereunder this agreement.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>d.</Text>
            <Text style={styles.optionText}>
              The employee will be responsible for and accept all duties and
              responsibilities as agreed between the employer and Employee.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>e.</Text>
            <Text style={styles.optionText}>
              The Employee's job title does not define or restrict duties and
              the Employee may be required to undertake other work within
              his/her abilities at the request of the Employer and any refusal
              to comply with such request constitutes a breach of the contract
              of employment. The Employer, however, undertakes that these
              additional tasks shall be within the training, experience or
              occupational capabilities of the employee concerned and that no
              employee shall suffer any loss of remuneration or status for work
              done on additional tasks.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>2. Commencement and Duration :</Text>
          <Text>
            This agreement will commence from the date of reporting to duty.
            This agreement replaces all previous agreements between the employer
            and employee. The Employee hereby confirms that the employer has
            made no representation that his employment with the employer will
            continue beyond the completion of the period term and in the absence
            of any written agreement to the contrary the employee's employment
            with the employer will automatically terminate when the period of
            the term is completed.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>3. Place of Employment:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              Employee shall be reporting to the Head of the Institution,{" "}
              <Text style={styles.bold}>{employeeDocuments.schoolName}</Text>.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              The first month of contract of employment shall be a probation
              period in which the Employer may terminate the contract of
              employment with immediate effect or extend such probation period,
              if the employee does not perform satisfactorily during the
              probation period.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>4. Salary and Benefits:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              The parties agree that the employee will be remunerated with an
              amount of Rs.41700/- (forty one thousands seven hundred rupees )
              per month. The break up of the same is mentioned in Annexure-A
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              Payment of monthly salary will be made as per prevailing practice
              by the institution. Employee hereby authorizes the Employer to
              deduct from salary, all statutory deductions and any amounts due
              by the employee if any.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>c.</Text>
            <Text style={styles.optionText}>
              The Employee will not be remunerated for any period of
              unauthorized absence.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>d.</Text>
            <Text style={styles.optionText}>
              In addition to salary, Employee shall also be entitled to receive
              other benefits as applicable under the Society policy. The Society
              shall, in its sole discretion, be entitled to amend, vary, and
              modify any of the terms and conditions of the policy with regard
              to the other benefits that are offered to you other than the
              remuneration mentioned in sub clause (a) of this clause.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>
            5. Duties, Hours of Work and Leaves :
          </Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              Employee hereby agrees to perform duties as per roles and
              responsibilities mentioned in{" "}
              <Text style={styles.bold}>Annexure B</Text>.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              Employee hereby agrees to perform the duties as per the No of
              hours and days specified in the HR policies of the Society amended
              from time to time.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>c.</Text>
            <Text style={styles.optionText}>
              Employee is entitled for Casual leaves as per the HR policies of
              the society amended from time to time which are relevant and
              applicable to his/her <Text style={styles.bold}>“term”</Text> of
              employment. However, any leave accumulated will lapse at the end
              of agreement.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>d.</Text>
            <Text style={styles.optionText}>
              If the Employee is absent from work without leave, i.e. for any
              reason other than authorised leave, he shall not be entitled to
              any pay for the days of absence or part of a day and could be
              subject to disciplinary action.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>e.</Text>
            <Text style={styles.optionText}>
              The Employee has to notify his Employer of his absence within a
              reasonable period.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>f.</Text>
            <Text style={styles.optionText}>
              The Employee hereby acknowledges that he/she shall be obliged to
              follow the general rules and regulations of the society.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>6. Termination of Contract :</Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              This contract shall automatically terminate upon the expiry of the
              term of service stipulated in clause 1(b) above without either
              party's having to notify the other party. However if an employees
              is unauthorized absence for a period of 7 days, the said contract
              will be terminated.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              Notwithstanding the provisions above, the contract may be
              terminated during the first month of employment set out in clause
              3(b) hereof. If the Employee's services are terminated by the
              Employer within the probation period, or the probation period
              extended by the Employer, this shall be done with due cognizance
              of the principles of substantive and procedural fairness. In the
              event of the Employee not performing up to standard during his
              probation period such an employee will not have any right to an
              extension of his probation period.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>c.</Text>
            <Text style={styles.optionText}>
              During the probation period the Employer has the right to
              terminate the contract with out any notice.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>d.</Text>
            <Text style={styles.optionText}>
              The Employer reserves the right to summarily terminate this
              contract, in case of Employee is guilty of any misconduct whether
              or not in the performance of your duties (including but not
              limited to being an un discharged insolvent, being convicted by
              any criminal court, being involved in fraudulent acts, etc) or
              commit any act which in the opinion of the Employer is likely to
              bring the Institute any disrepute whether or not such act is
              directly related to the affairs of the Employer.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>e.</Text>
            <Text style={styles.optionText}>
              The Employer reserves the right to terminate this contract in case
              of discrepancy in the copies of the documents / certificate given
              by Employee as a proof in support of the information provided for
              this employment contract.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>f.</Text>
            <Text style={styles.optionText}>
              This contract of employment may be terminated by either party
              giving the other party a (1) one month notice.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>g.</Text>
            <Text style={styles.optionText}>
              The Employer at its discretion will have the right to pay the
              Employee in lieu of notice
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>h.</Text>
            <Text style={styles.optionText}>
              Should the employee fail to give sufficient notice of termination
              of service the Employer would be entitled to withhold an amount of
              salary/leave pay, equal to the period of notice he /she was
              supposed to have served.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>7. Mode of Communication:</Text>
          <Text>
            For any service of notice or communications of any kind, either
            parties will be informed by written communication/ email or ordinary
            post at the respective address of Employer and Employee mentioned in
            this agreement or such other address as may be intimated by the
            parties thereafter
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>8. Warranties:</Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              Employee hereby warrants that entering in to this employment
              contract and joining the Institute will not violate any agreement
              to which Employee have been a party to.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              Employee hereby warrants that Employee possess all the requisite
              certificates, to be able to lawfully perform the services.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>c.</Text>
            <Text style={styles.optionText}>
              Employee warrant that you will not use or disclose any
              confidential or proprietary information obtained from a third
              party prior to your employment with the Institute.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>9. Indemnification:</Text>
          <Text>
            The Employee hereby indemnify the Employer for any losses or damages
            sustained by the First Party caused by or related to your breach of
            any of the provisions contained in this Terms of Employment.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>
            10. Confidentiality And Non Compete
          </Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              The Employee or representative shall divulge or communicate to any
              third party or use or exploit for any purpose whatsoever any of
              the trade secrets or confidential information belonging to or
              relating to the Employer received or obtained as a result of
              entering into this Agreement.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              Provided that the above restriction shall not apply:-
            </Text>
          </View>
          <View style={styles.subOption}>
            <Text style={styles.option}>i.</Text>
            <Text style={styles.optionText}>
              to information which at the time of disclosure is in the public
              domain or is in the possession of the Party to whom it is
              disclosed by reasons of disclosure from an independent third party
              or otherwise than as a result of entry into this Agreement or the
              Parties relationship with the company.
            </Text>
          </View>
          <View style={styles.subOption}>
            <Text style={styles.option}>ii.</Text>
            <Text style={styles.optionText}>
              to the disclosure of information to officers, employees or persons
              professionally engaged by a Party for the purpose of the
              administration of the company and the development of its business
              or the operation of this Agreement.
            </Text>
          </View>
          <View style={styles.subOption}>
            <Text style={styles.option}>iii.</Text>
            <Text style={styles.optionText}>
              to the disclosure of information to the extent that disclosure is
              required or ordered by an applicable law or competent judicial
              authority, Governmental or other authority.
            </Text>
          </View>
          <View style={styles.subOption}>
            <Text style={styles.option}>iv.</Text>
            <Text style={styles.optionText}>
              to information which prior to disclosure falls into the public
              domain (otherwise than by a Party in breach of this Article) or is
              lawfully acquired by the Party to whom it has been disclosed.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>c.</Text>
            <Text style={styles.optionText}>
              Curriculum, process and programs designed are the propriety of the
              Employer and the Employee shall not compete with the Employer in
              way and shall not carry out the similar kind of business for a
              period of 1 years from the date on which this agreement is
              terminated
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>11. Governing Law:</Text>
          <Text>
            This agreement is made under and shall be constructed according to
            the laws of India and Employee agrees to submit to the jurisdiction
            of the courts of Bangalore (Karnataka).
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleHeader}>12. General :</Text>
          <View style={styles.list}>
            <Text style={styles.option}>a.</Text>
            <Text style={styles.optionText}>
              The Employer may introduce such regulations and/or lay down such
              procedures may be deemed necessary for the implementation/
              administration of your terms and conditions of employment as
              stated in this letter with due intimation to Employee and the same
              will be binding on Employee.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>b.</Text>
            <Text style={styles.optionText}>
              Employee shall devote your whole time and attention to the
              business of the company and shall not engage/participate in or be
              interested in any other duties, work or business or occupation of
              any kind or nature and shall not take whole or part time
              employment with any other persons, firm or organization in any
              capacity
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>c.</Text>
            <Text style={styles.optionText}>
              This terms & conditions contain the entire agreement between the
              Employee and Employer and no alteration or variations of the terms
              of this agreement shall be valid unless made in writing and signed
              by both parties here to. This agreement supersedes any prior
              agreements or understandings between the parties relating to the
              matter of employment with Society.
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.option}>d.</Text>
            <Text style={styles.optionText}>
              The Annexure A attached to this documents forms part of this
              contract/Agreement.
            </Text>
          </View>
          <Text>
            IN WITNESS WHEREOF, each of the aforenamed Parties has signed and
            executed this Fixed Term Employment Contract , and all the original
            copies hereto, on the date first above written with free will and
            consent and without duress:
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                For and Behalf of JMJ Education Society (First party/ Employer )
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>For Employee (Second party )</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>B. Premnath Reddy</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {employeeDocuments?.employeeName}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Secretary</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Witness :</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Witness:</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const EmployeeFTEDownload = ({ employeeDocuments }) => (
  <PDFDownloadLink
    document={<MyDocument employeeDocuments={employeeDocuments} />}
    fileName={`FTE_Agreement.pdf`}
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
            FTE_Agreement
          </Typography>
        </div>
      )
    }
  </PDFDownloadLink>
);

export default EmployeeFTEDownload;
