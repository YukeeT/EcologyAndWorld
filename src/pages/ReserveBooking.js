import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ReserveBooking.css';

const ReserveBooking = () => {
  const { id } = useParams();
  const [reserve, setReserve] = useState(null);
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    start_date: '',
    end_date: '',
    guests: 1,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reserveRes, cabinsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/reserves/${id}`),
          axios.get(`http://localhost:5000/api/reserves/${id}/cabins`),
        ]);
        setReserve(reserveRes.data);
        setCabins(cabinsRes.data);
        if (cabinsRes.data.length > 0) {
          setSelectedCabin(cabinsRes.data[0].name);
        }
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных для бронирования:', error);
        setErrorMessage('Не удалось загрузить данные для бронирования.');
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedCabin) {
      setErrorMessage('Пожалуйста, выберите домик для бронирования.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/reserves/${id}/bookings`, {
        cabin_name: selectedCabin,
        ...formData,
      });
      setSuccessMessage('Бронирование успешно оформлено! Мы свяжемся с вами по указанной почте.');
      setFormData({
        guest_name: '',
        guest_email: '',
        start_date: '',
        end_date: '',
        guests: 1,
      });
    } catch (error) {
      console.error('Ошибка при оформлении бронирования:', error);
      setErrorMessage('Произошла ошибка при оформлении бронирования. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="reserve-booking-page">
        <div className="loading-container">
          <div className="loading">Загрузка страницы бронирования...</div>
        </div>
      </div>
    );
  }

  if (!reserve) {
    return (
      <div className="reserve-booking-page">
        <div className="error-container">
          <h2>Заповедник не найден</h2>
          <Link to="/" className="btn btn-primary">Вернуться на главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reserve-booking-page">
      <div className="reserve-booking-hero">
        <div
          className="reserve-booking-hero-image"
          style={{
            backgroundImage: `url(${reserve.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="reserve-booking-hero-overlay"></div>
          <div className="container">
            <div className="reserve-booking-hero-content">
              <Link to={`/reserve/${id}`} className="back-button">← Назад к заповеднику</Link>
              <h1>Бронирование домиков</h1>
              <p className="reserve-booking-subtitle">
                Заповедник: {reserve.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="reserve-booking-content">
        <div className="container">
          <div className="reserve-booking-layout">
            <div className="booking-cabins">
              <h2>Доступные домики</h2>
              {cabins.length === 0 ? (
                <p>Для этого заповедника пока нет доступных домиков для онлайн-бронирования.</p>
              ) : (
                <div className="cabins-list">
                  {cabins.map((cabin) => (
                    <button
                      key={cabin.id}
                      type="button"
                      className={`cabin-card ${selectedCabin === cabin.name ? 'selected' : ''}`}
                      onClick={() => setSelectedCabin(cabin.name)}
                    >
                      <h3>{cabin.name}</h3>
                      <p className="cabin-description">{cabin.description}</p>
                      <div className="cabin-info">
                        <span>Вместимость: {cabin.capacity} чел.</span>
                        <span>от {cabin.price_per_night} BYN/ночь</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="booking-form-wrapper">
              <h2>Оформить бронирование</h2>
              <p className="booking-note">
                Заполните форму ниже, и сотрудники заповедника свяжутся с вами для подтверждения бронирования.
              </p>

              {errorMessage && <div className="booking-alert error">{errorMessage}</div>}
              {successMessage && <div className="booking-alert success">{successMessage}</div>}

              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="guest_name">Ваше имя</label>
                  <input
                    id="guest_name"
                    name="guest_name"
                    type="text"
                    value={formData.guest_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guest_email">Электронная почта</label>
                  <input
                    id="guest_email"
                    name="guest_email"
                    type="email"
                    value={formData.guest_email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="start_date">Дата заезда</label>
                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end_date">Дата выезда</label>
                    <input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Количество гостей</label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary booking-submit"
                  disabled={submitting || cabins.length === 0}
                >
                  {submitting ? 'Отправка...' : 'Отправить заявку на бронирование'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveBooking;

