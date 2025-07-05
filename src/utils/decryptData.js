import CryptoJS from "crypto-js";

export const decryptEncryptedData = (encryptedData) => {
  const secretKey = "YourSecretKey123"; // Ensure this key is correct
  if (!secretKey) {
    return "Decryption failed";
  }
  try {
    // Ensure data is Base64 decoded before decryption
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      return "Decryption failed";
    }
    return JSON.parse(decryptedData);
  } catch (error) {
    return "Decryption failed";
  }
};
