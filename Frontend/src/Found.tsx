import { useState, useEffect } from "react";
import axios from "axios";
import "./post.css";

export default function Found() {
  const [postData, setPostData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/get_found");
        console.log(res.data);
        setPostData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log(postData);
  }, [postData]);

  return (
    <>
      <div className="wrapper">
        <h1>Found</h1>
        {postData.map((post) => (
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
    </>
  );
}
