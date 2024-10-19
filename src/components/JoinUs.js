import React, { useState } from 'react';
import './JoinUs.css';

const JoinUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    resume: null,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for handling form submission (e.g., API call)
    console.log('Form submitted:', formData);
  };

  return (
    <section id="join-us" className="join-us-section">
      <h2>Join Our Team</h2>
      <p>We are always looking for experienced and passionate lawyers to join Bharat Law Associates.</p>
      <form className="join-us-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
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
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="qualification">Qualification</label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Years of Experience</label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="resume">Upload Resume</label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Additional Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about yourself"
          />
        </div>

        <button type="submit">Submit Application</button>
      </form>
    </section>
  );
};

export default JoinUs;
