import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./HomePage";
import { JobsMapping } from "./pages/JobsMapping";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobsMapping" element={<JobsMapping />} />
      </Routes>
    </>
  );
}

export default App;
