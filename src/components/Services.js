import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🗺️',
      title: 'Интерактивные карты',
      description: 'Изучайте расположение заповедников на интерактивных картах с подробной информацией о каждом объекте'
    },
    {
      icon: '📚',
      title: 'Образовательные материалы',
      description: 'Получайте актуальную информацию о флоре, фауне и экосистемах заповедников Беларуси'
    },
    {
      icon: '🌱',
      title: 'Экологическое просвещение',
      description: 'Узнавайте о важности сохранения природы и экологических инициативах'
    },
    {
      icon: '🔬',
      title: 'Научные исследования',
      description: 'Изучайте результаты научных исследований и мониторинга состояния заповедников'
    }
  ];

  return (
    <section
      id="services"
      className="services"
      style={{
        backgroundImage: "url(/images/backgrounds/services-section-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="container">
        <h2 className="section-title">Направления деятельности</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

