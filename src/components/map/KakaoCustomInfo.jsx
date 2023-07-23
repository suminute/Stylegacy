import React, { useState } from 'react';
import footMarkerRed from '../../images/footprint_marker_red.svg';
import footMarkerPink from '../../images/footprint_marker_pink.svg';
import { MapMarker, useMap } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import Button from './../shared/Button';

function KakaoCustomInfo({ setLatitude, setLongitude, data }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const map = useMap();
  return (
    <>
      <MapMarker
        onClick={(marker) => {
          map.panTo(marker.getPosition());
          isOpen === false ? setIsOpen(true) : setIsOpen(false);
        }}
        // onClick={() => {
        //   isOpen === false ? setIsOpen(true) : setIsOpen(false);
        //   setLatitude(+data.marker.y);
        //   setLongitude(+data.marker.x);
        // }}
        clickable={true}
        key={data.id}
        position={{ lat: data.marker.y, lng: data.marker.x }}
        image={{
          src: isOpen ? footMarkerRed : footMarkerPink,
          size: {
            width: 64,
            height: 69
          },
          options: {
            offset: {
              x: 32,
              y: 35
            }
          }
        }}
      >
        {isOpen && (
          <StInfobox>
            <StInfoContainer>
              <h3>{data.store}</h3>
              <br />
              {data.location}
              <br />
              {data.time && ''}
            </StInfoContainer>

            <StButtonWrap>
              <Button
                color="pink2"
                size="small"
                full
                onClick={() => navigate(`/store/${data.id}`)}
                style={{ fontSize: '10px' }}
              >
                Detail
              </Button>
              <Button
                color="pink3"
                size="small"
                full
                onClick={() => setIsOpen(false)}
                style={{ fontSize: '10px', marginLeft: '5px' }}
              >
                Close
              </Button>
            </StButtonWrap>
          </StInfobox>
        )}
      </MapMarker>
    </>
  );
}

export default React.memo(KakaoCustomInfo);

const StInfobox = styled.div`
  min-width: 210px;
  padding: 0.5rem;
  box-sizing: border-box;
`;
const StInfoContainer = styled.div`
  padding: 5px;
  color: #363636;
  text-align: left;
  font-size: 14px;
  line-height: 1;
  & h3 {
    margin-bottom: 2px;
    color: #000;
    font-size: 18px;
  }
`;
const StButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;
