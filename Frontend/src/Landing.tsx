import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { FileUpload } from "primereact/fileupload";

import "./styles.css";
import "./navbar.css";
import AddPost from "./AddPost";
import axios from "axios";

export default function Landing() {
  axios.defaults.withCredentials = true;

  const [searchText, setSearchText] = useState({
    searchText: "",
  });
  const [uploadIsOpen, setUploadIsOpen] = useState(false);
  const [addPostIsOpen, setAddPostIsOpen] = useState(false);

  useEffect(() => {
    console.log(searchText);
    console.log(uploadIsOpen);
  }, [searchText, uploadIsOpen]);

  const handleSearch = async () => {
    try {
      await axios
        .post("http://127.0.0.1:8000/api/search_text_lost", searchText)
        .then((response) => console.log(response.data));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-logo">FoundAI</div>
        <div className="navbar-pages">
          <div onClick={(e)=>setAddPostIsOpen(true)} className="navbar-btn">
            Post
            <AddIcon color="gray.300" onClick={(e) => setAddPostIsOpen(true)} />
          </div>
        </div>
      </div>
      <div className="landing-wrapper">
        <div className="navbar"></div>
        <div className="landing-container">
          <h1>Lost something? We'll help you find it.</h1>
          <div className="landing-search-container">
            <InputGroup>
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
      {uploadIsOpen && (
        <div className="upload-image-container">
          <div className="upload-image">
            <label htmlFor="custom-file-input">
              <h2>Upload File</h2>
              <button
                className="file-submit"
                onClick={(e) => setUploadIsOpen(false)}
              >
                X
              </button>
            </label>
            <input
              id="custom-file-input"
              className="custom-file-input"
              type="file"
            />
          </div>
        </div>
      )}
      {addPostIsOpen && (
        <>
          <AddPost />{" "}
          <button
            className="file-submit"
            onClick={(e) => setUploadIsOpen(false)}
          >
            X
          </button>{" "}
        </>
      )}
    </>
  );
}
