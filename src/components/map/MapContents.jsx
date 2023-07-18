import React, { useState } from 'react';
import { styled } from 'styled-components';
import Button from '../Button';
import Posts from './Posts';
import AddPost from './StoreUpdateModal';

const Mapcontents = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <StDiv>
      <Form>
        <input placeholder="원하는 브랜드를 찾아보세요!" />

        <button>검색</button>
      </Form>
      <Button color="pink2" size="medium" full onClick={openModal}>
        장소 추가하기
      </Button>
      {isOpen && <AddPost type="add" closeModal={closeModal}></AddPost>}
      <div>
        <Posts />
      </div>
    </StDiv>
  );
};

export default Mapcontents;

const StDiv = styled.div`
  width: 450px;
  height: 94vh;
  background-color: var(--color_white);
  box-shadow: 0px 0px 9px 5px #00000014;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
`;
