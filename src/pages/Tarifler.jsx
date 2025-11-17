import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Tarifler.css";

function Tarifler() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTarifler = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/recipes/');
        setRecipes(response.data);
      } catch (error) {
        console.error("Tarifleri alırken bir hata oluştu:", error);
      }
    };

    fetchTarifler();
  }, []);

  const kategoriCevir = {
    "breakfast": "Kahvaltı",
    "lunch": "Ana Yemek",
    "soup": "Çorba",
    "dessert": "Tatlı",
    "salad": "Salata",
    "other": "Diğer"
  };

  const handleEditRecipe = (recipe) => {
    navigate("/tarif-ekle", { state: { recipe } });
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/recipes/${recipeId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error("Tarif silme hatası:", error);
      alert("Bu tarifi silme yetkiniz yok!");
    }
  };

  // 🔢 Sayfalama işlemleri
  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
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
            
            transition: "0.3s"
          }}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="tarifler-container">
      <h1 className="tarifler-title">Tarifler 🍽️ </h1>
      <div className="tarifler-grid">
        {currentRecipes.map((recipe) => (
          <div key={recipe.id} className="tarif-card" onClick={() => navigate(`/tarif/${recipe.id}`)}>
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="tarif-image" />}
            <div className="tarif-card-content">
              <h3 className="tarif-title">{recipe.title}</h3>
              <p className="tarif-category">{kategoriCevir[recipe.category] || "Kategori Yok"}</p>
              {username && recipe.user === username && (
                <div className="tarif-buttons">
                  <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditRecipe(recipe); }}>Güncelle</button>
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe.id); }}>Sil</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔢 Sayfa numaraları */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        {renderPageNumbers()}
      </div>
    </div>
  );
}

export default Tarifler;
