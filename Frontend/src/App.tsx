import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./landing";
import Lost from "./Lost";
import Found from "./Found";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/found" element={<Found />}></Route>
          <Route path="/lost" element={<Lost />}></Route>
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
