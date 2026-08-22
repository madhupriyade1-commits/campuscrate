import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ItemDetail.css";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answer, setAnswer] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // --------------------------------
  // FETCH ITEM
  // --------------------------------

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `https://campuscrate-t5ls.onrender.com/api/items/${id}`
        );

        if (!response.ok) {
          throw new Error("Item not found");
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // --------------------------------
  // SUBMIT CLAIM
  // --------------------------------

  const handleClaim = async (e) => {
    e.preventDefault();

    setClaimMessage("");
    setClaimLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setClaimMessage("Please login before submitting a claim.");
        setClaimLoading(false);
        return;
      }

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/claims",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemId: item._id,
            answer: answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit claim"
        );
      }

      setClaimMessage("Claim submitted successfully!");
      setAnswer("");
    } catch (err) {
      console.error(err);
      setClaimMessage(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  // --------------------------------
  // MARK AS RETURNED
  // --------------------------------

  const handleReturned = async () => {
    const confirmed = window.confirm(
      "Are you sure this item has been returned?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `https://campuscrate-t5ls.onrender.com/api/items/${item._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "returned",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark item as returned"
        );
      }

      setItem(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // --------------------------------
  // REPORT ITEM
  // --------------------------------

  const handleReport = async (e) => {
    e.preventDefault();

    setReportMessage("");
    setReportLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setReportMessage(
          "Please login before reporting an item."
        );
        setReportLoading(false);
        return;
      }

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemId: item._id,
            reason: reportReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit report"
        );
      }

      setReportMessage("Report submitted successfully!");
      setReportReason("");
      setShowReportForm(false);
    } catch (err) {
      console.error(err);
      setReportMessage(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading item...</p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <div className="error-icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            className="back-button"
            onClick={() => navigate("/items")}
          >
            ← Back to Items
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <div className="error-icon">?</div>
          <h2>Item not found</h2>

          <button
            className="back-button"
            onClick={() => navigate("/items")}
          >
            ← Back to Items
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------
  // USER / OWNER CHECK
  // --------------------------------

  const userId = user?._id || user?.id;

  const postedById =
    item.postedBy?._id || item.postedBy;

  const isOwner =
    user &&
    postedById &&
    String(postedById) === String(userId);

  const isAvailable =
    item.status !== "claimed" &&
    item.status !== "returned";

  const canClaim =
    item.type === "found" &&
    isAvailable &&
    user &&
    !isOwner;

  // --------------------------------
  // DATE
  // --------------------------------

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not specified";

  // --------------------------------
  // IMAGE
  // --------------------------------

  const imageUrl = item.photoUrl || item.photo;

  return (
    <div className="detail-page">

      {/* TOP NAVIGATION */}

      <div className="detail-container">

        <button
          className="back-link"
          onClick={() => navigate("/items")}
        >
          ← Back to Items
        </button>

        {/* MAIN CONTENT */}

        <div className="detail-layout">

          {/* LEFT - IMAGE */}

          <div className="detail-image-section">

            <div className="detail-image-wrapper">

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="detail-image"
                />
              ) : (
                <div className="no-image">
                  <div className="no-image-icon">📷</div>
                  <p>No image available</p>
                </div>
              )}

              <span
                className={`type-badge ${
                  item.type === "lost"
                    ? "lost-badge"
                    : "found-badge"
                }`}
              >
                {item.type === "lost" ? "LOST" : "FOUND"}
              </span>

            </div>

          </div>

          {/* RIGHT - INFORMATION */}

          <div className="detail-info">

            {/* TITLE */}

            <div className="title-section">

              <div className="title-row">

                <h1>{item.title}</h1>

                <span
                  className={`status-badge status-${item.status}`}
                >
                  {item.status}
                </span>

              </div>

              <p className="item-subtitle">
                {item.type === "lost"
                  ? "Someone is looking for this item"
                  : "Someone found this item"}
              </p>

            </div>

            {/* DETAILS */}

            <div className="info-grid">

              <div className="info-card">

                <span className="info-icon">📍</span>

                <div>
                  <span className="info-label">
                    Location
                  </span>

                  <span className="info-value">
                    {item.location}
                  </span>
                </div>

              </div>

              <div className="info-card">

                <span className="info-icon">📅</span>

                <div>
                  <span className="info-label">
                    Date
                  </span>

                  <span className="info-value">
                    {formattedDate}
                  </span>
                </div>

              </div>

              <div className="info-card">

                <span className="info-icon">🏷️</span>

                <div>
                  <span className="info-label">
                    Category
                  </span>

                  <span className="info-value">
                    {item.category}
                  </span>
                </div>

              </div>

              <div className="info-card">

                <span className="info-icon">📌</span>

                <div>
                  <span className="info-label">
                    Status
                  </span>

                  <span className="info-value capitalize">
                    {item.status}
                  </span>
                </div>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="description-section">

              <h2>Description</h2>

              <p>
                {item.description ||
                  "No description provided."}
              </p>

            </div>

            {/* OWNER */}

            {isOwner && (
              <div className="owner-notice">
                <span>✓</span>

                <div>
                  <strong>This is your post</strong>
                  <p>
                    You cannot claim your own item.
                  </p>
                </div>
              </div>
            )}

            {/* RETURN BUTTON */}

            {isOwner && item.status === "claimed" && (
              <div className="return-section">

                <h2>Item has been claimed</h2>

                <p>
                  If the item has been successfully
                  returned to its owner, mark it as
                  returned.
                </p>

                <button
                  className="return-button"
                  onClick={handleReturned}
                >
                  ✓ Mark as Returned
                </button>

              </div>
            )}

            {/* CLAIM SECTION */}

            {canClaim && (
              <div className="claim-card">

                <div className="claim-header">

                  <div className="claim-icon">
                    ?
                  </div>

                  <div>
                    <h2>Claim this item</h2>

                    <p>
                      Answer the verification question
                      to prove that this item belongs to
                      you.
                    </p>
                  </div>

                </div>

                <div className="verification-box">

                  <span className="verification-label">
                    Verification Question
                  </span>

                  <p>
                    {item.claimQuestion ||
                      "Please describe a unique detail about the item."}
                  </p>

                </div>

                <form onSubmit={handleClaim}>

                  <label htmlFor="claim-answer">
                    Your Answer
                  </label>

                  <input
                    id="claim-answer"
                    type="text"
                    value={answer}
                    onChange={(e) =>
                      setAnswer(e.target.value)
                    }
                    placeholder="Enter your answer..."
                    required
                  />

                  <button
                    type="submit"
                    className="claim-button"
                    disabled={claimLoading}
                  >
                    {claimLoading
                      ? "Submitting..."
                      : "Submit Claim"}
                  </button>

                </form>

                {claimMessage && (
                  <div
                    className={`message ${
                      claimMessage.includes(
                        "successfully"
                      )
                        ? "success-message"
                        : "error-message"
                    }`}
                  >
                    {claimMessage}
                  </div>
                )}

              </div>
            )}

            {/* LOGIN MESSAGE */}

            {item.type === "found" &&
              isAvailable &&
              !user && (
                <div className="login-notice">

                  <p>
                    Please login to submit a claim
                    for this item.
                  </p>

                  <button
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>

                </div>
              )}

            {/* UNAVAILABLE */}

            {!isAvailable && (
              <div className="unavailable-card">

                <span className="unavailable-icon">
                  ✓
                </span>

                <div>
                  <h3>
                    This item is no longer available
                  </h3>

                  <p>
                    {item.status === "returned"
                      ? "This item has been successfully returned to its owner."
                      : "This item has already been claimed."}
                  </p>
                </div>

              </div>
            )}

            {/* REPORT */}

            {user && !isOwner && (
              <div className="report-section">

                {!showReportForm ? (
                  <button
                    className="report-button"
                    onClick={() =>
                      setShowReportForm(true)
                    }
                  >
                    ⚑ Report this item
                  </button>
                ) : (
                  <div className="report-card">

                    <div className="report-header">

                      <h2>Report this item</h2>

                      <button
                        type="button"
                        className="close-report"
                        onClick={() => {
                          setShowReportForm(false);
                          setReportReason("");
                        }}
                      >
                        ×
                      </button>

                    </div>

                    <p>
                      Tell us why you think this item
                      should be reviewed.
                    </p>

                    <form onSubmit={handleReport}>

                      <textarea
                        value={reportReason}
                        onChange={(e) =>
                          setReportReason(
                            e.target.value
                          )
                        }
                        placeholder="Explain the reason for reporting this item..."
                        rows="4"
                        required
                      />

                      <div className="report-actions">

                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => {
                            setShowReportForm(false);
                            setReportReason("");
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="submit-report-button"
                          disabled={reportLoading}
                        >
                          {reportLoading
                            ? "Submitting..."
                            : "Submit Report"}
                        </button>

                      </div>

                    </form>

                  </div>
                )}

                {reportMessage && (
                  <div
                    className={`message ${
                      reportMessage.includes(
                        "successfully"
                      )
                        ? "success-message"
                        : "error-message"
                    }`}
                  >
                    {reportMessage}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ItemDetail;
