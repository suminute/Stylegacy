import React, { useEffect, useRef } from 'react';

// https://apis.map.kakao.com/web/sample/coord2addr/
// [important!!‼️‼️] 마커 찍은 위치 경도,위도-> store 주소로 변환
// 정보 가져와서 뿌려주기 ( 마커, 가게정보들 ) 인포 표시
// 주소 검색시 포커스
// 마커 꾸미기
//
const Map = () => {
  const { kakao } = window;
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오맵 생성
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(33.450705, 126.570677), // 지도 초기 중심 위치
      level: 8 // 지도 확대 레벨
    };
    // 지도 생성
    const map = new kakao.maps.Map(container, options);

    // 마커를 표시할 위치와 title 객체 배열입니다
    var positions = [
      {
        title: '카카오',
        latlng: new kakao.maps.LatLng(33.450705, 126.570677)
      },
      {
        title: '생태연못',
        latlng: new kakao.maps.LatLng(33.450936, 126.569477)
      },
      {
        title: '텃밭',
        latlng: new kakao.maps.LatLng(33.450879, 126.56994)
      },
      {
        title: '근린공원',
        latlng: new kakao.maps.LatLng(33.451393, 126.570738)
      }
    ];

    // 이미지 아이콘
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

    // 여러개 마커이미지 띄워주기
    for (var i = 0; i < positions.length; i++) {
      // 마커 이미지의 이미지 크기 입니다
      var imageSize = new kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage // 마커 이미지
      });
    }

    // 클릭 이벤트 핸들러 등록
    kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const latlng = mouseEvent.latLng;

      // 기존 마커 제거
      map.markers.forEach((marker) => marker.setMap(null));
      map.markers = [];

      // 클릭한 위치에 마커 생성
      const marker = new kakao.maps.Marker({
        position: latlng,
        draggable: true
      });
      marker.setMap(map);
      map.markers.push(marker);
    });

    var mapTypeControl = new kakao.maps.MapTypeControl();

    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    var mapTypeControl = new kakao.maps.MapTypeControl();
    // 마커 배열을 맵 객체에 추가하기 위한 프로퍼티 설정
    map.markers = [];
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
