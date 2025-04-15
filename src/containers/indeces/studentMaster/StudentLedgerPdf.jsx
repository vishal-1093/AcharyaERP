// StudentLedgerPDF.js
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Sample data (replace with actual props/data)
const studentData = {
  auid: 'AIT24BEIS010',
  usn: '1AY24IS175',
  name: 'Sanjana K C',
  doa: '08-06-2024',
  program: 'BE - ISE',
  yearSem: '1/1 - G Section',
  category: 'MGT - MGT',
  proctor: '-',
  email: 'sanjanac.24.beis@acharya.ac.in',
  batch: '2024-2028',
  nationality: 'Indian',
  status: 'Eligible',
  mobile: '7760519638',
};

const feeData = [
  {
    sem: 'Sem 1',
    rows: [
      ['Total College Fee', '445875', '0', '5000', '440874', '0', '1'],
      ['Add-On Program Fee', '5625', '0', '0', '0', '5625', '0'],
      ['Uniform & Books', '8000', '0', '0', '0', '0', '8000'],
    ],
  },
  {
    sem: 'Sem 3',
    rows: [['Total College Fee', '394375', '0', '5000', '0', '0', '389375'], ['Add-On Program Fee', '5625', '0', '0', '0', '0', '5625']],
  },
  {
    sem: 'Sem 5',
    rows: [['Total College Fee', '394375', '0', '5000', '0', '0', '389375'], ['Add-On Program Fee', '5625', '0', '0', '0', '0', '5625']],
  },
];

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#3f51b5',
    color: 'white',
    textAlign: 'center',
    padding: 8,
    fontSize: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
    padding: 4,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
  },
  value: {
    width: '60%',
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    padding: 4,
    textAlign: 'center',
  },
  semTitle: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
  },
});

const StudentLedgerPDF = () => (
  <Document>
    <Page style={styles.page} size="A4">
      <Text style={styles.header}>Student Ledger</Text>

      {/* Student Details */}
      <Text style={styles.sectionTitle}>Student Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>AUID</Text>
        <Text style={styles.value}>{studentData.auid}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>USN</Text>
        <Text style={styles.value}>{studentData.usn}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Program</Text>
        <Text style={styles.value}>{studentData.program}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Current Year/Sem</Text>
        <Text style={styles.value}>{studentData.yearSem}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Admission Category</Text>
        <Text style={styles.value}>{studentData.category}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Proctor Name</Text>
        <Text style={styles.value}>{studentData.proctor}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Acharya Email</Text>
        <Text style={styles.value}>{studentData.email}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Student Name</Text>
        <Text style={styles.value}>{studentData.name}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>DOA</Text>
        <Text style={styles.value}>{studentData.doa}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Academic Batch</Text>
        <Text style={styles.value}>{studentData.batch}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Nationality</Text>
        <Text style={styles.value}>{studentData.nationality}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Reporting Status</Text>
        <Text style={styles.value}>{studentData.status}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Mobile No.</Text>
        <Text style={styles.value}>{studentData.mobile}</Text>
      </View>

      {/* Fee Details Table */}
      {feeData.map((semData, idx) => (
        <View key={idx} style={styles.table}>
          <Text style={styles.semTitle}>{semData.sem}</Text>
          <View style={styles.tableHeader}>
            {['Description', 'Fixed', 'P@B', 'SCH', 'ACERP', 'Paid', 'Due'].map((header, i) => (
              <Text key={i} style={styles.cell}>{header}</Text>
            ))}
          </View>
          {semData.rows.map((row, rIdx) => (
            <View key={rIdx} style={styles.tableRow}>
              {row.map((val, cIdx) => (
                <Text key={cIdx} style={styles.cell}>{val}</Text>
              ))}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default StudentLedgerPDF;
