import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Map, MapInfoWindow, MapMarker, ZoomControl, CustomOverlayMap, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { getStores } from '../../api/stores';
import { useDispatch, useSelector } from 'react-redux';
import { markerAddress } from '../../redux/modules/mapSlice';
import MarkerGray from '../../images/footprint_marker_navy.svg';
import toggleSlice, { toggleMap } from '../../redux/modules/toggleSlice';
import { openMarkerStoreModal, openStoreModal } from '../../redux/modules/storeAddSlice';
import KakaoCustomInfo from './KakaoCustomInfo';
import Button from './../shared/Button';
import Loading from '../shared/Loading/Loading/Loading';
import NotFound from '../shared/NotFound/NotFound';
import { styled } from 'styled-components';

function KakaoMap() {
  const { kakao } = window;
  const [post, setPost] = useState([]);
  const { isLoading, isError, data } = useQuery('stores', getStores);
  const mapRef = useRef(null);
  const [clickAddress, setClickAddress] = useState([]);
  const [level, setLevel] = useState(13);
  // 이건 나중에 사용해서 맵 중앙을 바꿀 수 있는 useState 훅입니다.
  // 기본위치값은 강서구입니다.
  const [latitude, setLatitude] = useState(37.5543737621718);
  const [longitude, setLongitude] = useState(126.83326640676);
  const [positionList, setPositionList] = useState([]);
  const [position, setPosition] = useState('');

  // 커스텀 인포박스 토글부분입니다.
  const toggleSelector = useSelector((state) => state.toggleSlice);
  const dispatch = useDispatch();
  const { lat, lng } = position;
  const [toggleCustom, setToggleCustom] = useState({ ...toggleSelector, render: 0 });
  const user = useSelector(({ user }) => user.user);

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
  const openModal = useCallback(
    (clickLocation) => {
      dispatch(openStoreModal({ clickLocation, type: 'add' }));
    },
    [clickAddress]
  );

  if (isLoading) return <Loading />;
  if (isError) return <NotFound />;

  return (
    <>
      <Map
        ref={mapRef}
        maxLevel={13}
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
        style={{ width: '100%', height: '94vh', padding: '20px' }}
        level={level}
      >
        <StPGuide>마우스 우클릭을 해 store을 추가해보세요</StPGuide>
        <MarkerClusterer
          // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          averageCenter={true}
          minLevel={10}
        >
          <ZoomControl position={window.kakao.maps.ControlPosition.TOPRIGHT} />
          {/* 클릭시 생성되는 마커(주소값 뿌려줌) */}
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
                  {user.userId && (
                    <Button
                      color="pink2"
                      size="small"
                      style={{ fontSize: '10px' }}
                      onClick={() => openModal(clickAddress.address_name)}
                    >
                      STORE ADD
                    </Button>
                  )}
                  <br />
                </div>
              )}
            </MapMarker>
          )}

          {/* 파이어스토어 데이터 마커  */}
          {post?.map((data, index) => {
            return (
              <div key={data + index}>
                <KakaoCustomInfo
                  index={index}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                  data={data}
                  position={position}
                />
              </div>
            );
          })}
        </MarkerClusterer>
      </Map>
    </>
  );
}

export default React.memo(KakaoMap);
const StPGuide = styled.p`
  position: absolute;
  left: 60%;
  z-index: 10;
  background-color: var(--color_pink2);
  padding: 5px 10px;
  font-size: 14px;
`;
