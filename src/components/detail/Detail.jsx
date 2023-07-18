import React from 'react';
import { useLocation } from 'react-router-dom';

const Detail = () => {
  const location = useLocation();
  console.log(location.state.location);
  return <div>Detail</div>;
};

export default Detail;
