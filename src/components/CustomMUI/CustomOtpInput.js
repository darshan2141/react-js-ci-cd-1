// CustomOtpInput.js
import React from 'react';
import PropTypes from 'prop-types';
import './CustomMUI.css'

const CustomOtpInput = ({ numInputs, onChange }) => {
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value) || value.length > 1) return;

    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs[index].value = value;

    if (value && otpInputs[index + 1]) {
      otpInputs[index + 1].focus();
    }

    const otpValue = Array.from(otpInputs).map(input => input.value).join('');
    onChange(otpValue);
  };

  return (
    <div className="otp-input-container">
      {Array.from({ length: numInputs }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          className="otp-input"
          onChange={(e) => handleChange(e, index)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
};

CustomOtpInput.propTypes = {
  numInputs: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomOtpInput;
