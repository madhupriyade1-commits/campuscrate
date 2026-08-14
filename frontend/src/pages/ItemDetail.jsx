import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answer, setAnswer] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/items/${id}`
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
        "http://localhost:5000/api/claims",
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
        throw new Error(data.message || "Failed to submit claim");
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

  if (loading) {
    return <h1>Loading item...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>{item.title}</h1>

      <p>
        <strong>Type:</strong> {item.type}
      </p>

      <p>
        <strong>Description:</strong> {item.description}
      </p>

      <p>
        <strong>Category:</strong> {item.category}
      </p>

      <p>
        <strong>Location:</strong> {item.location}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(item.date).toLocaleDateString()}
      </p>

      <p>
        <strong>Status:</strong> {item.status}
      </p>

     {item.type === "found" &&
     user &&
     item.postedBy &&
     String(item.postedBy) !== String(user._id) && (
        <div>
          <h2>Claim this item</h2>

          <p>
            <strong>Verification Question:</strong>{" "}
            {item.claimQuestion}
          </p>

          <form onSubmit={handleClaim}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              required
            />

            <button type="submit" disabled={claimLoading}>
              {claimLoading ? "Submitting..." : "Submit Claim"}
            </button>
          </form>

          {claimMessage && <p>{claimMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default ItemDetail;