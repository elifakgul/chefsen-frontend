import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/chefsen.png";
import axios from "axios";

function Header() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/recipes/?search=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Arama hatası:", error);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleSelect = (id) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/tarif/${id}`);

  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setIsRegistering(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/register/", {
        username,
        email,
        password,
      });

      if (response.data.token) {
        alert("Kayıt başarılı! Lütfen giriş yapın.");
        setIsRegistering(false);
        setEmail("");
        setPassword("");
      } else {
        throw new Error("Kayıt başarılı ancak token alınamadı!");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Kayıt başarısız.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/login/", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.user_id);
        setUser(response.data.username);
        alert(`Giriş başarılı! Hoşgeldin, ${response.data.username}`);
        closeLoginModal();
      } else {
        throw new Error("Giriş başarısız! Geçerli token alınamadı.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Giriş başarısız.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="header">
      <div className="left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="DEB Logo" className="logo" />
        </Link>
      </div>

      <div className="center">
        <Link className="link" to="/tarifler">Tüm Tarifler</Link>
        <Link className="link" to="/blog">Blog</Link>
        <Link className="link" to="/chef">Chef AI</Link>
        <Link className="link" to="/kalori">Kalori</Link>
      </div>

      <div className="right" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Yemek Tarifi Ara"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item.id)}
                style={{ cursor: "pointer", padding: "8px", background: "#fff", borderBottom: "1px solid #ccc" }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <div className="user-info">
            <span className="welcome-text">Hoşgeldin, {user}!</span>
            <div className="user-buttons">
              <Link to="/tarif-ekle">
                <button className="add-button">Tarif Yaz</button>
              </Link>
              <Link to="/blog-ekle">
                <button className="add-button">Blog Yaz</button>
              </Link>
              <button className="logout-button" onClick={handleLogout}>Çıkış Yap</button>
            </div>
          </div>
        ) : (
          <button className="login-button" onClick={openLoginModal}>Üye Girişi</button>
        )}
      </div>

      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isRegistering ? (
              <>
                <h2>Üye Ol</h2>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Ad Soyad:</label>
                    <input type="text" id="name" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">E-posta:</label>
                    <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Şifre:</label>
                    <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="submit-button">Kayıt Ol</button>
                </form>
                <p className="switch-text">Zaten bir hesabınız var mı? <span onClick={() => setIsRegistering(false)} className="switch-link">Giriş Yap</span></p>
              </>
            ) : (
              <>
                <h2>Üye Girişi</h2>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">E-posta:</label>
                    <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Şifre:</label>
                    <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="submit-button">Giriş Yap</button>
                </form>
                <p className="switch-text">Üye değil misiniz? <span onClick={() => setIsRegistering(true)} className="switch-link">Kayıt Ol</span></p>
              </>
            )}
            <button className="close-button" onClick={closeLoginModal}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
