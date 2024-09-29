import { useEffect, useState } from "react";
import axios from "axios";
import "./addpost.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate, Link, redirect } from "react-router-dom";
import { ArrowBackIcon, AddIcon } from "@chakra-ui/icons";

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
  const [imageIsUploaded, setImageIsUploaded] = useState(false);

  const handleChange = (e) => {
    setPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangePostType = (e) => {
    setPostType(e.target.value);
  };

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    console.log(selectedFile);
    if (!selectedFile) return;
    e.preventDefault();
    const formData = new FormData(undefined);
    formData.append("file", selectedFile);
    console.log(formData);
    console.log(postType);

    try {
      await axios
        .post(
          "http://127.0.0.1:8000/api/upload_" + postType.split("_")[1],
          formData
        )
        .then((response) => {
          setPost((prev) => ({
            ...prev,
            picture: response.data.s3_url,
          }));
          console.log(response);
          setImageIsUploaded(!imageIsUploaded);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const makePost = async () => {
      if(post.title == "") return
      try {
        await axios.post("http://127.0.0.1:8000/api/" + postType, post);
      } catch (err) {
        console.log(err);
      }
    };
    console.log(post);

    makePost();
  }, [imageIsUploaded]);

  // useEffect(() => {
  //   const addPost = async () => {
  //     try {
  //       await axios.post("http://127.0.0.1:8000/api/" + postType, post);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   addPost();
  // }, [imageIsUploaded]);

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-logo">FoundAI</div>
        <div className="navbar-pages">
          <div className="navbar-btn">
            <Link to={"/"}>Post</Link>
            <AddIcon color="gray.300" />
          </div>
        </div>
      </div>
      <div className="add-post-container">
        <div className="add-post">
          <div className="close-add-post">
            <Link to={"/"}>
              <ArrowBackIcon />
            </Link>
          </div>
          <h1>Add Post</h1>
          <form onSubmit={handleSubmit} className="inputs">
            <div className="row">
              <select
                className="select"
                name="type"
                onChange={(e) => handleChangePostType(e)}
              >
                <option value="insert_found">Found Item</option>
                <option value="insert_lost">Lost Item</option>
              </select>
              <input
                className="title-input"
                type="text"
                name="title"
                placeholder="Title"
                value={post.title}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <textarea
                className="description-input"
                name="description"
                placeholder="Description"
                value={post.description}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <input
                className="email-input"
                type="text"
                name="email"
                placeholder="Email"
                value={post.email}
                onChange={handleChange}
              />
              <input
                className="number-input"
                type="text"
                name="number"
                placeholder="Number"
                value={post.number}
                onChange={handleChange}
              />
              <input
                className="location-input"
                type="text"
                name="location"
                placeholder="Location"
                value={post.location}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <input
                className="date-input"
                type="date"
                name="date"
                placeholder="Date"
                value={post.date}
                onChange={handleChange}
              />
              <input
                className="time-input"
                type="time"
                name="time"
                placeholder="Time"
                value={post.time}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label className="file-label" htmlFor="file-input">
                Upload File
                <FileUploadIcon />
              </label>
              <input
                hidden
                id="file-input"
                className="file-input"
                type="file"
                name="picture"
                placeholder="Picture"
                onChange={handleFileChange}
              />
            </div>
            <div className="row">
              <button className="btn-submit" type="submit">
                Add Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
