import Mapcontents from '../components/map/MapContents';
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';
import KakaoMap from '../components/map/KakaoMap';
import StoreAddModal from '../components/map/StoreAddModal';

const Search = () => {
  const { isOpen } = useSelector((state) => state.storeAddSlice);

  return (
    <Container style={{ height: 'calc(100vh - 75px)', overflow: 'hidden' }}>
      {isOpen && <StoreAddModal></StoreAddModal>}
      <Mapcontents style={{ position: 'absolute !important', top: '0', left: '0' }} />
      <KakaoMap style={{ position: 'absolute', top: '0', left: '0' }} />
    </Container>
  );
};

export default Search;

const Container = styled.div`
  position: relative;
  display: flex;
`;
