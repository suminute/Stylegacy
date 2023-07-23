import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteStore } from '../../../api/stores';
import { styled } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { addLike, getLikes, removeAllLike, removeLike } from '../../../api/likes';
import { FaHeart, FaRegHeart, FaEllipsisV } from 'react-icons/fa';
import { openStoreUpdateModal } from '../../../redux/modules/storeUpdateSlice';
import Loading from './../../shared/Loading/Loading/Loading';

const PostItemButtons = ({ post }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const userId = user.userId;
  const [openMenu, setOpenMenu] = useState(false);

  // 좋아요
  const [likeProcessing, setLikeProcessing] = useState(false);
  const { isLoading, data: likes } = useQuery(['likes', post.id], () => getLikes(post.id));
  const isLiked = likes ? likes.includes(userId) : undefined;

  // 모달창 open dispatch
  const openUpdateModal = () => {
    setOpenMenu(false);
    dispatch(openStoreUpdateModal({ post: post }));
  };

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
      queryClient.invalidateQueries(['stores'], post.id);
    },
    onSettled: () => {
      setLikeProcessing(false);
    }
  });
  const removeLikeMutation = useMutation(removeLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes', post.id]);
      queryClient.invalidateQueries(['stores'], post.id);
    },
    onSettled: () => {
      setLikeProcessing(false);
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

  // 좋아요 버튼
  const handleLikeClick = () => {
    if (likeProcessing) {
      return;
    }
    setLikeProcessing(true);
    if (isLiked) {
      removeLikeMutation.mutate({ userId, storeId: post.id });
    } else {
      addLikeMutation.mutate({ userId, storeId: post.id });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <StButtonContainer>
      {userId ? (
        <StLikeButton onClick={handleLikeClick} disabled={likeProcessing}>
          {isLiked ? <FaHeart size="25" color="#ce7777" /> : <FaRegHeart size="25" color="#ce7777" />}
        </StLikeButton>
      ) : (
        <StLikeButton disabled={true}></StLikeButton>
      )}
      <StLikeButton onClick={() => setOpenMenu(!openMenu)}>
        <FaEllipsisV size="20" color="#ce7777" display={userId ? 'display' : 'none'} />
      </StLikeButton>
      {openMenu && (
        <StButtonBox>
          <StButton onClick={openUpdateModal}>수정</StButton>
          <StButton onClick={() => deleteOnClickHandler(post.id)}>삭제</StButton>
        </StButtonBox>
      )}
    </StButtonContainer>
  );
};

export default PostItemButtons;

const StButtonContainer = styled.div`
  grid-column: 2 / 3;
  margin-left: auto;
  display: grid;
  grid-template-columns: 30px 30px;
  grid-template-rows: 30px 1fr;
  position: relative;
  right: 0;
`;

const StLikeButton = styled.button`
  grid-row: 1 / 2;
  background-color: transparent;
  border: none;
  padding: 0;
`;

const StButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50%;
  position: absolute;
  top: 35px;
  right: 0;
  border: 1px solid var(--color_gray2);
  border-radius: 8px;
  box-shadow: 0px 0px 9px 2px #00000014;
  padding: 7px;
`;

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
