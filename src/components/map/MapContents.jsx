import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import Button from '../shared/Button';
import Posts from './Posts';
import SearchBar from '../shared/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { openStoreModal } from '../../redux/modules/storeAddSlice';

import svgImg from '../../images/Back To.svg';

const Mapcontents = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector(({ user }) => user.user);
  const dispatch = useDispatch();
  const openModal = () => {
    dispatch(openStoreModal({ type: 'add' }));
  };

  const onClickAddButton = () => {
    if (user.userId) {
      openModal();
    } else {
      window.alert('로그인 후 사용 가능합니다!');
    }
  };

  return (
    <>
      <StLeftBox className={isOpen ? 'toggle' : null}>
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

        <StToggleBtnBox>
          <button
            onClick={() => {
              setIsOpen((prev) => !isOpen);
            }}
          >
            <img className={isOpen ? 'toggleImg' : null} src={svgImg} alt="버튼 이미지" />
          </button>
        </StToggleBtnBox>
      </StLeftBox>
    </>
  );
};

export default React.memo(Mapcontents);
const StLeftBox = styled.div`
  position: relative;
  transition: transform ease-in 0.3s;
`;
const StToggleBtnBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  right: 0;
  border-radius: 0px 5px 5px 0;
  width: 50px;
  height: 140px;
  transform: translate(100%, -50%);
  z-index: 10;
  background: #fff;
`;
const StToggleBtn = styled.div`
  position: relative;
`;
const StDiv = styled.div`
  position: relative;
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

const Form = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px 30px;
  & input:focus {
    outline: none;
  }
`;

const StPostDiv = styled.div`
  display: grid;
  margin-top: 20px;
`;
