import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./HomePage";
import { JobsMapping } from "./pages/JobsMapping";
import { Pdf } from "./pages/Pdf";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobsMapping" element={<JobsMapping />} />
        <Route path="/Pdf" element={<Pdf />} />
      </Routes>
    </>
  );
}

export default App;
