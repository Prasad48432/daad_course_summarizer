import React from "react";

const Loader = ({
  size = 20,
  className = "bg-foreground",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className="spinner_wrapper__zbFtL"
      data-geist-spinner=""
      data-version="v1"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className="relative top-1/2 left-1/2"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
        <div className={`spinner_bar ${className}`}></div>
      </div>
    </div>
  );
};

export default Loader;
