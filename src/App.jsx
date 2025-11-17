import { Routes, Route } from "react-router-dom";
import "./App.css";
import Tarifler from "./pages/Tarifler";
import Chef from "./pages/Chef";
import Blog from "./pages/Blog";
import Kalori from "./pages/Kalori";
import Header from "./components/Header";
import Anasayfa from "./pages/Anasayfa";
import BlogEkle from "./pages/BlogEkle"; // Blog ekleme sayfası
import TarifEkle from "./pages/TarifEkle"; // Tarif ekleme sayfası
import TarifDetay from "./pages/TarifDetay"; // ✅ TarifDetay bileşenini import et
import BlogDetay from "./pages/BlogDetay";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/tarifler" element={<Tarifler />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetay />} /> {/* 📌 Blog Detay Route */}
        <Route path="/tarif/:id" element={<TarifDetay />} />
        <Route path="/chef" element={<Chef />} />
        <Route path="/kalori" element={<Kalori />} />
        <Route path="/blog-ekle" element={<BlogEkle />} />
        <Route path="/tarif-ekle" element={<TarifEkle />} />
      </Routes>
    </>
  );
}

export default App;
