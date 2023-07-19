import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress } from '../redux/modules/mapSlice';
import footNavyMarkerImg from '../images/footprint_marker_navy.svg';
import footRedMarkerImg from '../images/footprint_marker_red.svg';
import { useQuery } from 'react-query';
import { getStores } from '../api/stores';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { styled } from 'styled-components';
import './Map.css';
import { useSearchParams } from 'react-router-dom';

const Map = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { kakao } = window;
  const [searchParams] = useSearchParams();
  const geocoder = new kakao.maps.services.Geocoder();

  const { isLoading, isError, data } = useQuery('stores', getStores);

  useEffect(() => {
    const param = searchParams.get('name') || '';
    // 카카오맵 생성
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(37.566295, 126.977945), // 지도 초기 중심 위치
      level: 1 // 지도 확대 레벨
    };
    // 지도 생성
    const map = new kakao.maps.Map(container, options);

    // 인포윈도우 생성
    const infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

    // 🥝 키워드 장소 검색
    // 주소-좌표 변환 객체를 생성합니다
    const aab =
      data &&
      data.filter((el) => {
        return el.location === param || el.store === param;
      });

    console.log(aab);
    const ps = new kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    ps.keywordSearch(param, placesSearchCB);

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      console.log('검색 결과, ', data);
      if (status === kakao.maps.services.Status.OK) {
        //     // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        //     // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        //     // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
      console.log(data);
    }
    // 마커 이미지 표시
    const imageSize = new kakao.maps.Size(40, 50); // 마커이미지의 크기입니다
    const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커 이미지 포지션.
    const markerImage = new kakao.maps.MarkerImage(footRedMarkerImg, imageSize, imageOption);
    const markerPosition = new kakao.maps.LatLng(37.54699, 127.09598); // 마커가 표시될 위치입니다
    function displayMarker(place) {
      //   // 마커를 생성하고 지도에 표시합니다
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
        image: markerImage // 마커이미지 설정
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', function () {
        //   // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
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
    // 🥝 키워드 검색부분 여기까지

    //🍇 firestore 데이터 마커 뿌려주기
    const abc = async () => {
      try {
        // 비동기적으로 data를 가져온다고 가정하고 await을 사용하여 기다립니다.
        const abcAdress = await getDataFromFirebase();

        // data를 받아왔을 때에만 map 메서드를 실행합니다.

        const coordinatesArray = await Promise.all(
          abcAdress.map((x) => {
            return new Promise((resolve) => {
              geocoder.addressSearch(x.location, function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                  // 주소로부터 좌표를 성공적으로 얻어왔을 때 처리
                  const latitude = result[0].y;
                  const longitude = result[0].x;
                  // resolve({ title: x.store, x: longitude, y: latitude });
                  // console.log(longitude, latitude);
                  resolve({ title: x.store, latlng: new kakao.maps.LatLng(latitude, longitude) });
                } else {
                  // 주소로부터 좌표를 가져오는데 실패했을 때 처리
                  resolve(null);
                }
              });
            });
          })
        );
        // 이제 coordinatesArray 배열에 각 주소의 좌표가 들어있습니다.
        // 필요에 따라서 이후 작업을 수행합니다.

        // 비동기적으로 데이터를 가져오는 함수 예시
        function getDataFromFirebase() {
          return new Promise((resolve) => {
            // 파이어베이스에서 데이터를 가져온다고 가정하고 비동기 처리
            setTimeout(() => {
              const qwedata = data;
              resolve(qwedata);
            }, 1000); // 1초 후 데이터를 가져온 것으로 가정
          });
        }

        // 마커 생성
        const positions = coordinatesArray;
        // 여러개 마커이미지 띄워주기
        for (let i = 0; i < positions.length; i++) {
          // 마커 이미지의 이미지 크기 입니다
          const imageSize = new kakao.maps.Size(35, 40);
          // console.log(imageSize);
          // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
          const dataMarkerImage = new kakao.maps.MarkerImage(footNavyMarkerImg, imageSize);
          // 마커를 생성합니다
          const marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: dataMarkerImage // 마커 이미지
            // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다
          });
          // console.log(coordinatesArray);
          // console.log('167', marker);
        }
      } catch (error) {
        // 에러 처리
        console.error('Error fetching data:', error);
      }
    };

    abc();
    //🍇 여기까지 firestore 데이터 마커 뿌려주기

    // 🍉 지도 클릭했을때 마커 생성 및 store 추가 인포 생성
    // 클릭 이벤트 핸들러 등록
    kakao.maps.event.addListener(map, 'rightclick', (mouseEvent) => {
      const latlng = mouseEvent.latLng;

      // 기존 마커 제거
      map.markers.forEach((marker) => marker.setMap(null));
      map.markers = [];

      // 클릭한 위치에 마커 생성
      const imageSize = new kakao.maps.Size(40, 60);
      const imageOption = { offset: new kakao.maps.Point(20, 50) };
      const markerImage = new kakao.maps.MarkerImage(footRedMarkerImg, imageSize, imageOption);
      const markerPosition = new kakao.maps.LatLng(37.54699, 127.09598);
      const marker = new kakao.maps.Marker({
        position: latlng,
        image: markerImage
        // draggable: true
      });

      marker.setMap(map);
      map.markers.push(marker);

      // 클릭했을 때 마커 인포

      function searchDetailAddrFromCoords(coords, callback) {
        // 좌표로 법정동 상세 주소 정보를 요청합니다
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
      }

      searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          let detailAddr = !!result[0].road_address
            ? `<h3>${result[0].road_address.address_name} '</h3>`
            : `<h3>${result[0].address.address_name}</h3>`;
          const btn = (
            <button
              onClick={() => {
                console.log(12);
              }}
            ></button>
          );
          const fnc = console.log(12);

          const content = `<div class="bAddr infoBox">
          ${detailAddr}
              <p class="info">이곳을 등록하시겠습니까</p>
              <p></p>
              
            </div>`;

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
    // 🍉 여기까지 지도 클릭했을때 마커 생성 및 store 추가 인포 생성

    // 🍊 지도 줌인, 줌아웃 컨트롤 버튼
    // // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    const zoomControl = new kakao.maps.ZoomControl();
    // map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    const mapTypeControl = new kakao.maps.MapTypeControl();
    // 마커 배열을 맵 객체에 추가하기 위한 프로퍼티 설정
    map.markers = [];
  }, [data]);
  // 🍊 여기까지 지도 줌인, 줌아웃 컨트롤 버튼

  // 🗑️ 아래 코드는 무슨 코드인지 모르겠으니 마지막에 필요없다면 삭제 요망

  // // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
  // kakao.maps.event.addListener(map, 'idle', function () {
  //   searchAddrFromCoords(map.getCenter(), displayCenterInfo);
  // });

  // function searchAddrFromCoords(coords, callback) {
  //   // 좌표로 행정동 주소 정보를 요청합니다
  //   geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
  // }

  // // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
  // function displayCenterInfo(result, status) {
  //   if (status === kakao.maps.services.Status.OK) {
  //     for (let i = 0; i < result.length; i++) {
  //       // 행정동의 region_type 값은 'H' 이므로
  //       if (result[i].region_type === 'H') {
  //         return <div>${result[i].address_name}</div>;
  //       }
  //     }
  //   }
  // }

  if (isLoading) return <p>얍얍ㅇ뱌</p>;
  return (
    <>
      <div onContextMenu={(e) => e.preventDefault()} ref={mapRef} style={{ width: '100%', height: '94vh' }}></div>
    </>
  );
};

export default Map;

const StInfoWindow = styled.div`
  background-color: red;
`;
