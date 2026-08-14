import { useEffect, useState } from "react";

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
        "http://localhost:5000/api/claims/received",
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

  const updateClaim = async (claimId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/claims/${claimId}`,
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

      // Refresh the list
      fetchClaims();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return <h1>Loading received claims...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Claims Received</h1>

      {claims.length === 0 ? (
        <p>No one has claimed your items yet.</p>
      ) : (
        <div>
          {claims.map((claim) => (
            <div key={claim._id}>
              <h2>
                {claim.item
                  ? claim.item.title
                  : "Item no longer available"}
              </h2>

              <p>
                <strong>Claimant:</strong>{" "}
                {claim.claimant?.name || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {claim.claimant?.email || "Not available"}
              </p>

              <p>
                <strong>Verification Answer:</strong>{" "}
                {claim.answer}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {claim.status}
              </p>

              {claim.status === "pending" && (
                <div>
                  <button
                    onClick={() =>
                      updateClaim(claim._id, "approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateClaim(claim._id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClaimsReceived;