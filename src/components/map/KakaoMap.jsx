import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Map, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import heartMarkerNavy from '../../images/heart_marker_navy.svg';
import { openStoreModal } from '../../redux/modules/storeAddSlice';
import KakaoCustomInfo from './KakaoCustomInfo';
import Button from './../shared/Button';
import Loading from '../shared/Loading/Loading/Loading';
import NotFound from '../shared/NotFound/NotFound';
import { useSearchParams } from 'react-router-dom';
import { searchStores } from '../../algoiasearch';
import { styled } from 'styled-components';

function KakaoMap() {
  const { kakao } = window;
  const [post, setPost] = useState([]);
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const page = searchParams.get('page') || 0;
  const { isLoading, isError, data } = useQuery({
    queryKey: ['stores', +page],
    queryFn: () => searchStores(name, { page: +page }),
    keepPreviousData: true
  });
  const mapRef = useRef(null);
  const [clickAddress, setClickAddress] = useState([]);
  // 이건 나중에 사용해서 맵 중앙을 바꿀 수 있는 useState 훅입니다.
  // 기본위치값은 강서구입니다.
  const [latitude, setLatitude] = useState(37.5543737621718);
  const [longitude, setLongitude] = useState(126.83326640676);
  const [position, setPosition] = useState('');

  // 커스텀 인포박스 토글부분입니다.
  const dispatch = useDispatch();
  const { lat, lng } = position;
  const user = useSelector(({ user }) => user.user);

  useEffect(() => {
    if (isLoading) return;
    setPost((prev) => data.stores);
  }, [isLoading, data]);

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
        maxLevel={12}
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
        level={12}
      >
        <StPGuide>마우스 우클릭하여 store을 추가해보세요</StPGuide>
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
                src: heartMarkerNavy,
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
                  {/* <br /> */}
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
  left: 50%;
  z-index: 10;
  background-color: var(--color_pink2);
  padding: 5px 10px;
  font-size: 14px;
  transform: translate(-50%, 0px);
`;
