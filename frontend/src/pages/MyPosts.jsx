import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyPosts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your posts.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/items/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load your posts");
        }

        setItems(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) {
    return <h1>Loading your posts...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>My Posts</h1>

      {items.length === 0 ? (
        <p>You haven't posted any items yet.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item._id}>
              <h2>{item.title}</h2>

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
                <strong>Status:</strong> {item.status}
              </p>

              <Link to={`/items/${item._id}`}>
                View Details
              </Link>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPosts;