import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useQuery } from 'react-query';
import { getStores } from '../api/stores';

function KakaosMap() {
  const { isLoading, isError, data } = useQuery('stores', getStores);
  const [posts, setPosts] = useState(data);
  const [address, setAddress] = useState([]);
  const [latitude, setLatitude] = useState(37.5543737621718);
  const [longitude, setLongitude] = useState(126.83326640676);
  const [position, setPosition] = useState([]);
  const [zoomable, setZoomable] = useState(true);
  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  useEffect(() => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const geocodeAddress = () => {
      data &&
        data.map((el) => {
          return geocoder.addressSearch(el.location, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const { x, y } = result[0];
              setPosition((prev) => [...prev, { lat: x, lng: +y }]);
            }
          });
        });
    };
    geocodeAddress();
  }, [data]);

  const newData =
    data &&
    data.map((el, index) => {
      return {
        ...el,
        latlng: position[index]
      };
    });

  // const handleDoubleClick = (_t, mouseEvent) => {
  //   // 더블클릭한 위치의 좌표로 position 상태 업데이트
  //   setPosition({
  //     lat: mouseEvent.latLng.getLat(),
  //     lng: mouseEvent.latLng.getLng()
  //   });

  //   // zoomable 상태를 false로 업데이트하여 지도 확대/축소 비활성화
  //   setZoomable(false);
  // };

  if (isLoading) return '123';
  if (isError) return '123';
  // lat: 33.450701,
  // lng: 126.570667,

  return (
    <>
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 33.450701,
          lng: 126.570667
        }}
        style={{
          width: '100%',
          height: '450px'
        }}
        zoomable={zoomable}
        level={8} // 지도의 확대 레벨
        onClick={(_t, mouseEvent) => {
          console.log(_t, mouseEvent);
          setPosition({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng()
          });
        }}
      >
        {position && <MapMarker position={position} />}
      </Map>
    </>
  );
}

export default KakaosMap;
