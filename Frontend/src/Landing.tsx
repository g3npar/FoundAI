import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import "./navbar.css";
import axios from "axios";
import "./post.css";
export default function Landing() {
  axios.defaults.withCredentials = true;

  const [searchText, setSearchText] = useState({
    searchText: "",
  });
  const [uploadIsOpen, setUploadIsOpen] = useState(false);
  const [addPostIsOpen, setAddPostIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [matchingPosts, setMatchingPosts] = useState<any>([]);
  const [matchingPostsText, setMatchingPostsText] = useState<any>([]);
  const [postType, setPostType] = useState("lost"); // true: found , false: lost

  const [s3Link, setS3Link] = useState({
    s3_url:
      "https://picture.s3.us-east-2.amazonaws.com/lost/Screen_Shot_2023-05-09_at_9.44.45_AM.png",
  });

  useEffect(() => {
    console.log(searchText);
    console.log(uploadIsOpen);
  }, [searchText, uploadIsOpen]);

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSearch = async () => {
    try {
      await axios
        .post("http://127.0.0.1:8000/api/search_text_" + postType, searchText)
        .then((response) => {
          setMatchingPostsText(response.data);
          console.log(response.data);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageCompare = async (e) => {
    console.log(selectedFile);
    if (!selectedFile) return;
    e.preventDefault();
    const formData = new FormData(undefined);
    formData.append("file", selectedFile);

    try {
      await axios
        .post("http://127.0.0.1:8000/api/upload_lost", formData)
        .then((response) => setS3Link({ s3_url: response.data.s3_url }));

      console.log(s3Link.s3_url);

      await axios
        .post("http://127.0.0.1:8000/api/search_photo_found", s3Link)
        .then((response) => {
          setMatchingPostsText(response.data);
          console.log(response.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const [postData, setPostData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/get_found");
        console.log(res.data);
        setMatchingPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  const handleChangePostType = (e) => {
    setPostType(e.target.value);
  };

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-logo">FoundAI</div>
        <div className="navbar-pages">
          <div onClick={(e) => setAddPostIsOpen(true)} className="navbar-btn">
            <Link to={"/addPost"}>Post</Link>
            <AddIcon color="gray.300" onClick={(e) => setAddPostIsOpen(true)} />
          </div>
        </div>
      </div>
      <div className="landing-wrapper">
        <div className="navbar"></div>
        <div className="landing-container">
          <h1>Lost something? We'll help you find it.</h1>
          <div>
            {matchingPosts.map((x) => {
              <div>{x.title}</div>;
              <div>{x.description}</div>;
            })}
          </div>
          <div className="landing-search-container">
            <InputGroup className="input-group">
              <select
                className="select"
                name="type"
                onChange={(e) => handleChangePostType(e)}
              >
                <option value="lost">I found</option>
                <option value="found">I lost</option>
              </select>{" "}
              <Input
                size="lg"
                w="100%"
                h="50px"
                pl={10}
                borderRadius={5}
                value={searchText.searchText}
                onChange={(e) => setSearchText({ searchText: e.target.value })}
              />
              <InputRightElement
                gap={20}
                justifyContent={"center"}
                pr={10}
                pt={20}
              >
                <AddIcon
                  color="gray.300"
                  onClick={(e) => setUploadIsOpen(true)}
                />
                <SearchIcon color="gray.300" onClick={handleSearch} />
              </InputRightElement>
            </InputGroup>
          </div>
        </div>
      </div>
      <div className="wrapper">
        {matchingPostsText.map((post) => (
          <div className="post">
            <div className="col-title">
              <div className="post-title">{post.title}</div>
              <div className="post-picture">
                <img
                  className="picture"
                  src={post.picture}
                  alt={post.picture}
                />
              </div>
            </div>
            <div className="col-description">
              <div className="post-description">{post.description}</div>
            </div>
            <div className="col-info">
              <div className="post-email">{post.email}</div>
              <div className="post-number">{post.number}</div>
              <div className="post-location">{post.location}</div>
              <div className="post-date">{post.date}</div>
              <div className="post-time">{post.time}</div>
            </div>
          </div>
        ))}
      </div>
      {uploadIsOpen && (
        <div className="upload-image-container">
          <div className="upload-image">
            <form onSubmit={handleImageCompare} className="inputs">
              <label className="search-file-label" htmlFor="custom-file-input">
                <h2>Upload File</h2>

                <button
                  className="file-submit"
                  onClick={(e) => setUploadIsOpen(false)}
                >
                  X
                </button>
              </label>
              <button type="submit">Upload</button>
              <input
                id="custom-file-input"
                className="custom-file-input"
                type="file"
                onChange={handleFileChange}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
