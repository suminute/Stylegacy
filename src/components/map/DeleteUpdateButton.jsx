import React from 'react';
import { styled } from 'styled-components';

const DeleteUpdateButton = ({ openUpdateModal, deleteOnClickHandler, postId }) => {
  return (
    <>
      <StButton onClick={openUpdateModal}>수정</StButton>
      <StButton onClick={() => deleteOnClickHandler(postId)}>삭제</StButton>
    </>
  );
};

export default DeleteUpdateButton;

const StButton = styled.button`
  margin: 5px 5px 5px 5px;
  padding: 5px;
  border: 1px solid var(--color_pink1);
  color: var(--color_pink1);
  font-weight: 700;
  border-radius: 8px;
  background-color: white;

  &:hover {
    color: white;
    background-color: var(--color_pink1);
  }
`;
