import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import './ReserveDetail.css';
import 'leaflet/dist/leaflet.css';

// Исправление иконок маркеров для Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ReserveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserve, setReserve] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReserve();
  }, [id]);

  const fetchReserve = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reserves/${id}`);
      setReserve(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reserve-detail-page">
        <div className="loading-container">
          <div className="loading">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  if (!reserve) {
    return (
      <div className="reserve-detail-page">
        <div className="error-container">
          <h2>Заповедник не найден</h2>
          <Link to="/" className="btn btn-primary">Вернуться на главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reserve-detail-page">
      <div className="reserve-detail-hero">
        <div 
          className="reserve-hero-image"
          style={{
            backgroundImage: `url(${reserve.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="reserve-hero-overlay"></div>
          <div className="container">
            <div className="reserve-hero-content">
              <Link to="/" className="back-button">← Назад</Link>
              <h1>{reserve.name}</h1>
              <p className="reserve-hero-subtitle">Охраняемая природная территория Республики Беларусь</p>
            </div>
          </div>
        </div>
      </div>

      <div className="reserve-detail-content">
        <div className="container">
          <div className="reserve-main-info">
            <div className="reserve-description-section">
              <h2>Описание</h2>
              <p className="reserve-description">{reserve.description}</p>
              
              {reserve.gallery && reserve.gallery.length > 0 && (
                <div className="reserve-gallery">
                  <h3>Фотогалерея заповедника</h3>
                  <div className="reserve-gallery-grid">
                    {reserve.gallery.map((image, index) => (
                      <div key={index} className="reserve-gallery-item">
                        <div
                          className="reserve-gallery-image"
                          style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="reserve-features">
                <h3>Особенности заповедника</h3>
                <ul className="features-list">
                  {reserve.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="reserve-info-cards">
              <div className="info-card">
                <div className="info-card-icon">📏</div>
                <div className="info-card-content">
                  <h4>Площадь</h4>
                  <p className="info-card-value">{parseInt(reserve.area).toLocaleString()} га</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">📅</div>
                <div className="info-card-content">
                  <h4>Год основания</h4>
                  <p className="info-card-value">{reserve.established}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">📍</div>
                <div className="info-card-content">
                  <h4>Координаты</h4>
                  <p className="info-card-value">
                    {reserve.location.lat.toFixed(4)}, {reserve.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="reserve-map-section">
            <h2>Расположение на карте</h2>
            <div className="reserve-map-container">
              <MapContainer
                center={[reserve.location.lat, reserve.location.lng]}
                zoom={10}
                style={{ height: '500px', width: '100%', borderRadius: '10px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[reserve.location.lat, reserve.location.lng]}>
                  <Popup>
                    <strong>{reserve.name}</strong>
                    <br />
                    {reserve.description}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className="reserve-additional-info">
            <h2>Дополнительная информация</h2>
            <div className="additional-content">
              <p>
                Данный заповедник является важной частью природного наследия Беларуси. 
                Он играет ключевую роль в сохранении биоразнообразия и экологического баланса региона.
              </p>
              <p>
                Посещение заповедника возможно только в рамках организованных экскурсий и с соблюдением 
                всех правил охраны природы. Мы призываем всех посетителей бережно относиться к природе 
                и следовать экологическим принципам.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveDetail;

