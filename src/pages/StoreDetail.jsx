import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const StoreDetail = () => {
  const { id } = useParams();
  // const { isLoading, error, data } = useQuery(['stores', id], () => getStoreData(id));
  const location = useLocation();
  console.log(location.state.location);

  // const getStoreData = async (id) => {
  //   const q = query(collection(db, 'stores'), where('storeId', '==', id));
  //   const querySnap = await getDocs(q);
  //   const docSnap = querySnap.docs[0];
  //   if (docSnap?.exists()) return { ...docSnap.data(), id: docSnap.id };
  // };

  const data = {
    id: 'lGBXdJibgGduq4GDvjS8',
    site: 'https://www.instagram.com/tonywack_readytowear',
    phoneNumber: '070-7765-5578',
    marker: {
      x: 127.005920167659,
      y: 37.5377214021121
    },
    image:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220815_97%2F166056034235103u8W_JPEG%2F45553d3b7e8e7d2e2dacfceb2c62a5da.jpg',
    store: '토니웩 한남',
    time: '12:00-20:30',
    location: '서울 용산구 한남대로28가길 19',
    like: 0
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error</div>;
  return (
    <StContainer>
      <StStore>
        <StStoreCol>
          <StoreImage src={data.image} alt={data.store} width="500" height="625" />
          <StoreButton>웹 사이트</StoreButton>
        </StStoreCol>
        <StStoreCol>
          <StStoreInfo>
            <StStoreTitle>{data.store}</StStoreTitle>
            <div>
              <StStoreInfoLabel>주소</StStoreInfoLabel>
              <StStoreInfoContent>{data.location}</StStoreInfoContent>
            </div>
            <div>
              <StStoreInfoLabel>영업시간</StStoreInfoLabel>
              <StStoreInfoContent>{data.time}</StStoreInfoContent>
            </div>
            <div>
              <StStoreInfoLabel>전화번호</StStoreInfoLabel>
              <StStoreInfoContent>{data.phoneNumber}</StStoreInfoContent>
            </div>
          </StStoreInfo>
          <StaticMap lng={data.marker.x} lat={data.marker.y} title={data.location} />
        </StStoreCol>
      </StStore>
      <StDivider />
      <StCommentsContainer>
        <StCommentsTitle>
          댓글<StCommentsCount>2</StCommentsCount>
        </StCommentsTitle>
        <StCommentsList>
          <StComment>
            <div>
              <StCommentName>히히하호호홍</StCommentName>
              <StCommentContent>7월 말까지 30% 세일이네요</StCommentContent>
            </div>
            <StCommentDate>2023-07-18</StCommentDate>
          </StComment>
          <StComment>
            <div>
              <StCommentName>히히하호호홍</StCommentName>
              <StCommentContent>7월 말까지 30% 세일이네요</StCommentContent>
            </div>
            <StCommentDate>2023-07-18</StCommentDate>
          </StComment>
        </StCommentsList>
      </StCommentsContainer>
    </StContainer>
  );
};

export default StoreDetail;

const StCommentsList = styled.ul`
  background-color: var(--color_pink3);
  padding: 3rem;
  border-radius: 10px;
  width: 1100px;
`;

const StComment = styled.li`
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  padding: 1rem;
`;
const StCommentName = styled.span`
  margin-right: 2rem;
`;

const StCommentContent = styled.span`
  color: var(--color_gray);
`;
const StCommentDate = styled.span`
  color: var(--color_gray);
`;

const StCommentsTitle = styled.h3`
  font-size: 2.25rem;
  text-align: left;
  margin: 2rem 0;
`;

const StCommentsCount = styled.span`
  color: var(--color_pink1);
  margin-left: 0.75rem;
  font-weight: 900;
`;

const StoreButton = styled.button`
  padding: 0.6em;
  font-size: 1.5rem;
  border-radius: 0.625rem;
  background-color: var(--color_white);
  border: 6px solid var(--color_pink3);
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
`;

const StContainer = styled.div`
  padding: 50px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StStore = styled.div`
  display: flex;
  gap: 4rem;
`;

const StStoreCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.25rem;
`;

const StStoreTitle = styled.h2`
  margin: 2rem 0;
  font-size: 2rem;
`;

const StStoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StStoreInfoLabel = styled.h4`
  color: var(--color_gray);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const StStoreInfoContent = styled.p`
  font-size: 1.25rem;
`;

const StoreImage = styled.img`
  border-radius: 10px;
  object-fit: cover;
  box-shadow: rgb(50 50 93 / 37%) 0px 6px 12px -2px, rgb(0 0 0 / 42%) 0px 3px 7px -3px;
`;

const StCommentsContainer = styled.div``;
const StDivider = styled.div`
  width: 1300px;
  margin: 4rem 0;
  height: 2px;
  background-color: #d48888;
`;

const StaticMap = ({ lat, lng, title }) => {
  const mapContainerRef = useRef(null);
  const staticMapRef = useRef(null);
  useEffect(() => {
    window.kakao.maps.load(function () {
      const option = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
        marker: {
          position: new window.kakao.maps.LatLng(lat, lng)
        }
      };
      staticMapRef.current = new window.kakao.maps.StaticMap(mapContainerRef.current, option);
    });
  }, [lat, lng]);

  return (
    <StMapContainer>
      <StMap ref={mapContainerRef}></StMap>
      <StMapTitle>
        <span>{title}</span>
      </StMapTitle>
    </StMapContainer>
  );
};

const StMapContainer = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
`;

const StMap = styled.div`
  width: 500px;
  height: 300px;
`;
const StMapTitle = styled.div`
  padding: 1rem;
  position: absolute;
  width: 100%;
  font-size: 1.25rem;
  background-color: rgba(0, 0, 0, 0.714);
  bottom: 0;
  color: white;
  display: flex;
  align-items: center;
`;
