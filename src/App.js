import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ReservesMap from './components/ReservesMap';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ReserveDetail from './pages/ReserveDetail';
import Ecology from './pages/Ecology';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <About />
              <Services />
              <ReservesMap />
            </>
          } />
          <Route path="/reserve/:id" element={<ReserveDetail />} />
          <Route path="/ecology" element={<Ecology />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

