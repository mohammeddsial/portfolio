// src/pages/scanner.jsx

import { useState, useEffect } from "react";

export default function JobScanner() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (Array.isArray(data)) setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const triggerScan = async () => {
    setMessage("Scanning...");
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SCAN_SECRET}`,
        },
      });
      const data = await res.json();
      setMessage(data.message || "Scan complete");
      fetchJobs();
    } catch (err) {
      setMessage("Scan failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => (s >= 80 ? "#22c55e" : s >= 60 ? "#eab308" : "#94a3b8");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e2e8", fontFamily: "system-ui" }}>
      <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h1>Remote Job Radar</h1>
        <button
          onClick={triggerScan}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 12,
          }}
        >
          {loading ? "Scanning..." : "🔍 Scan Now"}
        </button>
        {message && <p style={{ marginTop: 8, color: "#94a3b8" }}>{message}</p>}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
        {jobs.map((job, i) => (
          <div key={i} style={{ background: "#1e293b", padding: 16, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{job.title}</h3>
              <span style={{ color: scoreColor(job.match_score), fontWeight: 700 }}>
                {job.match_score}%
              </span>
            </div>
            <p style={{ color: "#94a3b8" }}>{job.company} — {job.location}</p>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>{job.description?.slice(0, 200)}</p>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {job.url && (
                <a href={job.url} target="_blank" rel="noreferrer" style={{ color: "#7c3aed" }}>
                  Apply →
                </a>
              )}
              {job.cold_message && (
                <details>
                  <summary style={{ cursor: "pointer", color: "#22c55e" }}>💬 Cold Message</summary>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 4 }}>{job.cold_message}</pre>
                </details>
              )}
            </div>
          </div>
        ))}
        {!loading && jobs.length === 0 && (
          <p style={{ textAlign: "center", color: "#64748b" }}>No jobs yet. Click "Scan Now".</p>
        )}
      </div>
    </div>
  );
}