import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Map, MapInfoWindow, MapMarker, ZoomControl, CustomOverlayMap, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { getStores } from '../api/stores';
import { useDispatch, useSelector } from 'react-redux';
import { markerAddress } from '../redux/modules/mapSlice';
import MarkerGray from '../images/footprint_marker_navy.svg';
import KakaoCustomInto from './map/KakaoCustomInto';
import Button from './Button';
import toggleSlice, { toggleMap } from '../redux/modules/toggleSlice';
import { openMarkerStoreModal, openStoreModal } from '../redux/modules/storeAddSlice';
import KakaoCustomInfo from './map/KakaoCustomInfo';

function KakaoMap() {
  const { kakao } = window;
  const [post, setPost] = useState([]);
  const { isLoading, isError, data } = useQuery('stores', getStores);
  const mapRef = useRef(null);
  const [clickAddress, setClickAddress] = useState([]);
  const [level, setLevel] = useState(14);

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
  //

  const [test, setTest] = useState('');
  useEffect(() => {
    setPost(data);
  }, [data]);

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

  const openModal = (clickLocation) => {
    dispatch(openMarkerStoreModal({ bool: true, clickLocation }));
  };

  return (
    <>
      <Map
        ref={mapRef}
        // 지도 확대 축소 키보드 이벤트
        keyboardShortcuts={true}
        onRightClick={(e, event) => {
          setPosition({
            lat: event.latLng.getLat(),
            lng: event.latLng.getLng()
          });
          getCoor2Address(event.latLng.getLat(), event.latLng.getLng());
        }}
        center={{ lat: latitude, lng: longitude }}
        style={{ width: '100%', height: '60vh', padding: '20px' }}
        level={level}
        onClick={(e, event) => {}}
      >
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={10} // 클러스터 할 최소 지도 레벨
        >
          {post?.map((pos, idx) => (
            <CustomOverlayMap
              key={pos.id + idx}
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
              {clickAddress.address_name && (
                <div
                  style={{
                    padding: '10px ',
                    color: 'rgb(0, 0, 0)',
                    width: '190px',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                >
                  {/* 인포에 출력되는 주소명 메세지입니다 */}
                  {clickAddress.address_name}
                  <Button
                    color="pink2"
                    size="small"
                    style={{ fontSize: '10px' }}
                    onClick={() => openModal(clickAddress.address_name)}
                  >
                    STORE ADD
                  </Button>
                  <br />
                </div>
              )}
            </MapMarker>
          )}

          {/* 마우스 클릭 마커  */}
          {post?.map((data, index) => {
            return (
              <>
                {/* <MapMarker
                  onClick={() => {
                    dispatch(toggleMap({ ...toggleCustom, state: true, index }));
                    setToggleCustom({ ...toggleCustom, state: true, index });
                    setLatitude(data.marker.y);
                    setLongitude(data.marker.x);

                    setIsOpen(!isOpen);
                  }}
                  clickable={true}
                  key={data.id + index}
                  position={{ lat: data.marker.y, lng: data.marker.x }}
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
                > */}
                {/* MapMarker의 자식을 넣어줌으로 해당 자식이 InfoWindow로 만들어지게 합니다 */}
                {/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}
                <KakaoCustomInfo
                  index={index}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                  data={data}
                  position={position}
                />
                {/* 슬기 인포 */}
                {/* {isOpen && (
                    <div style={{ minWidth: '150px' }}>
                      <img
                        alt="close"
                        width="14"
                        height="13"
                        src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
                        style={{
                          position: 'absolute',
                          right: '5px',
                          top: '5px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setIsOpen(false)}
                      />
                      <div style={{ padding: '5px', color: '#000' }}>Hello World!</div>
                    </div>
                  )} */}

                {/* 홍민 인포 */}
                {/* {console.log(toggleCustom.state === true && toggleCustom.index === index)}
                  {toggleCustom.state === true && toggleCustom.index === index ? (
                    <CustomOverlayMap
                      xAnchor={0.5}
                      yAnchor={1.5}
                      clickable={true}
                      position={{ lat: latlng.lat, lng: latlng.lng }}
                    >
                      <KakaoCustomInto clickable={true} data={data} index={index} />
                    </CustomOverlayMap>
                  ) : null} */}
              </>
            );
          })}
        </MarkerClusterer>
      </Map>
    </>
  );
}

export default React.memo(KakaoMap);
