import React, { useEffect, useState } from "react";
import "../CSS/ViewResults.css";

function ViewResults({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="view-results-container">
      <h2>📊 Uploaded Student Results</h2>

      <div className="top-actions">
        <button className="refresh-btn" onClick={fetchResults}>🔄 Refresh</button>
        {onBack && (
          <button className="back-btn" onClick={onBack}>⬅ Back</button>
        )}
      </div>

      {loading && <p className="loading">Loading results...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && results.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>Index Number</th>
              <th>Subject</th>
              <th>Grade</th>
              <th>Uploaded By</th>
              <th>Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.indexNumber}</td>
                <td>{r.subject}</td>
                <td>{r.grade}</td>
                <td>{r.uploadedBy}</td>
                <td>{new Date(r.uploadedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !error && <p className="no-results">No results found.</p>
      )}
    </div>
  );
}

export default ViewResults;
