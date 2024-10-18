import React from 'react';
import './CustomMUI.css'
import { Button } from '@material-ui/core';

export function PrimaryButton(props) {
  const { className, children, ...otherProps } = props;
  return (
    <Button
      disableElevation
      size='large'
      variant='contained'
      className={className + ' primary-btn' || 'primary-btn'}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export function SecondaryButton(props) {
  const { className, children, ...otherProps } = props;
  return (
    <Button
      disableElevation
      className={className + ' primary-hollow-btn' || 'primary-hollow-btn'}
      variant='outlined'
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export function DeleteButton(props) {
  const { onClick, className, children } = props;
  return (
    <Button
      onClick={onClick}
      disableElevation
      className={className + ' delete-btn' || 'delete-btn'}
      variant='outlined'
    >
      {children}
    </Button>
  );
};

export function LightButton(props) {
  const { className, children, ...otherProps } = props;
  return (
    <Button
      disableElevation
      size='large'
      variant='contained'
      className={className + ' light-btn' || 'light-btn'}
      {...otherProps}
    >
      {children}
    </Button>
  );
};