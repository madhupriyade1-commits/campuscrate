import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <h1>Loading items...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Lost & Found Items</h1>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        items.map((item) => (
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
          </div>
        ))
      )}
    </div>
  );
}

export default Items;