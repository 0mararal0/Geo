import React from "react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div>
      <Link to="/jobsMapping">
        <button className="btn btn-primary">Jobs Mapping</button>
      </Link>
    </div>
  );
};
