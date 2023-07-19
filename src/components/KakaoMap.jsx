import React, { useEffect, useState, useRef } from 'react';
import { Map, MapInfoWindow, MapMarker, ZoomControl, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { getStores } from '../api/stores';
import StoreInfoWindow from './map/StoreInfoWindow';
import { useDispatch } from 'react-redux';
import { markerAddress } from '../redux/modules/mapSlice';
import MarkerGray from '../images/footprint_marker_navy.svg';
import MarkerRed from '../images/footprint_marker_red.svg';
import styled from 'styled-components';
import KakaoCustomInto from './map/KakaoCustomInto';
import Mapcontents from './map/MapContents';
import Button from './Button';

function KakaoMap() {
  const { isLoading, isError, data } = useQuery('stores', getStores);
  const [posts, setPosts] = useState(data);
  const [latitude, setLatitude] = useState(37.5543737621718);
  const [longitude, setLongitude] = useState(126.83326640676);
  const [positionList, setPositionList] = useState([]);
  const [position, setPosition] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const { lat, lng } = position;

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
              <div
                style={{
                  padding: '7px',
                  color: 'rgb(0, 0, 0)',
                  width: '162px',
                  textAlign: 'center',
                  lineHeight: '20px'
                }}
              >
                이 store을
                <br /> 추가해보세요 <br />
                <Button color="pink2" size="small">
                  ADD
                </Button>
              </div>
            </MapMarker>
          )}

          {/* 마커찍어주기  */}
          {positionList.length >= newData.length &&
            newData.map((data, index) => {
              const { id, latlng, location, store, time } = data;
              let openCustom = false;
              return (
                <>
                  <MapMarker
                    onClick={() => {
                      setIsOpen(true);
                      console.log(openCustom);
                    }}
                    key={id + index}
                    position={latlng}
                    image={{
                      src: MarkerRed, // 마커이미지의 주소입니다
                      size: {
                        width: 64,
                        height: 69
                      }, // 마커이미지의 크기입니다
                      options: {
                        offset: {
                          x: 32,
                          y: 35
                        } // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                      }
                    }}
                  ></MapMarker>
                  {console.log(latlng)}
                  <CustomOverlayMap clickable={true} position={{ lat: latlng.lat + 0.004, lng: latlng.lng }}>
                    <KakaoCustomInto data={data} isOpen={true} />
                  </CustomOverlayMap>
                </>
              );
            })}
        </Map>
      }
    </>
  );
}

export default KakaoMap;

const StInfoContainer = styled.div`
  box-sizing: border-box;
  background-color: red;
  padding: 0.5rem 1.2rem;
  & div {
    margin-top: 0.4rem;
  }
  /* transform: translateY(-100px); */
`;
const StCustomInfoBox = styled.div`
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  width: 400px;
  padding: 1rem 1rem 1.6rem 1rem;
  border-radius: 5px;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    height: 50px;
    width: 50px;
    /* border-right-width: 0; */
    border-bottom-color: #fff;
  }
`;
const StCustomInfoHeader = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  & h4 {
    display: inline-block;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #000;
  }
  & button {
    display: flex;
    justify-content: center;
    align-self: center;
    border: 1px solid #000;
    width: 20px;
    height: 20px;
  }
`;
const StCustomInfoContentBox = styled.section`
  margin-top: 0.6rem;
  font-size: 12px;

  & h3 {
    flex: 1 0 274px;
    opacity: 0.8;
  }
  & p {
    margin-top: 0.3rem;
    opacity: 0.6;
  }
`;
