import RobotoBold from '../../../../fonts/Roboto-Bold.ttf'
import RobotoItalic from '../../../../fonts/Roboto-Italic.ttf'
import RobotoLight from '../../../../fonts/Roboto-Light.ttf'
import RobotoRegular from '../../../../fonts/Roboto-Regular.ttf'
import BkImage from "../../../../assets/Letterhead.jpg"
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
    contentContainer: {
        marginTop: "30pt",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "20px",
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

const Data = ({id, name, dol, date, designation}) => {
    const enText = `The employment contract concluded with ${name}, who has been working as ${designation} at Acharya University, should be canceled at his own request from ${dol} based on Article 99 of the Labor Code of the Republic of Uzbekistan.`
    const uzText = `Acharya universitetida ${designation} lavozimida faoliyat yuritib kelgan ${name} bilan tuzilgan mehnat shartnomasi ${dol} boshlab o'z xoxishiga ko'ra O'zbekiston Respublikasi Mehnat kodeksining 99-moddasiga asosan bekor qilinsin.`

    const enText1 = `According to Article 151 of the Labor Code of the Republic of Uzbekistan, the accounting office should make a full calculation of the compensation for unused vacation days of ${name}.`
    const uzText1 = `Hisobxona O'zbekiston Respublikasi Mehnat kodeksining 151-moddasiga asosan ${name} foydalanilmay qolgan mehnat ta'tili kunlariga kompensatsiya to'lash bo'yicha to'liq hisob-kitobni amalga oshirsin.`

    const enText2 = `BASIS: ${name} application`
    const uzText2 = `ASOS: ${name} arizasi`

    const title = `About cancellation employment/ Mehnat shartnomasini bekor qilish to'g'risida`
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.header}>ORDER / BUYRUQ <Text>{id}</Text></Text>
            <View style={styles.dateAndCityContainer}>
                <Text>{date}</Text>
                <Text>Karakul</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text>{title}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>{enText}</Text>
                <Text style={styles.content}>{uzText}</Text>
            </View>
            <View style={styles.contentContainer1}>
                <Text style={styles.content}>{enText1}</Text>
                <Text style={styles.content}>{uzText1}</Text>
            </View>
            <View style={styles.contentContainer1}>
                <Text style={styles.content}>{enText2}</Text>
                <Text style={styles.content}>{uzText2}</Text>
            </View>
            <View style={styles.footer}>
                <Text>Rahbar (CEO)</Text>
                <Text style={styles.signature}>_____________________</Text>
                <Text style={{marginTop: "10px"}}>Vishesh Chandrashekar</Text>
            </View>
        </View>
    )
}

export const GenerateRelievingOrder = (id, name, dol, withLetterhead, date, designation) => {
    return new Promise(async (resolve, reject) => {
        try {
            const HallTicketCopy = (
                <Document title="Joining Order">
                    <Page size="letter" style={styles.body}>
                        <View style={styles.templateContainer}>
                            {withLetterhead === "Yes" && <Image src={BkImage} style={styles.bkImage} />}
                            <Data id={id} name={name} dol={dol} date={date} designation={designation} />
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