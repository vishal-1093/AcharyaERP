const religionList = [
  { value: "Hinduism", label: "Hinduism" },
  { value: "Buddhism", label: "Buddhism" },
  { value: "Jainism", label: "Jainism" },
  { value: "Christianity", label: "Christianity" },
  { value: "Islam", label: "Islam" },
  { value: "Sikhism", label: "Sikhism" },
];

religionList.sort((a, b) => a.label.localeCompare(b.label));

export default religionList;
