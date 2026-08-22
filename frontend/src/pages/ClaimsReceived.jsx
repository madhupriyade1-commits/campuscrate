import { useEffect, useState } from "react";
import "./ClaimsReceived.css";

function ClaimsReceived() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view received claims.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/claims/received",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load received claims"
        );
      }

      setClaims(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // Approve or reject a claim
  const updateClaim = async (claimId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://campuscrate-t5ls.onrender.com/api/claims/${claimId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update claim"
        );
      }

      await fetchClaims();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Mark item as returned
  const markAsReturned = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure this item has been returned?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `https://campuscrate-t5ls.onrender.com/api/items/${itemId}`,
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

      setClaims((previousClaims) =>
        previousClaims.map((claim) =>
          claim.item && claim.item._id === itemId
            ? {
                ...claim,
                item: {
                  ...claim.item,
                  status: "returned",
                },
              }
            : claim
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="claims-received-page">
        <h1>Loading received claims...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="claims-received-page">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="claims-received-page">

      {/* HEADER */}
      <div className="claims-received-header">
        <h1>Claims Received</h1>

        <p>
          Review and manage claims submitted for your items.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="claims-received-empty">
          <h2>No claims yet</h2>

          <p>
            No one has claimed your items yet.
          </p>
        </div>
      ) : (
        <div className="claims-received-grid">

          {claims.map((claim) => (
            <div
              className="received-claim-card"
              key={claim._id}
            >

              {/* IMAGE */}
              {claim.item?.photoUrl ? (
                <img
                  src={claim.item.photoUrl}
                  alt={claim.item.title}
                  className="received-claim-image"
                />
              ) : (
                <div className="received-claim-no-image">
                  No Image
                </div>
              )}

              {/* CONTENT */}
              <div className="received-claim-content">

                {/* TITLE + CLAIM STATUS */}
                <div className="received-claim-top">

                  <h2>
                    {claim.item
                      ? claim.item.title
                      : "Item no longer available"}
                  </h2>

                  <span
                    className={`received-claim-status status-${claim.status}`}
                  >
                    {claim.status}
                  </span>

                </div>

                {/* CLAIMANT */}
                <div className="received-claim-details">

                  <p>
                    <strong>Claimant</strong>
                    <span>
                      {claim.claimant?.name || "Unknown"}
                    </span>
                  </p>

                  <p>
                    <strong>Email</strong>
                    <span>
                      {claim.claimant?.email || "Not available"}
                    </span>
                  </p>

                  <p>
                    <strong>Verification Answer</strong>
                    <span>
                      {claim.answer}
                    </span>
                  </p>

                  <p>
                    <strong>Item Status</strong>
                    <span>
                      {claim.item?.status || "Unknown"}
                    </span>
                  </p>

                </div>

                {/* APPROVE / REJECT */}
                {claim.status === "pending" && (
                  <div className="claim-actions">

                    <button
                      className="approve-button"
                      onClick={() =>
                        updateClaim(
                          claim._id,
                          "approved"
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="reject-button"
                      onClick={() =>
                        updateClaim(
                          claim._id,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>
                )}

                {/* MARK AS RETURNED */}
                {claim.status === "approved" &&
                  claim.item &&
                  claim.item.status === "claimed" && (

                    <button
                      className="returned-button"
                      onClick={() =>
                        markAsReturned(
                          claim.item._id
                        )
                      }
                    >
                      Mark as Returned
                    </button>
                  )}

                {/* RETURNED */}
                {claim.item?.status === "returned" && (
                  <div className="returned-message">
                    ✓ Item Returned
                  </div>
                )}

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default ClaimsReceived;
