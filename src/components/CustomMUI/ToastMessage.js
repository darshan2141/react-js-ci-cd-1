// Notification.js
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  return <ToastContainer />;
};
const Rander = (message, options) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {options.type === "success" || options.type == "info" ? (
        <FaCheckCircle
          style={{
            width: "20px",
            height: "20px",
            marginRight: "8px",
            color: options.type == "success" ? "white" : "black",
          }}
        />
      ) : (
        <FaInfoCircle
          style={{
            width: "20px",
            height: "20px",
            marginRight: "8px",
            color: "black",
          }}
        />
      )}
      <p
        style={{
          color: options.type == "success" ? "white" : "black",
          fontSize: "16px",
        }}
      >
        {message}
      </p>
    </div>
  );
};
//success, error, warning, info
const ShowToast = (message, options = {}) => {
  if (options.type == "success") {
    toast.success(Rander(message, options), {
      newestOnTop: true,
      position: options.position || "top-center",
      autoClose: options.autoClose || 4000,
      hideProgressBar: options.hideProgressBar || true,
      closeOnClick: options.closeOnClick || true,
      pauseOnHover: options.pauseOnHover || true,
      draggable: options.draggable || true,
      progress: options.progress,
      theme: "light",
    });
  } else if (options.type == "error") {
    toast.error(Rander(message, options), {
      newestOnTop: true,
      position: options.position || "top-center",
      autoClose: options.autoClose || 4000,
      hideProgressBar: options.hideProgressBar || true,
      closeOnClick: options.closeOnClick || true,
      pauseOnHover: options.pauseOnHover || true,
      draggable: options.draggable || true,
      progress: options.progress,
      theme: "light",
    });
  } else if (options.type == "warning") {
    toast.warning(Rander(message, options), {
      newestOnTop: true,
      position: options.position || "top-center",
      autoClose: options.autoClose || 4000,
      hideProgressBar: options.hideProgressBar || true,
      closeOnClick: options.closeOnClick || true,
      pauseOnHover: options.pauseOnHover || true,
      draggable: options.draggable || true,
      progress: options.progress,
      theme: "light",
    });
  } else {
    toast.info(Rander(message, options), {
      newestOnTop: true,
      position: options.position || "top-center",
      autoClose: options.autoClose || 4000,
      hideProgressBar: options.hideProgressBar || true,
      closeOnClick: options.closeOnClick || true,
      pauseOnHover: options.pauseOnHover || true,
      draggable: options.draggable || true,
      progress: options.progress,
      theme: "light",
    });
  }
};

export { ToastMessage, ShowToast };
