import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../admin.css";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to resolve this report?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://campuscrate-t5ls.onrender.com/api/reports/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve report");
      }

      setReports((previousReports) =>
        previousReports.map((report) =>
          report._id === id
            ? { ...report, status: "resolved" }
            : report
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to resolve report.");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          Loading reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          {error}
        </div>
      </div>
    );
  }

  const pendingReports = reports.filter(
    (report) => report.status === "pending"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "resolved"
  ).length;

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">
            ADMIN PANEL
          </p>

          <h1>
            Reports
          </h1>

          <p className="admin-subtitle">
            Review and manage reports submitted by students.
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stats">

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Total Reports
          </span>

          <span className="admin-stat-number">
            {reports.length}
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Pending
          </span>

          <span className="admin-stat-number pending-number">
            {pendingReports}
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">
            Resolved
          </span>

          <span className="admin-stat-number resolved-number">
            {resolvedReports}
          </span>
        </div>

      </div>

      {/* REPORT LIST */}
      <div className="admin-section">

        <div className="admin-section-header">
          <h2>
            Submitted Reports
          </h2>

          <span className="admin-count">
            {reports.length} reports
          </span>
        </div>

        {reports.length === 0 ? (

          <div className="admin-empty">
            <div className="admin-empty-icon">
              ✓
            </div>

            <h3>
              No reports
            </h3>

            <p>
              There are currently no reports to review.
            </p>
          </div>

        ) : (

          <div className="reports-list">

            {reports.map((report) => (

              <div
                className="report-card"
                key={report._id}
              >

                {/* REPORT TOP */}
                <div className="report-top">

                  <div>

                    <span className="report-label">
                      REPORTED ITEM
                    </span>

                    <h3>
                      {report.item?.title ||
                        "Deleted Item"}
                    </h3>

                  </div>

                  <span
                    className={`status-badge ${
                      report.status === "resolved"
                        ? "status-resolved"
                        : "status-pending"
                    }`}
                  >
                    {report.status}
                  </span>

                </div>

                {/* REPORT DETAILS */}
                <div className="report-details">

                  <div className="report-detail">

                    <span>
                      Reported by
                    </span>

                    <strong>
                      {report.reportedBy?.name ||
                        "Unknown"}
                    </strong>

                  </div>

                  <div className="report-detail">

                    <span>
                      Reason
                    </span>

                    <strong>
                      {report.reason}
                    </strong>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="report-actions">

                  {report.item && (
                    <Link
                      className="admin-view-button"
                      to={`/items/${report.item._id}`}
                    >
                      View Item
                    </Link>
                  )}

                  {report.status === "pending" && (
                    <button
                      className="admin-resolve-button"
                      onClick={() =>
                        handleResolve(report._id)
                      }
                    >
                      Resolve Report
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminReports;

