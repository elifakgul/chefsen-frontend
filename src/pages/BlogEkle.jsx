import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function BlogEkle() {
  const location = useLocation();
  const existingBlog = location.state?.blog || null;

  const [title, setTitle] = useState(existingBlog ? existingBlog.title : "");
  const [content, setContent] = useState(existingBlog ? existingBlog.content : "");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image); // 📌 Görseli ekliyoruz
    }

    try {
      if (existingBlog) {
        await axios.patch(`http://127.0.0.1:8000/api/blogs/${existingBlog.id}/`, 
        formData, 
        { headers: { Authorization: `Token ${token}`, "Content-Type": "multipart/form-data" } });

        alert("Blog güncellendi!");
      } else {
        await axios.post("http://127.0.0.1:8000/api/blogs/", 
        formData, 
        { headers: { Authorization: `Token ${token}`, "Content-Type": "multipart/form-data" } });

        alert("Blog eklendi!");
      }
      navigate("/blog");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", background: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{existingBlog ? "Blog Güncelle" : "Blog Ekle"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", width: "90%" }}
        />
         <textarea
          placeholder="İçerik"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", width: "90%", height: "150px", resize: "none" }}
        />
     
     <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", width: "90%" }}
        />
             <button
          type="submit"
          style={{ backgroundColor: "#5f2d4c", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", transition: "background-color 0.3s" }}
        >
          {existingBlog ? "Güncelle" : "Kaydet"}
        </button>
       
      </form>
    </div>
  );
}

export default BlogEkle;
