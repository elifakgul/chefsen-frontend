import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function TarifEkle() {
  const location = useLocation();
  const existingRecipe = location.state?.recipe || null; // Eğer güncelleme için veri geldiyse yakala

  // 📌 Eğer tarif güncelleniyorsa, mevcut bilgileri doldur
  const [title, setTitle] = useState(existingRecipe ? existingRecipe.title : "");
  const [ingredients, setIngredients] = useState(existingRecipe ? existingRecipe.ingredients : "");
  const [instructions, setInstructions] = useState(existingRecipe ? existingRecipe.instructions : "");
  const [category, setCategory] = useState(existingRecipe ? existingRecipe.category : "other");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Tarif eklemek için giriş yapmalısınız!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (existingRecipe) {
        // 📌 Güncelleme işlemi
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/recipes/${existingRecipe.id}/`,
          formData,
          {
            headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          alert("Tarif başarıyla güncellendi!");
          navigate("/tarifler");
        }
      } else {
        // 📌 Yeni tarif ekleme işlemi
        const response = await axios.post(
          "http://127.0.0.1:8000/api/recipes/",
          formData,
          {
            headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          alert("Tarif başarıyla eklendi!");
          navigate("/tarifler");
        }
      }
    } catch (error) {
      console.error("Hata oluştu:", error);
      alert("İşlem sırasında bir hata oluştu.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", background: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {existingRecipe ? "Tarifi Güncelle" : "Tarif Ekle"}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", width: "90%" }}
        />
        <textarea
          placeholder="Malzemeler"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", width: "90%", height: "100px", resize: "none" }}
        />
        <textarea
          placeholder="Talimatlar"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", width: "90%", height: "150px", resize: "none" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", width: "90%" }}
        >
          <option value="other">Diğer</option>
          <option value="breakfast">Kahvaltı</option>
          <option value="salad">Salata</option>
          <option value="soup">Çorba</option>
          <option value="main_dish">Ana Yemek</option>
          <option value="dessert">Tatlı</option>
        </select>
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
          {existingRecipe ? "Güncelle" : "Kaydet"}
        </button>
      </form>
    </div>
  );
}

export default TarifEkle;
