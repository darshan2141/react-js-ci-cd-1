import { TextField } from '@material-ui/core';
import React from 'react';

const CustomTextField = (props) => {
  const { readOnly, ...otherProps } = props;
  return (
    <TextField
      fullWidth
      required
      variant='outlined'
      margin='normal'
      style={{ backgroundColor: "var(--placeholder-bg)" }}
      InputProps={{ ...props.InputProps, readOnly }}
      {...otherProps}
    />
  );
};

export default CustomTextField;