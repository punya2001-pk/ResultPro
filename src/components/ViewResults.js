import React, { useEffect, useState } from "react";
import "../CSS/ViewResults.css";

function ViewResults({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
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

    fetchResults();
  }, []);

  return (
    <div className="view-results-container">
      <h2>📊 Uploaded Student Results</h2>

      {loading && <p className="loading">Loading results...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {results.length === 0 ? (
            <p className="no-results">No results uploaded yet.</p>
          ) : (
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
                {results.map((r, index) => (
                  <tr key={index}>
                    <td>{r.indexNumber}</td>
                    <td>{r.subject}</td>
                    <td className="grade">{r.grade}</td>
                    <td>{r.uploadedBy || "Unknown"}</td>
                    <td>{new Date(r.uploadedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <button className="back-btn" onClick={onBack}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default ViewResults;
