import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    claimQuestion: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get the existing item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/items/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch item");
        }

        const item = await response.json();

        setForm({
          title: item.title || "",
          description: item.description || "",
          category: item.category || "",
          location: item.location || "",
          date: item.date
            ? item.date.substring(0, 10)
            : "",
          claimQuestion: item.claimQuestion || "",
        });
      } catch (error) {
        console.error(error);
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/items/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update item");
      }

      alert("Post updated successfully!");

      navigate(`/items/${id}`);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error && !form.title) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Edit Post</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Category</label>
          <br />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Date</label>
          <br />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Claim Question</label>
          <br />
          <input
            name="claimQuestion"
            value={form.claimQuestion}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => navigate(`/items/${id}`)}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditItem;