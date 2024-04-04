import RobotoBold from '../../../../fonts/Roboto-Bold.ttf'
import RobotoItalic from '../../../../fonts/Roboto-Italic.ttf'
import RobotoLight from '../../../../fonts/Roboto-Light.ttf'
import RobotoRegular from '../../../../fonts/Roboto-Regular.ttf'
import BkImage from "../../../../assets/Letterhead.jpg"
// import sign from "../../../../assets/sign.png";
// import stamp from "../../../../assets/stamp.png";
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

Font.registerHyphenationCallback((word) => [word]);

Font.register({ family: 'Roboto', fonts: [
    { src: RobotoBold, fontStyle: 'bold', fontWeight: 700 },
    { src: RobotoItalic, fontStyle: 'italic', fontWeight: 200 },
    { src: RobotoLight, fontStyle: 'light', fontWeight: 300 },
    { src: RobotoRegular, fontStyle: 'normal' }
   ]})

   const styles = StyleSheet.create({
    body: {
        margin: 0,
    },
    templateContainer: {
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%"
    },
    bkImage: {
        position: "relative",
        minWidth: "100%",
        minHeight: "100%",
        display: "block",
        height: "100%",
        width: "100%",
    },
    headerContainer: {
        position: "absolute",
        top: "125pt",
        left: "50pt",
        width: "456pt",
    },
    header: {
        position: "relative",
        width: "100%",
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: "12px",
        fontStyle: "bold",
        fontWeight: 700
    },
    dateAndCityContainer: {
        position: "relative",
        marginTop: "25pt",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        fontFamily: "Roboto",
        fontSize: "12px",
        fontStyle: "bold",
        fontWeight: 700
    },
    contentContainer: {
        marginTop: "30pt",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "20px",
    },
    titleContainer: {
        position: "relative",
        marginTop: "25pt",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        fontFamily: "Roboto",
        fontSize: "12px",
        fontStyle: "bold",
        fontWeight: 700,
        textDecoration: "underline"
    },
    studentDetailsContainer: {
        position: "relative",
        marginTop: "25pt",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontSize: "12px",
        fontStyle: "bold",
        fontWeight: 700
    },
    contentContainer1: {
        marginTop: "10pt",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "20px",
    },
    content: {
        flexGrow: 1,
        width: "50%",
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontSize: "11px",
        textAlign: "justify",
        fontWeight: 300,
        hyphens: "none"
    },
    footer: {
        marginTop: "120pt",
        fontSize: "13px"
    },
    signature: {
        marginTop: "40pt"
    },
    signImage: {
        position: "absolute",
        bottom: "20pt",
        left: "0",
        display: "block",
        height: "65px",
        width: "140px",
    },
    stampImage: {
        position: "absolute",
        bottom: "20pt",
        left: "140pt",
        display: "block",
        height: "120px",
        width: "150px",
    }
})

const Data = ({id, name, auid, date, doa, cancelAdmissionDate}) => {
    const enText = `${name}, (${auid}) a first-year student at the Acharya University who is studying based on a payment contract, is to be expelled from the list of university students starting on ${cancelAdmissionDate}`
    const uzText = `${name}, (${auid}) ${cancelAdmissionDate} noyabrdan boshlab to‘lov-kontrakt asosida tahsil olayotgan Acharya universitetining birinchi kurs talabasi universitet talabalari ro‘yxatidan chetlashtiriladi.`

    const title = `Student admission cancellation / Talabalarni qabul qilishni bekor qilish`
    const studentName = `Student Name / Talaba ismi: ${name}`
    const studentAUID = `AUID: ${auid}`
    const studentDOA = `Date of Admission / Qabul sanasi: ${doa}`

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.header}>ORDER / Buyurtma raqami <Text>{id}</Text></Text>
            <View style={styles.dateAndCityContainer}>
                <Text>{date}</Text>
                <Text>Karakul District</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text>{title}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>{enText}</Text>
                <Text style={styles.content}>{uzText}</Text>
            </View>
            <View style={styles.contentContainer1}>
                <Text style={styles.content}>Basis: Decision No. 393 of the Cabinet of Ministers of the Republic of Uzbekistan, student's application registered with appropriate signatures.</Text>
                <Text style={styles.content}>Asos: O‘zbekiston Respublikasi Vazirlar Mahkamasining 393-son qarori, talabaning tegishli imzolar bilan ro‘yxatga olingan arizasi.</Text>
            </View>
            <View style={styles.studentDetailsContainer}>
                <Text>{studentName}</Text>
                <Text>{studentAUID}</Text>
                <Text>{studentDOA}</Text>
            </View>
            <View style={styles.footer}>
                <Text>Rahbar (CEO)</Text>
                <Text style={styles.signature}>_____________________</Text>
                <Text style={{marginTop: "10px"}}>Vishesh Chandrashekar</Text>
            </View>
            {/* <Image src={sign} style={styles.signImage} />
            <Image src={stamp} style={styles.stampImage} /> */}
        </View>
    )
}

export const GenerateStudentAdmissionCancellation = (id, name, auid, withLetterhead, date, doa, cancelAdmissionDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const HallTicketCopy = (
                <Document title="Student Admission Cancellation">
                    <Page size="letter" style={styles.body}>
                        <View style={styles.templateContainer}>
                            {withLetterhead === "Yes" && <Image src={BkImage} style={styles.bkImage} />}
                            <Data id={id} name={name} auid={auid} date={date} doa={doa} cancelAdmissionDate={cancelAdmissionDate} />
                        </View>
                    </Page>
                </Document>
            );

            const blob = await pdf(HallTicketCopy).toBlob();
            resolve(blob);
        } catch (error) {
            reject(error);
        }
    })
}