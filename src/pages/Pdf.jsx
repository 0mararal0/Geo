import React from "react";
import { Document, Page, Text, Image, PDFViewer } from "@react-pdf/renderer";

export const Pdf = () => (
  <Document>
    <Page size="A4">
      <Text>Hola</Text>
      <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</Text>
    </Page>
  </Document>
);
