import React from 'react';
import { styled } from 'styled-components';
import Button from '../shared/Button';
import Posts from './Posts';
import SearchBar from '../shared/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { openStoreModal } from '../../redux/modules/storeAddSlice';

const Mapcontents = () => {
  const user = useSelector(({ user }) => user.user);
  const dispatch = useDispatch();
  const openModal = () => {
    dispatch(openStoreModal(true));
  };

  const onClickAddButton = () => {
    if (user.userId) {
      openModal();
    } else {
      window.alert('로그인 후 사용 가능합니다!');
    }
  };

  return (
    <StDiv>
      <Form>
        <SearchBar size="small" />
      </Form>
      <Button className="addBTN" color="pink2" size="large" full onClick={onClickAddButton}>
        장소 추가하기
      </Button>
      <StPostDiv>
        <Posts />
      </StPostDiv>
    </StDiv>
  );
};

export default React.memo(Mapcontents);

const StDiv = styled.div`
  bottom: 0;
  min-width: 600px;
  max-width: 600px;
  height: 94vh;
  background-color: var(--color_white);
  box-shadow: 0px 0px 9px 5px #00000014;
  z-index: 50;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  & .addBTN {
    font-weight: 600;
  }
  & .addBTN:hover {
    background-color: var(--color_pink1);
    color: white;
  }
  & .addBTN:disabled {
    background-color: var(--color_gray2);
    color: black;
  }
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px 30px;
`;

const StPostDiv = styled.div`
  display: grid;
  margin-top: 20px;
`;
