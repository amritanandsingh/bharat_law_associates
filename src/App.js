import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import OurLawyers from './components/OurLawyers';
import ContactUs from './components/ContactUs';
import JoinUs from './components/JoinUs';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
      <AboutUs />
      <OurLawyers />
      <ContactUs />
      <JoinUs /> 
    </div>
  );
}

export default App;
