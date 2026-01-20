import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div 
          className="hero-image"
          style={{
            backgroundImage: 'url(/images/hero/hero-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Экология и мир
          </h1>
          <p className="hero-subtitle">
            Изучайте уникальные заповедники и охраняемые территории Республики Беларусь
          </p>
          <p className="hero-description">
            Откройте для себя природное наследие Беларуси через интерактивные карты и подробную информацию о заповедниках
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('reserves')}
            >
              Изучить заповедники
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => scrollToSection('about')}
            >
              Узнать больше
            </button>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span>↓</span>
      </div>
    </section>
  );
};

export default Hero;

