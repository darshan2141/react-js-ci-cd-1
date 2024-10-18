import { Button } from "@material-ui/core";
import React from "react";

export function CustomSmallButton(prop) {
  const { onClick, disabled, name, type } = prop;
  const textColor = disabled
    ? "var(--primary-color-700)"
    : type === "btn-success"
      ? "var(--neutral-color-900)"
      : "var(--primary-color-white)";

  const backgroundColor = disabled
    ? "var( --primary-color-500:)"
    : type === "btn-success"
      ? "var(--secondary-color-300)"
      : type === "btn-warning"
        ? "var(--warning-color)"
        : type === "btn-danger"
          ? "var(--error-color)"
          : type === "btn-primary"
            ? "var(--primary-color-700)"
            : "var(--primary-color-700)";

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        maxWidth: '80px',
        overflow: 'hidden',
        color: textColor,
        backgroundColor: backgroundColor,
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "10px",
      }}
      className="customSmallButton"
    >
      {name}
    </Button>
  );
}

export function CustomSmallRoundedButton(prop) {
  const { onClick, disabled, name, type } = prop;
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        color:
          type === "btn-green"
            ? "var(--primary-color-700)"
            : "var(--color-orange)",
        backgroundColor:
          type === "btn-green"
            ? "var(--secondary-color-100)"
            : "var(--fill-lightyellow-color)",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "50px",
      }}
      className="customSmallButton"
    >
      {name}
    </Button>
  );
}

export function CustomCardButton(prop) {
  const { onClick, disabled, name } = prop;
  const backgroundColor =
    name === "Verified" || name === "View" || name === "Selected" ? "#DEFE8F" : "var(--netural-color-200)";

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        color: "var(--primary-color-700)",
        backgroundColor: backgroundColor,
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "8px",
        fontSize: "15px",
      }}
      className="customSmallButton"
    >
      {name}
    </Button>
  );
}

export function CustomAddPlayerButton(prop) {
  const { onClick, disabled, name } = prop;

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        color: "var(--primary-color-700)",
        backgroundColor: "var(--fill-lightyellow-color)",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "8px",
        fontSize: "15px",
      }}
      className="customSmallButton"
    >
      {name}
    </Button>
  );
}
