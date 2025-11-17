import React, { useState } from "react";
import { djangoApi } from "../api"; // 💡 Django backend client

function Chef() {
  const [soru, setSoru] = useState("");
  const [resim, setResim] = useState(null);
  const [cevaplar, setCevaplar] = useState([]);
  const [malzemeler, setMalzemeler] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("soru", soru);
    if (resim) {
      formData.append("foto", resim);
    }

    // Django urlpatterns:
    // path('api/', include('recipe.urls'))
    // recipe.urls: path('chatbot/', ...), path('chatbot-foto/', ...)
    // 👉 Son URL'ler: /api/chatbot/ ve /api/chatbot-foto/
    const endpoint = resim ? "/api/chatbot-foto/" : "/api/chatbot/";

    try {
      const response = await djangoApi.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      setCevaplar(data.oneriler || []);
      setMalzemeler(data.tespit_edilen_malzemeler || []);
    } catch (error) {
      console.error("Hata:", error);
      setCevaplar(["Bir hata oluştu, lütfen tekrar dene."]);
      setMalzemeler([]);
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
        <h1 style={{ textAlign: "center" }}>👨‍🍳 Chef AI</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={soru}
            onChange={(e) => setSoru(e.target.value)}
            placeholder="Bugün ne pişirsem?"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setResim(e.target.files[0])}
              id="file-upload"
              style={{ display: "none" }}
            />

            <label
              htmlFor="file-upload"
              style={{
                display: "inline-block",
                backgroundColor: "#F48FB1",
                color: "#fff",
                padding: "11px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
            >
              📷 Resim Yükle
            </label>

            {resim && (
              <div
                style={{
                  marginTop: "15px",
                  fontSize: "14px",
                  color: "#4CAF50",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Yüklenen dosya: {resim.name}
                <span
                  onClick={() => setResim(null)}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    color: "#E91E63",
                    fontSize: "18px",
                  }}
                >
                  ❌
                </span>
              </div>
            )}

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
                marginTop: "15px",
                transition: "background-color 0.3s ease",
              }}
            >
              Gönder
            </button>
          </div>
        </form>

        {resim && malzemeler.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>🔍 Tespit Edilen Malzemeler:</h3>
            <ul>
              {malzemeler.map((malzeme, index) => (
                <li key={index}>{malzeme}</li>
              ))}
            </ul>
          </div>
        )}

        {cevaplar.length > 0 && (
          <div>
            <h3>🍽️ Önerilen Tarif:</h3>
            <ul>
              {cevaplar.map((item, i) => {
                // Eğer dizi gelirse [isim, skor, detay]
                if (Array.isArray(item)) {
                  const [isim, skor, detay] = item;
                  return (
                    <li key={i}>
                      <strong>{isim}</strong>
                      <br />
                      <small>{detay}</small>
                    </li>
                  );
                }

                // Eğer obje gelirse {isim, malzemeler, tarif}
                if (typeof item === "object" && item !== null) {
                  return (
                    <li key={i} style={{ marginBottom: "15px" }}>
                      <strong>{item.isim}</strong>
                      <br />
                      <em>Malzemeler:</em>{" "}
                      {Array.isArray(item.malzemeler)
                        ? item.malzemeler.join(", ")
                        : item.malzemeler}
                      <br />
                      <em>Tarif:</em> {item.tarif}
                    </li>
                  );
                }

                // String vs ise direkt yaz
                return (
                  <li key={i}>
                    <strong>{item}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chef;
