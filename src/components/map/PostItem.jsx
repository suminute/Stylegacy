import React, { useState } from 'react';
import StoreUpdateModal from './StoreUpdateModal';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteStore } from '../../api/stores';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addLike, decreaseLikeCount, getLikes, increaseLikeCount, removeAllLike, removeLike } from '../../api/likes';
import { FaHeart, FaRegHeart, FaEllipsisV } from 'react-icons/fa';

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
  const [openMenu, setOpenMenu] = useState(false);

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
        <img src={post.image} />
        <StCardContents className="contents">
          <span className="storeName">{post.store}</span>
          <p>{post.location}</p>
          <p>
            <span>{post.day}</span>
            {` ${post.time}`}
          </p>
          <div className="like">
            <FaHeart size="18" color="#ce7777" />
            <p>{post.likeCount}</p>
          </div>
        </StCardContents>
      </Link>
      <StButtonContainer>
        {userId && (
          <StLikeButton onClick={handleLikeClick}>
            {isLiked ? <FaHeart size="25" color="#ce7777" /> : <FaRegHeart size="25" color="#ce7777" />}
          </StLikeButton>
        )}
        <StLikeButton onClick={() => setOpenMenu(!openMenu)}>
          <FaEllipsisV size="20" color="#ce7777" />
        </StLikeButton>
        {openMenu && (
          <div>
            <button onClick={openModal}>수정</button>
            <button onClick={() => deleteOnClickHandler(post.id)}>삭제</button>
          </div>
        )}
        {isOpen && <StoreUpdateModal type="update" closeModal={closeModal} id={post.id} post={post}></StoreUpdateModal>}
      </StButtonContainer>
    </StCard>
  );
};

export default PostItem;

const StCard = styled.div`
  margin: 10px 0 10px 0;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 100px;

  & a {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  & a > img {
    width: 100%;
    height: 165px;
    grid-column: 1 / 2;
    border-radius: 8px;
  }
  & a > .contents {
    grid-column: 2 / 3;
    padding-left: 10px;
  }

  &:hover {
    box-shadow: 0px 0px 9px 5px #00000014;
  }
`;

const StCardContents = styled.div`
  display: grid;
  grid-template-rows: 35px 30px 1fr 20px;
  & .storeName {
    margin: 5px;
    font-size: larger;
  }

  & p {
    margin: 5px;
    color: #777;
  }

  & p > span {
    color: var(--color_navy);
  }

  & .like {
    display: flex;
    margin-left: 5px;
    align-items: center;
  }
`;

const StButtonContainer = styled.div`
  grid-column: 2 / 3;
  margin-left: auto;
  display: grid;
  grid-template-columns: 30px 30px;
  grid-template-rows: 30px 1fr;
`;

const StLikeButton = styled.button`
  grid-row: 1 / 2;
  background-color: transparent;
  border: none;
  padding: 0;
`;
