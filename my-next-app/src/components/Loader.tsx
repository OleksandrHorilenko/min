import React from 'react';
import { CircleLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="loader-container">
      <CircleLoader color="#3498db" size={50} />
      <div className="loader-text">loading...</div>
    </div>
  );
};

export default Loader;