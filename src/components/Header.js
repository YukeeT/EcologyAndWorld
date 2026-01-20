import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reservesDropdownOpen, setReservesDropdownOpen] = useState(false);
  const [ecologyDropdownOpen, setEcologyDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const reserves = [
    { id: 1, name: 'Беловежская пуща', slug: 'belovezhskaya-pushcha' },
    { id: 2, name: 'Березинский заповедник', slug: 'berezinsky' },
    { id: 3, name: 'Припятский парк', slug: 'pripyatsky' },
    { id: 4, name: 'Нарочанский парк', slug: 'narochansky' },
    { id: 5, name: 'Браславские озера', slug: 'braslavskie' },
    { id: 6, name: 'Полесский заповедник', slug: 'polesky' }
  ];

  const ecologyTopics = [
    { id: 'importance', name: 'Важность экологии' },
    { id: 'climate', name: 'Изменение климата' },
    { id: 'biodiversity', name: 'Биоразнообразие' },
    { id: 'pollution', name: 'Загрязнение' },
    { id: 'resources', name: 'Природные ресурсы' },
    { id: 'protection', name: 'Охрана природы' },
    { id: 'sustainable', name: 'Устойчивое развитие' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setIsMobileMenuOpen(false);
  };

  const handleReservesClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToSection('reserves');
    } else {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        scrollToSection('reserves');
      }, 100);
    }
    setReservesDropdownOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">Экология и мир</span>
          </Link>
          <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Главная</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>О нас</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Направления</a>
            
            <div 
              className="nav-dropdown"
              onMouseEnter={() => setReservesDropdownOpen(true)}
              onMouseLeave={() => setReservesDropdownOpen(false)}
            >
              <a 
                href="#reserves" 
                onClick={handleReservesClick}
                className="dropdown-trigger"
              >
                Заповедники
                <span className="dropdown-arrow">▼</span>
              </a>
              {reservesDropdownOpen && (
                <div className="dropdown-menu">
                  {reserves.map((reserve) => (
                    <Link
                      key={reserve.id}
                      to={`/reserve/${reserve.id}`}
                      className="dropdown-item"
                      onClick={() => {
                        setReservesDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {reserve.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="nav-dropdown"
              onMouseEnter={() => setEcologyDropdownOpen(true)}
              onMouseLeave={() => setEcologyDropdownOpen(false)}
            >
              <Link 
                to="/ecology"
                className="dropdown-trigger"
                onClick={() => {
                  setEcologyDropdownOpen(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                Экология
                <span className="dropdown-arrow">▼</span>
              </Link>
              {ecologyDropdownOpen && (
                <div className="dropdown-menu">
                  {ecologyTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      to={`/ecology#${topic.id}`}
                      className="dropdown-item"
                      onClick={() => {
                        setEcologyDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/contact" 
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              Контакты
            </Link>
          </nav>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

