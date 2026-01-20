import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Экология и мир</h3>
            <p>
              Информационный ресурс о заповедниках и охраняемых природных территориях 
              Республики Беларусь
            </p>
          </div>
          <div className="footer-section">
            <h4>Навигация</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Главная</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>О нас</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Направления</a></li>
              <li><a href="#reserves" onClick={(e) => { e.preventDefault(); scrollToSection('reserves'); }}>Заповедники</a></li>
              <li><Link to="/ecology">Экология</Link></li>
              <li><Link to="/contact">Контакты</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Контакты</h4>
            <ul>
              <li>📧 info@ecology-world.by</li>
              <li>📞 +375 (17) 123-45-67</li>
              <li>📍 г. Минск, ул. Экологическая, 1</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Социальные сети</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="YouTube">📺</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Экология и мир. Все права защищены.</p>
          <button className="scroll-to-top" onClick={scrollToTop} aria-label="Наверх">
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

