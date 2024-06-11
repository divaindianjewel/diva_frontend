// components/Loader.js
import React from "react";
import "./css/loader.css"; // Importing CSS module for styling

const Loader = () => {
  return (
    <div className={'loader'}>
      <div className={'spinner'}></div>
    </div>
  );
};

export default Loader;
