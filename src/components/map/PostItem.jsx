import React, { useState } from 'react';
import StoreUpdateModal from './StoreUpdateModal';
import { useMutation, useQueryClient } from 'react-query';
import { deleteStore } from '../../api/maps';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // 쿼리
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(deleteStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });

  // 삭제 버튼
  const deleteOnClickHandler = (id) => {
    const deleteConf = window.confirm('정말 삭제하시겠습니까?');
    if (deleteConf) {
      deleteMutation.mutate(id);
    }
  };
  return (
    <StCard key={post.id}>
      <Link to={`/store/${post.id}`} state={{ location: post.location }}>
        <p>{post.id}</p>
        <p>{post.store}</p>
        <p>{post.location}</p>
        <p>{post.time}</p>
      </Link>
      <button onClick={openModal}>수정</button>
      {isOpen && <StoreUpdateModal type="update" closeModal={closeModal} id={post.id} post={post}></StoreUpdateModal>}
      <button onClick={() => deleteOnClickHandler(post.id)}>삭제</button>
    </StCard>
  );
};

export default PostItem;

const StCard = styled.div`
  border: 1px solid black;
  border-radius: 8px;
  margin: 20px;
  padding: 10px;
`;
