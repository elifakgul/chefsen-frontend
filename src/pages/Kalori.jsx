import React, { useState } from "react";
import { fastApi } from "../api"; // 💡 FastAPI client

function KaloriBot() {
  const [soru, setSoru] = useState("");
  const [cevaplar, setCevaplar] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // GET /kalori/?soru=...&limit=10
      const response = await fastApi.get("/kalori/", {
        params: {
          soru: soru,
          limit: 10,
        },
      });

      const data = response.data;

      if (data.cevaplar) {
        setCevaplar(data.cevaplar);
      } else if (data.cevap) {
        setCevaplar([data.cevap]);
      } else {
        setCevaplar(["Cevap alınamadı."]);
      }
    } catch (error) {
      console.error("Hata:", error);
      setCevaplar(["Bir hata oluştu."]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        padding: "30px 0",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          maxWidth: "700px",
          marginTop: "50px",
          margin: "auto",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>🔥 KaloriBot</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={soru}
            onChange={(e) => setSoru(e.target.value)}
            placeholder="Örn: Makarna kaç kalori?"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "15px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#F48FB1",
              color: "white",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Sorgula
          </button>
        </form>

        {cevaplar.length > 0 && (
          <div>
            <h3>📊 Kalori Bilgisi:</h3>
            <ul>
              {cevaplar.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default KaloriBot;
