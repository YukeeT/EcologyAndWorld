import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить отправку формы на сервер
    console.log('Форма отправлена:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section
      id="contact"
      className="contact"
      style={{
        backgroundImage: "url(/images/backgrounds/contact-section-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="container">
        <h2 className="section-title">Свяжитесь с нами</h2>
        <p className="section-subtitle">
          Есть вопросы или предложения? Мы будем рады услышать от вас
        </p>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>info@ecology-world.by</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h4>Телефон</h4>
                <p>+375 (17) 123-45-67</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h4>Адрес</h4>
                <p>г. Минск, ул. Экологическая, 1</p>
              </div>
            </div>
            <div className="contact-image-wrapper">
              <div 
                className="contact-image"
                style={{
                  backgroundImage: 'url(/images/contact/contact-nature.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Сообщение</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Отправить сообщение
            </button>
            {submitted && (
              <div className="form-success">
                Спасибо! Ваше сообщение отправлено.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

