import React from "react";
import { Page, Text, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    margin: 10,
  },
  text: {
    fontSize: 12,
    margin: 10,
  },
});

const PDFFile = ({
  year,
  month,
  contractNumber,
  contractTitle,
  contractUser,
  employee,
  endUserActivities,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.text}>Year: {year}</Text>
      <Text style={styles.text}>Month: {month}</Text>
      <Text style={styles.text}>Contract Number: {contractNumber}</Text>
      <Text style={styles.text}>Contract Title: {contractTitle}</Text>
      <Text style={styles.text}>Contract User: {contractUser}</Text>
      <Text style={styles.text}>
        Employee: {employee.name} {employee.surname}
      </Text>
      <Text style={styles.text}>End Users Activities: </Text>

      {Object.entries(endUserActivities).map(([endUserId, activitiesSet]) => (
        <React.Fragment key={endUserId}>
          <Text style={styles.text}>End User ID: {endUserId}</Text>
          {Array.from(activitiesSet).map((activity, index) => (
            <Text key={index} style={styles.text}>
              {activity}
            </Text>
          ))}
        </React.Fragment>
      ))}
    </Page>
  </Document>
);

export default PDFFile;
