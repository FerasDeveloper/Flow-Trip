import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCode, FaUsers, FaGlobe, FaHeart } from "react-icons/fa";
import "./AboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  const developers = [
    {
      name: "Bshara Al-Hatem",
      role: "Full Stack Developer & Project Lead",
      description: "Specialized in React, Node.js, and system architecture",
      avatar: "👨‍💻"
    },
    {
      name: "Firas Al-Hatem",
      role: "Full Stack Developer",
      description: "Expert in modern web technologies and database design",
      avatar: "👨‍💻"
    },
    {
      name: "Simon Dahdal",
      role: "Backend Developer",
      description: "Specialized in server-side development and API design",
      avatar: "⚙️"
    },
    {
      name: "Michel Skaf",
      role: "Frontend Developer",
      description: "Expert in React and modern frontend frameworks",
      avatar: "💻"
    },
    {
      name: "Moaz Qubais",
      role: "Frontend Developer",
      description: "Expert in React and modern frontend frameworks",
      avatar: "💻"
    }
  ];

  return (
    <div className="about-us-container">
      {/* Header */}
      <div className="about-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1>About Flow Trip</h1>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <FaGlobe className="hero-icon" />
          <h2>Your Ultimate Travel Companion</h2>
          <p>
            Flow Trip is a premium travel platform that revolutionizes your journey planning experience. 
            We offer comprehensive tourism services including exclusive travel packages, luxury accommodations, 
            premium hotels, reliable transportation, and exciting activities - all designed to create 
            unforgettable travel experiences.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h3>What We Offer</h3>
        <div className="features-grid">
          <div className="feature-card">
            <FaCode className="feature-icon" />
            <h4>Smart Planning</h4>
            <p>AI-powered trip planning to create personalized itineraries tailored to your preferences</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h4>Professional Support Team</h4>
            <p>Expert travel consultants providing premium assistance and guidance</p>
          </div>
          <div className="feature-card">
            <FaGlobe className="feature-icon" />
            <h4>Comprehensive Services</h4>
            <p>Complete tourism solutions including packages, hotels, accommodations, vehicles, and activities</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h3>Meet Our Team</h3>
        <div className="team-grid">
          {developers.map((dev, index) => (
            <div key={index} className="team-card">
              <div className="avatar">{dev.avatar}</div>
              <h4>{dev.name}</h4>
              <p className="role">{dev.role}</p>
              <p className="description">{dev.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <h3>Our Mission</h3>
        <div className="mission-content">
          <p>
            At Flow Trip, we believe that exceptional travel experiences should be effortlessly accessible. 
            Our mission is to provide premium tourism services that transform ordinary trips into 
            extraordinary adventures, offering everything from luxury accommodations and exclusive packages 
            to reliable transportation and unique activities.
          </p>
          <p>
            We're dedicated to excellence, innovation, and delivering world-class service that exceeds 
            expectations. Our comprehensive platform connects travelers with the finest tourism offerings, 
            ensuring every journey is memorable and perfectly orchestrated.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h3>Get In Touch</h3>
        <p>Have questions or suggestions? We'd love to hear from you!</p>
        <button 
          className="contact-btn"
          onClick={() => window.open('https://wa.me/0938246910', '_blank')}
        >
          Contact Us on WhatsApp
        </button>
      </div>
    </div>
  );
}
