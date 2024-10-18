import { TextField, IconButton, InputAdornment } from "@material-ui/core";
import React, { useState } from "react";
import EyeShow from "../../assets/images/svg/eye-show.svg";
import EyeHide from "../../assets/images/svg/eye-hide.svg";

const CustomPasswordField = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      fullWidth
      required
      variant="outlined"
      margin="normal"
      children={props.children}
      select={props.select}
      className={props.className}
      size={props.size}
      style={{backgroundColor:"var(--placeholder-bg)"}}
      placeholder={props.placeholder}
      label={props.label}
      type={showPassword ? "text" : "password"}
      value={props.value}
      onChange={props.onChange}
      inputProps={props.inputProps}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePasswordVisibility}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? (
                <img src={EyeShow} alt="" style={{ width: 24, height: 24 }} />
              ) : (
                <img src={EyeHide} alt="" style={{ width: 24, height: 24 }} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomPasswordField;
