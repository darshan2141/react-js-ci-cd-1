import React from 'react';
import './CustomMUI.css'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomMobileInput = ({ countryCode, phone, onCountryChange, onPhoneChange }) => {
  return (
    <div className="custom-mobile-input-container">
      <PhoneInput
        country={countryCode}
        value={phone}
        onChange={(value, country) => {
          onPhoneChange(value);
          onCountryChange(country.dialCode);
        }}
        containerClass="custom-phone-input"
      />
    </div>
  );
};

export default CustomMobileInput;
