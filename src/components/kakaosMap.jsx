import React, { useEffect, useState, useRef } from 'react';
import { Map, MapInfoWindow, MapMarker, ZoomControl } from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { getStores } from '../api/stores';
import { useDispatch, useSelector } from 'react-redux';
import { markerAddress } from '../redux/modules/mapSlice';
import MarkerGray from '../images/footprint_marker_navy.svg';
import MarkerRed from '../images/footprint_marker_red.svg';
import styled from 'styled-components';

function KakaoMap() {
  const { isLoading, isError, data } = useQuery('stores', getStores);
  const [posts, setPosts] = useState(data);
  const [latitude, setLatitude] = useState(37.5543737621718);
  const [longitude, setLongitude] = useState(126.83326640676);
  const [positionList, setPositionList] = useState([]);
  const [position, setPosition] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const mapRef = useRef(null);
  const rightClickRef = useRef(null);
  const { lat, lng } = position;
  const dispatch = useDispatch();
  const toggleSelector = useSelector((state) => state.toggleSlice);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const geocodeAddress = () => {
      data &&
        data.map((el) => {
          return geocoder.addressSearch(el.location, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const { x, y } = result[0];
              setPositionList((prev) => [...prev, { lat: +y, lng: +x }]);
            }
          });
        });
    };
    geocodeAddress();
  }, [data]);

  // 받아온 데이터 주소 => 위도, 경도로 변환후 newData로 저장
  const newData =
    positionList.length > 0 &&
    data.map((el, index) => {
      return {
        ...el,
        latlng: positionList[index]
      };
    });

  if (isLoading) return '123';
  if (isError) return '123';
  return (
    <>
      {
        <Map
          ref={mapRef}
          center={{ lat: latitude, lng: longitude }}
          style={{ width: '100%', height: '60vh', padding: '20px' }}
          level={8} // 지도의 확대 레벨
          onClick={(e, event) => {
            setPosition({
              lat: event.latLng.getLat(),
              lng: event.latLng.getLng()
            });
            dispatch(markerAddress({ lat, lng }));
          }}
        >
          <ZoomControl position={window.kakao.maps.ControlPosition.TOPRIGHT} />
          {position && (
            <MapMarker
              position={position}
              ref={rightClickRef}
              image={{
                src: MarkerGray, // 마커이미지의 주소입니다
                size: {
                  width: 64,
                  height: 69
                }, // 마커이미지의 크기입니다
                options: {
                  offset: {
                    x: 27,
                    y: 69
                  } // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                }
              }}
            >
              <div style={{ padding: '5px', color: '#000' }}>
                Hello World! <br />
                <a
                  href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667"
                  style={{ color: 'blue' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  큰지도보기
                </a>{' '}
              </div>
            </MapMarker>
          )}

          {/* 마커찍어주기  */}
          {positionList.length >= newData.length &&
            newData.map((data, index) => {
              const { id, latlng, location, store, time } = data;
              return (
                <MapMarker
                  key={id + index}
                  position={latlng}
                  clickable={true}
                  image={{
                    src: MarkerRed, // 마커이미지의 주소입니다
                    size: {
                      width: 64,
                      height: 69
                    }, // 마커이미지의 크기입니다
                    options: {
                      offset: {
                        x: 20,
                        y: 80
                      } // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                    }
                  }}
                  onClick={() => setIsOpen(true)}
                >
                  {isOpen && (
                    <div style={{ minWidth: '150px', maxWidth: '300px' }}>
                      <img
                        alt="close"
                        width="14"
                        height="13"
                        src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
                        style={{
                          background: 'blue',
                          position: 'absolute',
                          right: '5px',
                          top: '5px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setIsOpen(false)}
                      />

                      <StInfoContainer>
                        <div>{id}</div>
                        <div>{location}</div>
                        <div>{store}</div>
                        <div>{time}</div>
                      </StInfoContainer>
                    </div>
                  )}
                </MapMarker>
              );
            })}
        </Map>
      }
    </>
  );
}

export default KakaoMap;

const StInfoContainer = styled.div`
  background-color: red;
  padding: 0.4rem 0.8rem;
  & div {
    margin-top: 0.4rem;
  }
  /* transform: translateY(-100px); */
`;
