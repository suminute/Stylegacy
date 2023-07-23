import React, { useEffect, useRef } from 'react'
import styled from 'styled-components';

const StaticMap = ({ lat, lng, title }) => {
  const mapContainerRef = useRef(null);
  const staticMapRef = useRef(null);
  useEffect(() => {
    window.kakao.maps.load(function () {
      const centerPosition = new window.kakao.maps.LatLng(lat, lng);
      const option = {
        center: centerPosition,
        level: 3,
        marker: {
          position: centerPosition
        }
      };
      staticMapRef.current = new window.kakao.maps.StaticMap(mapContainerRef.current, option);
    });
  }, [lat, lng]);

  return (
    <StMapContainer>
      <StMap ref={mapContainerRef}></StMap>
      {title && (
      <StMapTitle>
        <span>{title}</span>
      </StMapTitle>
      )}
    </StMapContainer>
  );
};

export default StaticMap


const StMapContainer = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  pointer-events: none;
`;

const StMap = styled.div`
  width: 500px;
  height: 300px;
`;
const StMapTitle = styled.div`
  padding: 1rem;
  position: absolute;
  width: 100%;
  font-size: 1.25rem;
  background-color: rgba(0, 0, 0, 0.714);
  bottom: 0;
  color: white;
  display: flex;
  align-items: center;
`;