import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../admin.css";

function AdminItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchItems = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      setItems(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://campuscrate-t5ls.onrender.com/api/items/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setItems((previousItems) =>
        previousItems.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete item.");
    }
  };

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.title?.toLowerCase().includes(searchText) ||
      item.description?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText) ||
      item.location?.toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "all" || item.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusClass = (status) => {
    if (status === "active") return "status-active";
    if (status === "claimed") return "status-claimed";
    if (status === "returned") return "status-returned";

    return "status-default";
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button
            className="admin-btn admin-btn-primary"
            onClick={fetchItems}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <span className="admin-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Manage Items</h1>

          <p>
            Review, search and manage all lost and found
            items posted on CampusCrate.
          </p>
        </div>

        <div className="admin-count-card">
          <span>Total Items</span>
          <strong>{items.length}</strong>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="admin-filter-card">

        <div className="admin-search">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search items, categories, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="lost">Lost Items</option>
          <option value="found">Found Items</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="returned">Returned</option>
        </select>

      </div>

      {/* RESULT COUNT */}
      <div className="admin-results-info">
        Showing{" "}
        <strong>{filteredItems.length}</strong>{" "}
        of{" "}
        <strong>{items.length}</strong> items
      </div>

      {/* ITEMS */}
      {filteredItems.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">⌕</div>

          <h2>No items found</h2>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="admin-items-grid">

          {filteredItems.map((item) => (
            <div
              className="admin-item-card"
              key={item._id}
            >

              {/* IMAGE */}
              <div className="admin-item-image">

                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                  />
                ) : (
                  <div className="admin-image-placeholder">
                    <span>📦</span>
                  </div>
                )}

                <span
                  className={`item-type-badge ${
                    item.type === "lost"
                      ? "badge-lost"
                      : "badge-found"
                  }`}
                >
                  {item.type}
                </span>

              </div>

              {/* CONTENT */}
              <div className="admin-item-content">

                <div className="admin-item-top">

                  <h2>{item.title}</h2>

                  <span
                    className={`status-badge ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                </div>

                <p className="admin-item-description">
                  {item.description}
                </p>

                <div className="admin-item-details">

                  <div>
                    <span>Category</span>
                    <strong>
                      {item.category}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>
                      {item.location}
                    </strong>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="admin-item-actions">

                  <Link
                    to={`/items/${item._id}`}
                    className="admin-btn admin-btn-view"
                  >
                    View Details
                  </Link>

                  <button
                    className="admin-btn admin-btn-delete"
                    onClick={() =>
                      handleDelete(item._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminItems;
