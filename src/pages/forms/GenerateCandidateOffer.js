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
import RobotoBold from "../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../fonts/Roboto-Regular.ttf";
import logo from "../../assets/wmLogo.jpg";

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

const styles = StyleSheet.create({});

export const GenerateCandidateOffer = (data) => {
  const Content = () => {};

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Offer Letter">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View style={styles.image}>
                <Image style={{ width: "150px" }} src={logo} />
              </View>
              <Content />
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
