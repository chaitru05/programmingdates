import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="top-bar"></div>
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">ValenTech</h2>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Contact</a>
          <button className="btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
         <div className="bg-icon">
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Connecting Hearts with <br/> Technology ❤️
          </h1>
          <p className="hero-subtitle">
            A modern platform designed to bring people closer in the digital era.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Explore Now</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="features">
        <h2 className="section-title">Our Features</h2>
        <div className="card-container">
          <div className="card">
            <h3>💖 Smart Matching</h3>
            <p>Advanced algorithms to connect compatible people.</p>
          </div>

          <div className="card">
            <h3>🔒 Secure Platform</h3>
            <p>Your data and privacy are always protected.</p>
          </div>

          <div className="card">
            <h3>🌍 Community Love</h3>
            <p>Build meaningful connections across the world.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 ADCT Hackathon | Team ValenTech</p>
      </footer>

    </div>
  );
}

export default App;
