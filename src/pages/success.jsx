import React from 'react';
import './Success.css';  // Import the new CSS for styling

const Success = () => {
  return (
    <div className="success-container">
      <div className="success-message">
        <h2>Thank You for Completing the Exam!</h2>
        <p>Your answers have been successfully submitted.</p>
        {/* <button className="go-home-btn" onClick={() => window.location.href = '/'}>
          Go to Home
        </button> */}
      </div>
    </div>
  );
};

export default Success;
