import React, { useState, useEffect } from "react";
import { djangoApi } from "../api"; // baseURL: domain (örn: https://chefsen-backend-1.onrender.com)
import { useNavigate } from "react-router-dom";
import "./bloglar.css";

function Bloglar() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // 📌 BLOG LİSTESİNİ ÇEK
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Django: path('api/blogs/', ...)
        // Tam URL prod'da: https://chefsen-backend-1.onrender.com/api/blogs/
        const response = await djangoApi.get("/api/blogs/");
        setBlogs(response.data);
      } catch (error) {
        console.error("Blogları alırken hata oluştu:", error);
      }
    };

    fetchBlogs();
  }, []);

  // 📌 BLOG DÜZENLE
  const handleEditBlog = (blog) => {
    navigate("/blog-ekle", { state: { blog } });
  };

  // 📌 BLOG SİL
  const handleDeleteBlog = async (blogId) => {
    try {
      // Tam URL: .../api/blogs/{id}/
      await djangoApi.delete(`/api/blogs/${blogId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    } catch (error) {
      console.error("Blog silme hatası:", error);
      alert("Bu blogu silme yetkiniz yok!");
    }
  };

  // 🔢 SAYFALAMA
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const renderPageButton = (i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i)}
      style={{
        margin: "5px",
        padding: "8px 14px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: currentPage === i ? "#c0392b" : "#fff",
        color: currentPage === i ? "#fff" : "#333",
        fontWeight: currentPage === i ? "bold" : "normal",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      {i}
    </button>
  );

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(renderPageButton(i));
    } else {
      if (currentPage > 2) {
        pages.push(renderPageButton(1));
        if (currentPage > 3) pages.push(<span key="s-dots">...</span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(renderPageButton(i));

      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) pages.push(<span key="e-dots">...</span>);
        pages.push(renderPageButton(totalPages));
      }
    }

    return pages;
  };

  return (
    <div className="tarifler-container">
      <h1 className="tarifler-title"> Bloglar ✍️</h1>

      <div className="tarifler-grid">
        {currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="tarif-card"
            onClick={() => navigate(`/blog/${blog.id}`)}
          >
            {blog.image && (
              <img src={blog.image} alt={blog.title} className="tarif-image" />
            )}

            <div className="tarif-card-content">
              <h3 className="tarif-title">{blog.title}</h3>
              <p className="tarif-category">Yazar: {blog.user}</p>

              {username && blog.user === username && (
                <div className="tarif-buttons">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBlog(blog);
                    }}
                  >
                    Güncelle
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlog(blog.id);
                    }}
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        {renderPageNumbers()}
      </div>
    </div>
  );
}

export default Bloglar;
