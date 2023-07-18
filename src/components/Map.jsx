import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setAddress } from '../redux/modules/mapSlice';

// 마커 꾸미기
//
const Map = () => {
  const dispatch = useDispatch();
  const { kakao } = window;
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오맵 생성
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 지도 초기 중심 위치
      level: 8 // 지도 확대 레벨
    };
    // 지도 생성
    const map = new kakao.maps.Map(container, options);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    var ps = new kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    ps.keywordSearch('고양이', placesSearchCB);

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      console.log('검색 결과, ', data);
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    }

    function displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x)
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(
          `<div style="    padding: 5px;
          font-size: 12px;
          text-align: center;
          width: 150px;
          box-sizing: border-box;">
            <p>${place.place_name}</p>
            <p>${place.phone}</p>
            <a href="${place.place_url}">링크</a>
            </div>`
        );
        infowindow.open(map, marker);
      });
    }

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
        // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다
      });
    }
    var infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

    // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);

    // 클릭 이벤트 핸들러 등록
    kakao.maps.event.addListener(map, 'rightclick', (mouseEvent) => {
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

      searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          var detailAddr = !!result[0].road_address
            ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>'
            : '';
          detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

          var content =
            '<div class="bAddr">' + `<span class="title">이곳을 등록하시겠습니까</span>` + detailAddr + '</div>';
          let address = result[0].address.address_name;
          dispatch(setAddress(address));

          // 마커를 클릭한 위치에 표시합니다
          marker.setPosition(mouseEvent.latLng);
          marker.setMap(map);

          // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
          infowindow.setContent(content);
          infowindow.open(map, marker);
        }
      });
    });

    // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'idle', function () {
      searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    });

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    function searchDetailAddrFromCoords(coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        for (var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === 'H') {
            return <div>${result[i].address_name}</div>;
          }
        }
      }
    }

    // // 지도에 컨트롤을 추가해야 지도위에 표시됩니다

    const zoomControl = new kakao.maps.ZoomControl();
    // map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    var mapTypeControl = new kakao.maps.MapTypeControl();
    // 마커 배열을 맵 객체에 추가하기 위한 프로퍼티 설정
    map.markers = [];

    // 우클릭 방지
  }, []);
  return (
    <>
      <div onContextMenu={(e) => e.preventDefault()} ref={mapRef} style={{ width: '100%', height: '100vh' }} />
    </>
  );
};

export default Map;
