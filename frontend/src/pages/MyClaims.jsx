import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your claims.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/claims/my",
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

    fetchClaims();
  }, []);

  if (loading) {
    return <h1>Loading your claims...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>My Claims</h1>

      {claims.length === 0 ? (
        <p>You haven't submitted any claims yet.</p>
      ) : (
        <div>
          {claims.map((claim) => (
            <div key={claim._id}>
              <h2>
                {claim.item
                  ? claim.item.title
                  : "Item no longer available"}
              </h2>

              {claim.item && (
                <>
                  <p>
                    <strong>Type:</strong> {claim.item.type}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {claim.item.location}
                  </p>

                  <p>
                    <strong>Your Answer:</strong>{" "}
                    {claim.answer}
                  </p>
                </>
              )}

              <p>
                <strong>Claim Status:</strong>{" "}
                {claim.status}
              </p>

              {claim.item && (
                <Link to={`/items/${claim.item._id}`}>
                  View Item
                </Link>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClaims;