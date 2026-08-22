import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostItem.css";

function PostItem({ type }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    claimQuestion: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isLost = type === "lost";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPhoto(null);
      setPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      setPhoto(null);
      setPreview(null);
      return;
    }

    setError("");
    setPhoto(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login before posting an item.");
        setLoading(false);
        return;
      }

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("date", formData.date);
      data.append("claimQuestion", formData.claimQuestion);
      data.append("type", type);
      data.append("tags", JSON.stringify([]));

      if (photo) {
        data.append("photo", photo);
      }

      const response = await fetch(
        "https://campuscrate-t5ls.onrender.com/api/items",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to post item"
        );
      }

      setSuccess(
        `${isLost ? "Lost" : "Found"} item posted successfully!`
      );

      setTimeout(() => {
        navigate("/items");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-page">
      <div className="post-container">

        <div className="post-header">
          <span className="post-icon">
            {isLost ? "🔍" : "📦"}
          </span>

          <h1>
            Post {isLost ? "Lost" : "Found"} Item
          </h1>

          <p>
            {isLost
              ? "Tell us about something you've lost on campus."
              : "Help someone find something you've discovered on campus."}
          </p>
        </div>

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        <form
          className="post-form"
          onSubmit={handleSubmit}
        >

          <div className="form-section">
            <h2>Item Information</h2>

            <div className="form-group">
              <label>Item Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={
                  isLost
                    ? "e.g. Black Wallet"
                    : "e.g. Blue Water Bottle"
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item, its appearance, brand, color, unique features, etc."
                rows="5"
                required
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Library"
                  required
                />
              </div>

            </div>

            <div className="form-group">
              <label>
                {isLost
                  ? "Date Lost"
                  : "Date Found"}
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Item Photo</h2>

            <p className="section-description">
              Adding a photo can make it easier to identify the item.
            </p>

            <label className="upload-box">

              {preview ? (
                <img
                  src={preview}
                  alt="Item preview"
                  className="image-preview"
                />
              ) : (
                <>
                  <span className="upload-icon">📷</span>

                  <strong>
                    Click to upload a photo
                  </strong>

                  <span>
                    PNG, JPG or JPEG · Maximum 5 MB
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />

            </label>

            {photo && (
              <p className="selected-file">
                Selected: {photo.name}
              </p>
            )}
          </div>

          <div className="form-section">
            <h2>Claim Verification</h2>

            <p className="section-description">
              This question will be shown to people who try to claim
              this item. Choose something only the real owner would know.
            </p>

            <div className="form-group">
              <label>Verification Question</label>

              <input
                type="text"
                name="claimQuestion"
                value={formData.claimQuestion}
                onChange={handleChange}
                placeholder="e.g. What color is the cap?"
                required
              />
            </div>
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/items")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Posting..."
                : `Post ${isLost ? "Lost" : "Found"} Item`}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default PostItem;