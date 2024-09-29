import { useEffect, useState } from "react";
import axios from "axios";

export default function AddPost() {
  const [postType, setPostType] = useState("insert_found"); // true: found , false: lost
  const [post, setPost] = useState({
    title: "",
    description: "",
    email: "",
    number: "",
    location: "",
    date: "",
    time: "",
    picture: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangePostType = (e) => {
    setPostType(e.target.value);
  };

  const addPost = async (e) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/" + postType, post);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    console.log(selectedFile);
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData);
    try {
      await axios.post("http://127.0.0.1:8000/api/upload_found", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <>
      <div className="add-post-container">
        <h1>Add Post</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <select
              className="table-value"
              name="type"
              onChange={(e) => handleChangePostType(e)}
            >
              <option value="insert_found">Found Item</option>
              <option value="insert_lost">Lost Item</option>
            </select>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={post.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={post.description}
              onChange={handleChange}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={post.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="number"
              placeholder="Number"
              value={post.number}
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={post.location}
              onChange={handleChange}
            />
            <input
              type="date"
              name="date"
              placeholder="Date"
              value={post.date}
              onChange={handleChange}
            />
            <input
              type="time"
              name="time"
              placeholder="Time"
              value={post.time}
              onChange={handleChange}
            />
            <input
              type="file"
              name="picture"
              placeholder="Picture"
              value={post.picture}
              onChange={handleFileChange}
            />
            <button type="submit" onClick={addPost}>
              Add Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
