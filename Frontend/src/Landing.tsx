import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./styles.css";

export default function Landing() {
  const [search, setSearch] = useState("");
  useEffect(() => {
    console.log(search);
  }, [search]);
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
              <InputRightElement justifyContent={"center"} pr={10} pt={20}>
                <SearchIcon color="gray.300" />
              </InputRightElement>
            </InputGroup>
          </div>
        </div>
      </div>
    </>
  );
}
