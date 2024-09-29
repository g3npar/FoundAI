import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Lost from "./Lost";
import Found from "./Found";
import AddPost from "./AddPost";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/found" element={<Found />}></Route>
          <Route path="/lost" element={<Lost />}></Route>
          <Route path="/addPost" element={<AddPost />}></Route>

        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
