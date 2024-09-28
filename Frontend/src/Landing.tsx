import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { FileUpload } from 'primereact/fileupload';


import Navbar from "./Navbar";
import "./styles.css";

export default function Landing() {
  const [search, setSearch] = useState("");
  const [uploadIsOpen, setUploadIsOpen] = useState(false);

  useEffect(() => {
    console.log(search);
    console.log(uploadIsOpen);
  }, [search, uploadIsOpen]);
  return (
    <>
      <Navbar />
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputRightElement gap={20} justifyContent={"center"} pr={10} pt={20}>
                <AddIcon color="gray.300" onClick={(e) => setUploadIsOpen(true)}/>
                <SearchIcon color="gray.300"/>
              </InputRightElement>
            </InputGroup>
            
          </div>
        </div>
      </div>
      {uploadIsOpen &&
        <div className="upload-image-container">
          <div className="upload-image">
            <input className="custom-file-input" type="file"/>
            <button onClick={(e) => setUploadIsOpen(false)}>X</button>
          </div>
        </div>
      }
    </>
  );
}
