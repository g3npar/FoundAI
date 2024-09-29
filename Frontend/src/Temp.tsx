import { useState, useEffect } from "react";
import axios from "axios";
import "./post.css";

export default function Temp({ data }) {
  //const [postData, setPostData] = useState<any[]>([]);

  return (
    <>
      <div className="wrapper">
        <h1>Found</h1>
        {data.map((post) => (
          <div className="post">
            <div className="post-title">{post.title}</div>
            <div className="post-picture">
              <img className="picture" src={post.picture} alt={post.picture} />
            </div>
            <div className="post-description">{post.description}</div>
            <div className="post-email">{post.email}</div>
            <div className="post-number">{post.number}</div>
            <div className="post-location">{post.location}</div>
            <div className="post-date">{post.date}</div>
            <div className="post-time">{post.time}</div>
          </div>
        ))}
      </div>
    </>
  );
}
