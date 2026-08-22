import { useEffect, useState } from "react";
import "./MyClaims.css";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your claims.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/claims/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load your claims"
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
    fetchMyClaims();
  }, []);

  if (loading) {
    return (
      <div className="myclaims-page">
        <h1>My Claims</h1>
        <p className="myclaims-message">
          Loading your claims...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myclaims-page">
        <h1>My Claims</h1>
        <p className="myclaims-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="myclaims-page">
      <div className="myclaims-header">
        <h1>My Claims</h1>
        <p>
          Track the items you have submitted claims for.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="no-claims">
          <h2>No Claims Yet</h2>
          <p>
            You haven't submitted any claims yet.
          </p>
        </div>
      ) : (
        <div className="claims-list">
          {claims.map((claim) => (
            <div className="claim-card" key={claim._id}>
              
              <div className="claim-card-header">
                <div>
                  <h2>
                    {claim.item
                      ? claim.item.title
                      : "Item no longer available"}
                  </h2>

                  {claim.item && (
                    <p className="claim-location">
                      📍 {claim.item.location || "Location unavailable"}
                    </p>
                  )}
                </div>

                <span
                  className={`claim-status ${claim.status}`}
                >
                  {claim.status}
                </span>
              </div>

              <div className="claim-details">
                <p>
                  <strong>Your Verification Answer:</strong>
                </p>

                <p className="verification-answer">
                  {claim.answer}
                </p>
              </div>

              {claim.item && (
                <div className="item-status">
                  <strong>Item Status:</strong>{" "}
                  <span className={`item-${claim.item.status}`}>
                    {claim.item.status}
                  </span>
                </div>
              )}

              <div className="claim-message">
                {claim.status === "pending" && (
                  <p>
                    ⏳ Your claim is waiting for the item
                    owner to review it.
                  </p>
                )}

                {claim.status === "approved" &&
                  claim.item?.status === "claimed" && (
                    <p>
                      ✓ Your claim has been approved. Please
                      contact the item owner to arrange the
                      return.
                    </p>
                  )}

                {claim.status === "approved" &&
                  claim.item?.status === "returned" && (
                    <p>
                      ✓ This item has been returned to you.
                    </p>
                  )}

                {claim.status === "rejected" && (
                  <p>
                    ✕ Unfortunately, your claim was rejected.
                  </p>
                )}
              </div>

              <div className="claim-footer">
                <small>
                  Claim ID: {claim._id}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClaims;
