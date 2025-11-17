import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { djangoApi } from "../api"; // 💡 Django backend client
import "./Anasayfa.css";
import { useNavigate, Link } from "react-router-dom";


const Anasayfa = () => {
  const [tarifler, setTarifler] = useState([]);
  const [bloglar, setBloglar] = useState([]);
  const navigate = useNavigate();

  // Karıştır ve ilk n tanesini al
  const karistirVeSec = (dizi, adet) => {
    const kopya = [...dizi];
    for (let i = kopya.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
    }
    return kopya.slice(0, adet);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🍽 Tarifler: /api/recipes/
        const tarifRes = await djangoApi.get("/api/recipes/");
        setTarifler(karistirVeSec(tarifRes.data, 3));

        // 📝 Bloglar: /api/blogs/
        const blogRes = await djangoApi.get("/api/blogs/");
        setBloglar(karistirVeSec(blogRes.data, 2));
      } catch (err) {
        console.error("Anasayfa verileri alınırken hata:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Hero */}
      <section className="hero">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        >
          <source
            src="https://videos.pexels.com/video-files/8769000/8769000-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-content">
          <h1>Sağlık ve lezzetin buluşma noktası.</h1>
          <p>Elindekilerle yemek yaratmak hiç bu kadar kolay olmamıştı.</p>
        </div>
      </section>

      {/* Öne Çıkan Tarifler */}
      <section className="section">
        <h2>Öne Çıkan Tarifler ✨</h2>
        <div className="card-grid">
          {tarifler.map((item) => (
            <div className="card" key={item.id}>
              {item.image && (
                <img src={item.image} alt={item.title} />
              )}
              <h3>{item.title}</h3>
              <button
                className="mini-btn"
                onClick={() => navigate(`/tarif/${item.id}`)}
              >
                Tarife Git
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Kartları */}
      <section className="section">
        <h2>Bloglardan İlham Al 🧠</h2>
        <div className="card-grid">
          {bloglar.map((item) => (
            <div className="card" key={item.id}>
              {item.image && (
                <img src={item.image} alt={item.title} />
              )}
              <h3>{item.title}</h3>
              <button
                className="mini-btn"
                onClick={() => navigate(`/blog/${item.id}`)}
              >
                Blogu Oku
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Chef AI Tanıtımı */}
      <section className="chefai-section">
        <div className="chefai-inner">
          <div className="chefai-text">
            <h2>🤖 Chef AI ile Tanış!</h2>
            <p>
              Malzemelerini yaz, ya da fotoğraf yükle. Chef AI sana özel tarif
              önerileriyle geri dönsün.
            </p>
          </div>
          <Link to="/chef">
            <button className="chefai-button">Chef AI'ı Deneyimle</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Anasayfa;
