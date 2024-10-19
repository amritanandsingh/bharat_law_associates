import React from 'react';
import './OurLawyers.css';

const OurLawyers = () => {
  const lawyers = [
    { name: "Prem Prakash", qualification: "LLB Kolkata" },
    { name: "Shashank Saurabh Pandey", qualification: "LLB Delhi, High Court" },
    { name: "Sam Lord", qualification: "LLB Mumbai" },
    { name: "Hetain", qualification: "LLB Varanasi" },
  ];

  return (
    <section id="lawyers" className="lawyers-section">
      <h2>Our Lawyers</h2>
      <div className="lawyer-list">
        {lawyers.map((lawyer, index) => (
          <div key={index} className="lawyer-card">
            <img
              src={`https://via.placeholder.com/150?text=Lawyer+${index + 1}`}
              alt={lawyer.name}
              className="lawyer-photo"
            />
            <h3>{lawyer.name}</h3>
            <p>{lawyer.qualification}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurLawyers;
