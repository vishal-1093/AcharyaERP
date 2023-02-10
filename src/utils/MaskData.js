export const maskMobile = (number) => {
  if (number) {
    return "********" + number.substr(8, 10);
  }
};

export const maskEmail = (email) => {
  if (email) {
    const split = email.split("@");
    return email.substr(0, 2) + "********@" + split[1];
  }
};
