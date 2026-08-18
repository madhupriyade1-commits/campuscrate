import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyPosts.css";

function MyPosts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/items/${id}`,
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
      alert("Failed to delete the post.");
    }
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/items/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch your posts");
        }

        const data = await response.json();

        setItems(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load your posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="my-posts-page">
        <h1>Loading your posts...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-posts-page">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="my-posts-page">

      {/* PAGE HEADER */}
      <div className="my-posts-header">
        <h1>My Posts</h1>
        <p>
          Manage the lost and found items you have posted.
        </p>
      </div>

      {/* NO POSTS */}
      {items.length === 0 ? (
        <div className="my-posts-empty">
          <h2>No posts yet</h2>
          <p>
            You haven't posted any lost or found items yet.
          </p>

          <div className="my-posts-empty-actions">
            <Link to="/post/lost">
              Post Lost Item
            </Link>

            <Link to="/post/found">
              Post Found Item
            </Link>
          </div>
        </div>
      ) : (

        /* POSTS GRID */
        <div className="my-posts-grid">

          {items.map((item) => (

            /* ONE POST CARD */
            <div
              className="my-post-card"
              key={item._id}
            >

              {/* IMAGE */}
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="my-post-image"
                />
              ) : (
                <div className="my-post-no-image">
                  No Image
                </div>
              )}

              {/* POST INFORMATION */}
              <div className="my-post-card-content">

                <div className="my-post-type">
                  {item.type}
                </div>

                <h2>{item.title}</h2>

                <p>
                  <strong>Category:</strong>{" "}
                  {item.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {item.location}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`my-post-status ${item.status}`}
                  >
                    {item.status}
                  </span>
                </p>

                {/* BUTTONS */}
                <div className="my-post-actions">

                  <Link
                    to={`/items/${item._id}`}
                    className="my-post-view"
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/items/${item._id}/edit`}
                    className="my-post-edit"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    className="my-post-delete"
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

export default MyPosts;