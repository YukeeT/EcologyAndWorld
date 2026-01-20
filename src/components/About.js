import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">О проекте</h2>
        <p className="section-subtitle">
          Информационный ресурс, посвященный изучению и сохранению природного наследия Беларуси
        </p>
        <div className="about-content">
          <div className="about-image-wrapper">
            <div 
              className="about-image"
              style={{
                backgroundImage: 'url(/images/about/about-nature.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
          <div className="about-text">
            <h3>Наша миссия</h3>
            <p>
              Проект "Экология и мир" создан с целью популяризации знаний о заповедниках 
              и охраняемых природных территориях Республики Беларусь. Мы стремимся показать 
              уникальность и ценность природного наследия нашей страны.
            </p>
            <p>
              Через интерактивные карты и подробную информацию о каждом заповеднике мы 
              помогаем людям лучше понять важность сохранения природы и экологического 
              баланса для будущих поколений.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">6+</div>
                <div className="stat-label">Заповедников</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500000+</div>
                <div className="stat-label">Гектаров охраняемых территорий</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Видов животных и растений</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

