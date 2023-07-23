import { useSearchParams } from 'react-router-dom/dist';
import { useQuery } from 'react-query';
import Mapcontents from '../components/map/MapContents';
import { styled } from 'styled-components';
import { getStores } from '../api/stores';
import { useSelector } from 'react-redux';
import KakaoMap from '../components/map/KakaoMap';
import StoreAddModal from '../components/map/StoreAddModal';
import Loading from '../components/shared/Loading/Loading/Loading';
import NotFound from '../components/shared/NotFound/NotFound';

const Search = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const { isLoading, error, data } = useQuery(['stores', name], getStores);
  const { isOpen } = useSelector((state) => state.storeAddSlice);

  if (isLoading) return <Loading />;
  if (error) return <NotFound />;
  return (
    <Container style={{ height: 'calc(100vh - 75px)', overflow: 'hidden' }}>
      {isOpen && <StoreAddModal></StoreAddModal>}
        {/* <div>
      <Mapcontents style={{ position: 'absolute !important', top: '0', left: '0' }}>
        <div>
          {data.length > 0 &&
            data.map((place) => (
              <li key={place.id}>
                {place.name} : {place.address}
              </li>
            ))}
        </div> */}
      </Mapcontents>
      <KakaoMap style={{ position: 'absolute', top: '0', left: '0' }} />
    </Container>
  );
};

export default Search;

const Container = styled.div`
  position: relative;
  display: flex;
`;
