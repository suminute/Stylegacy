import { useSearchParams } from 'react-router-dom/dist';
import { storeSearch } from '../algoiasearch';
import { useQuery } from 'react-query';
import Mapcontents from '../components/map/MapContents';
import Map from '../components/Map';
import { styled } from 'styled-components';
import { getStores } from '../api/stores';
import StoreUpdateModal from '../components/map/StoreUpdateModal';
import { useSelector } from 'react-redux';
import KakaoMap from '../components/KakaoMap';

const Search = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const { isLoading, error, data } = useQuery(['stores', name], getStores);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  return (
    <Container>
      <StoreUpdateModal type="add"></StoreUpdateModal>
      <Mapcontents>
        <div>
          {data.length > 0 &&
            data.map((place) => (
              <li key={place.objectID}>
                {place.name} : {place.address}
              </li>
            ))}
        </div>
      </Mapcontents>
      <Stdiv>
        <KakaoMap />
      </Stdiv>
    </Container>
  );
};

export default Search;

const Container = styled.div`
  display: flex;
`;

const Stdiv = styled.div`
  width: 100%;
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  /* z-index: 0; */
`;
