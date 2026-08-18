import "./Items.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (type) params.append("type", type);
      if (category) params.append("category", category);
      if (location) params.append("location", location);
      if (status) params.append("status", status);

      if (search.trim()) {
        params.append("q", search.trim());
      }

      const response = await fetch(
        `http://localhost:5000/api/items?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to load items");
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

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchItems();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [type, category, location, status, search]);

  const clearFilters = () => {
    setType("");
    setCategory("");
    setLocation("");
    setStatus("");
    setSearch("");
  };

  const getStatusClass = (status) => {
    if (status === "returned") return "status-returned";
    if (status === "claimed") return "status-claimed";
    return "status-active";
  };

  if (error) {
    return (
      <div className="browse-page">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="browse-page">

      {/* HEADER */}
      <div className="browse-header">
        <div>
          <h1>Browse Items</h1>
          <p>
            Search through lost and found items around campus.
          </p>
        </div>
      </div>


      {/* FILTERS */}
      <div className="filters-card">

        <div className="search-box">
          <label>Search</label>

          <input
            type="text"
            placeholder="Search title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <div className="filter-group">
          <label>Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Items</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>


        <div className="filter-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="id card">ID Card</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="bottle">Bottle</option>
            <option value="clothing">Clothing</option>
            <option value="bags">Bags</option>
            <option value="keys">Keys</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
        </div>


        <div className="filter-group">
          <label>Location</label>

          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>


        <div className="filter-group">
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="claimed">Claimed</option>
            <option value="returned">Returned</option>
          </select>
        </div>


        <button
          className="clear-filters"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>


      {/* LOADING */}
      {loading && (
        <div className="loading-message">
          Updating results...
        </div>
      )}


      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <div className="empty-state">
          No items found.
        </div>
      )}


      {/* RESULTS */}
      {!loading && items.length > 0 && (
        <div className="items-grid">

          {items.map((item) => (

            <div className="item-card" key={item._id}>

              {/* IMAGE */}

              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="item-image"
                />
              ) : (
                <div className="no-image">
                  No Image
                </div>
              )}


              {/* CONTENT */}

              <div className="item-content">

                <div className="item-type">
                  {item.type}
                </div>

                <h2>{item.title}</h2>

                <div className="item-details">

                  <p>
                    <strong>Category:</strong>{" "}
                    {item.category}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {item.location}
                  </p>

                </div>


                <div className="item-footer">

                  <span
                    className={`status ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                  <Link
                    className="view-details"
                    to={`/items/${item._id}`}
                  >
                    View Details →
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Items;