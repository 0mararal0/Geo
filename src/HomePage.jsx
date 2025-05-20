import React from "react";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Pdf } from "./pages/Pdf";

export const HomePage = () => {
  return (
    <div>
      <Link to="/jobsMapping">
        <button className="btn btn-primary">Jobs Mapping</button>
      </Link>
      <Link to="/pdf">
        <button className="btn btn-primary">pdf</button>
      </Link>
      <a href="/">Volver</a>
      <h1>
        <a href="tel:+34659778230">Llamar Alberto</a>
      </h1>
      <PDFDownloadLink document={<Pdf />} fileName="document.pdf">
        {({ loading, url, error, blob }) =>
          loading ? "Cargando documento..." : <button>Descargar PDF</button>
        }
      </PDFDownloadLink>
    </div>
  );
};
