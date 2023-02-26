const occupationList = [
  { value: "Agriculture", label: "Agriculture" },
  { value: "Business", label: "Business" },
  { value: "Defence", label: "Defence" },
  { value: "Governament Sector", label: "Governament Sector" },
  { value: "Homemaker", label: "Homemaker" },
  { value: "Private Sector", label: "Private Sector" },
  { value: "Retired", label: "Retired" },
  { value: "Other", label: "Other" },
];

occupationList.sort((a, b) => a.label.localeCompare(b.label));

export default occupationList;
