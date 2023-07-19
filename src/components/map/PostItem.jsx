import React, { useState } from 'react';
import StoreUpdateModal from './StoreUpdateModal';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteStore } from '../../api/maps';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addLike, decreaseLikeCount, getLikes, increaseLikeCount, removeAllLike, removeLike } from '../../api/likes';

const PostItem = ({ post }) => {
  // user 정보
  const { user } = useSelector((state) => state.user);
  const userId = user.userId;

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // 리액트 쿼리 (항상 컴포넌트 최상위에서 동일한 순서로 호출되어야 한다.)
  const queryClient = useQueryClient();
  // 게시글 삭제
  const deleteMutation = useMutation(deleteStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });
  // 좋아요 및 취소
  const addLikeMutation = useMutation(addLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes', post.id]);
    }
  });
  const removeLikeMutation = useMutation(removeLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes', post.id]);
    }
  });
  // 좋아요 수 카운트
  const increaseLikeCountMutation = useMutation(increaseLikeCount, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stores'], post.id);
    }
  });
  const decreaseLikeCountMutation = useMutation(decreaseLikeCount, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stores'], post.id);
    }
  });
  // 게시글 삭제 시, 해당 좋아요 문서 삭제
  const removeAllLikeMutation = useMutation(removeAllLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes'], post.id);
    }
  });

  // 게시글 삭제 버튼
  const deleteOnClickHandler = (id) => {
    const deleteConf = window.confirm('정말 삭제하시겠습니까?');
    if (deleteConf) {
      deleteMutation.mutate(id);
      removeAllLikeMutation.mutate(post.id);
    }
  };

  // 좋아요
  const { isLoading, data: likes } = useQuery(['likes', post.id], () => getLikes(post.id));
  const isLiked = likes ? likes.includes(userId) : undefined;
  if (isLoading) return <div>Loading...</div>;

  // 좋아요 버튼
  const handleLikeClick = () => {
    if (isLiked) {
      removeLikeMutation.mutate({ userId, storeId: post.id });
      decreaseLikeCountMutation.mutate(post.id);
    } else {
      addLikeMutation.mutate({ userId, storeId: post.id });
      increaseLikeCountMutation.mutate(post.id);
    }
  };

  return (
    <StCard key={post.id}>
      <Link to={`/store/${post.id}`} state={{ location: post.location }}>
        <p>{post.id}</p>
        <p>{post.store}</p>
        <p>{post.location}</p>
        <p>{post.day}</p>
        <p>{post.time}</p>
      </Link>
      <button onClick={openModal}>수정</button>
      {isOpen && <StoreUpdateModal type="update" closeModal={closeModal} id={post.id} post={post}></StoreUpdateModal>}
      <button onClick={() => deleteOnClickHandler(post.id)}>삭제</button>
      {userId && <button onClick={handleLikeClick}>{isLiked ? 'Unlike' : 'Like'}</button>}
      <p>{post.likeCount}</p>
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
