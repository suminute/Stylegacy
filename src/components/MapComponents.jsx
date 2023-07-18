import React, { useState, useRef } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useSelector } from 'react-redux';
import markerImg from './../images/heart_marker_red.svg';

function MapComponents() {
  const { kakao } = window;
  const [postion, setPosition] = useState(null);
  const mapRef = useRef(null);
  return (
    <>
      <Map
        // center={{ lat: postion-lat , lng: position-lng }} // 포지션 값을 써준다
        center={{ lat: 37.5665, lng: 126.978 }}
        style={{ width: '800px', height: '600px' }}
        level={3}
        ref={mapRef}
      >
        <MapMarker
          position={{ lat: 37.5665, lng: 126.978 }}
          image={{
            src: markerImg,
            size: {
              width: 40
            },
            options: {
              offset: {
                x: -211,
                y: 200
              }
            }
          }}
        />
      </Map>
      ;
    </>
  );
}

export default MapComponents;
