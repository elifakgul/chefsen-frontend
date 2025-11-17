import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./tarifdetay.css";

function TarifDetay() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/recipes/${id}/`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Tarif detaylarını alırken hata oluştu:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const kategoriCevir = {
    "breakfast": "Kahvaltı",
    "lunch": "Ana Yemek",
    "soup": "Çorba",
    "dessert": "Tatlı",
    "salad": "Salata",
    "other": "Diğer"
  };

  return (
    <div className="tarifdetay-container">
      {recipe ? (
        <>
          <div className="tarifdetay-header">
            <img src={recipe.image} alt={recipe.title} className="tarifdetay-image" />
            <div className="tarifdetay-meta">
              <div className="tarifdetay-tags">
                <span className="tag">Yemek</span>
                <span className="tag">{kategoriCevir[recipe.category] || "Kategori Yok"}</span>
              </div>
              <h1 className="tarifdetay-title">{recipe.title}</h1>
              <p className="tarifdetay-desc">
  {recipe.description || `${recipe.title} için tüm detayları aşağıda bulabilirsiniz.`}
</p>

            </div>
          </div>

          <div className="tarifdetay-body">
            <div className="ingredients">
              <h2>Malzemeler</h2>
              <p style={{ whiteSpace: "pre-line" }}>{recipe.ingredients}</p>
            </div>
            <div className="instructions">
              <h2>Talimatlar</h2>
              <p style={{ whiteSpace: "pre-line" }}>{recipe.instructions}</p>
            </div>
          </div>

          <button className="tarifdetay-btn" onClick={() => navigate(-1)}>
  Geri Dön
</button>

        </>
      ) : (
        <p className="loading-text">Tarif yükleniyor...</p>
      )}
    </div>
  );
}

export default TarifDetay;
