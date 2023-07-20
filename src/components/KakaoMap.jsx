import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Map, MapInfoWindow, MapMarker, ZoomControl, CustomOverlayMap, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { getStores } from '../api/stores';
import { useDispatch, useSelector } from 'react-redux';
import { markerAddress } from '../redux/modules/mapSlice';
import MarkerGray from '../images/footprint_marker_navy.svg';
import MarkerRed from '../images/footprint_marker_red.svg';
import KakaoCustomInto from './map/KakaoCustomInto';
import Button from './Button';
import toggleSlice, { toggleMap } from '../redux/modules/toggleSlice';
import { styled } from 'styled-components';
import { openMarkerStoreModal, openStoreModal } from '../redux/modules/storeAddSlice';

function KakaoMap() {
  const { kakao } = window;
  const [post, setPost] = useState([]);
  const { isLoading, isError, data } = useQuery('stores', getStores);
  const mapRef = useRef(null);
  const [clickAddress, setClickAddress] = useState([]);

  // 이건 나중에 사용해서 맵 중앙을 바꿀 수 있는 useState 훅입니다.
  const [latitude, setLatitude] = useState(37.5543737621718);
  const [longitude, setLongitude] = useState(126.83326640676);
  const [positionList, setPositionList] = useState([]);
  const [position, setPosition] = useState('');

  // 커스텀 인포박스 토글부분입니다.
  const toggleSelector = useSelector((state) => state.toggleSlice);
  const dispatch = useDispatch();
  const { lat, lng } = position;
  const [toggleCustom, setToggleCustom] = useState({ ...toggleSelector, render: 0 });
  // const toggleSelector = useSelector((state) => toggleSlice);
  const [test, setTest] = useState('');
  useEffect(() => {
    setPost(data);
    // 주소 => 위도, 경도로 변환하는 함수입니다.
    const geocoder = new window.kakao.maps.services.Geocoder();
    const geocodeAddress = () => {
      data &&
        data.map((el) => {
          return geocoder.addressSearch(el.location, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const { x, y } = result[0];
              setTest(result[0]);
              setPositionList((prev) => [...prev, { lat: +y, lng: +x }]);
            }
          });
        });
    };
    geocodeAddress();
  }, [data]);

  // const [positions, setPositions] = useState([]);

  // useEffect(() => {
  //   // setPositions(clusterPositionsData.positions);
  // },[])

  // 검색시 주소를 얻습니다.
  // useEffect(() => {
  //   const geocoder = new window.kakao.maps.services.Geocoder();
  //   const geocodeAddress = () => {
  //     return geocoder.addressSearch(test, (result, status) => {
  //       if (status === window.kakao.maps.services.Status.OK) {
  //         const { x, y } = result[0];
  //       }
  //     });
  //   };
  //   geocodeAddress();
  //   // 주소 => 위도, 경도로 변환하는 함수입니다.
  // }, [test]);

  // 지도 클릭시 주소, 정보를 출력합니다
  const getCoor2Address = useCallback(
    (lat, lng) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2Address(lng, lat, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setClickAddress(result[0].address);
        }
      });
    },
    [lat, lng]
  );
  // 받아온 데이터 주소 => 위도, 경도로 변환후 newData로 저장

  if (isLoading) return '123';
  if (isError) return '123';
  // console.log(positionList);
  const openModal = (clickLocation) => {
    // setIsOpen(true);

    dispatch(openMarkerStoreModal({ bool: true, clickLocation }));
  };

  const newData =
    positionList.length > 0 &&
    post.map((el, index) => {
      return {
        ...el,
        latlng: positionList[index]
      };
    });

  return (
    <>
      {
        <Map
          ref={mapRef}
          center={{ lat: latitude, lng: longitude }}
          style={{ width: '100%', height: '60vh', padding: '20px' }}
          level={14} // 지도의 확대 레벨
          onClick={(e, event) => {
            setPosition({
              lat: event.latLng.getLat(),
              lng: event.latLng.getLng()
            });
            // dispatch(markerAddress({ lat, lng }));
            getCoor2Address(event.latLng.getLat(), event.latLng.getLng());
          }}
        >
          <MarkerClusterer
            averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel={10} // 클러스터 할 최소 지도 레벨
          >
            {console.log(newData)}
            {newData &&
              newData.map((pos, idx) => (
                <CustomOverlayMap
                  key={`${pos.id}`}
                  position={{
                    lat: pos.lat,
                    lng: pos.lng
                  }}
                >
                  <div
                    style={{
                      color: 'black',
                      textAlign: 'center',
                      background: 'white',
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%'
                    }}
                  >
                    {idx}
                  </div>
                </CustomOverlayMap>
              ))}
            <ZoomControl position={window.kakao.maps.ControlPosition.TOPRIGHT} />
            {position && (
              <MapMarker
                onClick={() => {
                  setLatitude(position.lat);
                  setLongitude(position.lng);
                }}
                style={{
                  pointerEvents: 'none'
                }}
                position={position}
                image={{
                  src: MarkerGray,
                  size: {
                    width: 64,
                    height: 69
                  },
                  options: {
                    offset: {
                      x: 32,
                      y: 69
                    }
                  }
                }}
              >
                <div
                  style={{
                    padding: '10px ',
                    color: 'rgb(0, 0, 0)',
                    width: '190px',
                    textAlign: 'center'
                  }}
                >
                  {clickAddress.address_name}
                  <Button color="pink2" size="small" onClick={() => openModal(clickAddress.address_name)}>
                    STORE ADD
                  </Button>
                  <br />
                </div>
              </MapMarker>
            )}
            {/* {console.log(toggleCustom)} */}
            {/* 마우스 클릭 마커  */}
            {positionList.length >= newData.length &&
              newData.map((data, index) => {
                const { id, latlng } = data;
                return (
                  <>
                    <MapMarker
                      onClick={() => {
                        dispatch(toggleMap({ ...toggleCustom, state: true, index }));
                        setToggleCustom({ ...toggleCustom, state: true, index });
                        setLatitude(latlng.lat);
                        setLongitude(latlng.lng);
                      }}
                      key={id + index}
                      position={latlng}
                      image={{
                        src: MarkerRed,
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
                    ></MapMarker>
                    {/* {console.log(toggleCustom.state === true && toggleCustom.index === index)} */}
                    {toggleCustom.state === true && toggleCustom.index === index ? (
                      <CustomOverlayMap
                        xAnchor={0.5}
                        yAnchor={1.5}
                        clickable={true}
                        position={{ lat: latlng.lat, lng: latlng.lng }}
                      >
                        <KakaoCustomInto clickable={true} data={data} index={index} />
                      </CustomOverlayMap>
                    ) : null}
                  </>
                );
              })}
          </MarkerClusterer>
        </Map>
      }
      <input
        onChange={(e) => setTest(e.target.value)}
        style={{ display: 'inline-block', marginLeft: '500px' }}
        type="text"
        value={test}
      />
    </>
  );
}

export default React.memo(KakaoMap);
