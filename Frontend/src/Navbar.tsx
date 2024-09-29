import "./navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="navbar-container">
        <div className="navbar-logo">FindAI</div>
        <div className="navbar-pages">
          <Link
            to={"/dashboard/"}
            style={{ textDecoration: "inherit", color: "inherit" }}
          >
            <div className="navbar-btn">Post</div>
          </Link>
        </div>
      </div>
    </>
  );
}
