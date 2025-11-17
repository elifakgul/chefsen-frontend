import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./blogdetay.css";

function BlogDetay() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/blogs/${id}/detail/`);
        setBlog(response.data);
      } catch (error) {
        console.error("Blog detaylarını alırken hata oluştu:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDeleteBlog = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}/detail/`, {
        headers: { Authorization: `Token ${token}` },
      });

      alert("Blog silindi!");
      navigate("/bloglar");
    } catch (error) {
      console.error("Blog silme hatası:", error);
      alert("Bu blogu silme yetkiniz yok!");
    }
  };

  return (
    <div className="blogdetay-container">
      {blog ? (
        <>
          <div className="blogdetay-header">
            {blog.image && <img src={blog.image} alt={blog.title} className="blogdetay-image" />}
            <div className="blogdetay-meta">
              <h1 className="blogdetay-title">{blog.title}</h1>
              <p className="blogdetay-desc">{blog.title} hakkındaki düşüncelerimizi bu yazıda bulabilirsiniz.</p>
              <p className="blogdetay-author"><strong>Yazar:</strong> {blog.user}</p>
            </div>
          </div>

          <div className="blogdetay-content">
            <p style={{ whiteSpace: "pre-line" }}>{blog.content}</p>
          </div>

          {username === blog.user && (
            <div style={{ marginTop: "20px" }}>
              <button className="blogdetay-delete" onClick={handleDeleteBlog}>Blogu Sil</button>
            </div>
          )}

<button className="tarifdetay-btn" onClick={() => navigate(-1)}>
  Geri Dön
</button>

        </>
      ) : (
        <p className="loading-text">Blog yükleniyor...</p>
      )}
    </div>
  );
}

export default BlogDetay;
