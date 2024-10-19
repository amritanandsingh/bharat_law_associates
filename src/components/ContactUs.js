import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <section id="contact" className="contact-section">
      <h2>Contact Us</h2>
      <p>
        We are here to help you with your legal concerns. Get in touch with us today for expert legal advice.
      </p>
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  );
};

export default ContactUs;
