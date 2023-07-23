import React from 'react';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import PostItemButtons from './PostItemButtons';

const PostItem = ({ post }) => {
  return (
    <StCard key={post.id}>
      <Link to={`/store/${post.id}`} state={{ location: post.location }}>
        <img src={post.image} alt={post.store} />
        <StCardContents className="contents">
          <span className="storeName">{post.store}</span>
          <p>{post.location}</p>
          <div>
            <p className="day">{post.day}</p>
            <p>{post.time}</p>
          </div>
          <div className="like">
            <FaHeart size="18" color="#ce7777" />
            <p>{post.likeCount}</p>
          </div>
        </StCardContents>
      </Link>
      <PostItemButtons post={post} />
    </StCard>
  );
};

export default PostItem;

const StCard = styled.div`
  padding: 10px 10px;
  margin-top: 10px;
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
    object-fit: cover;
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
  grid-template-rows: 35px 50px 1fr 20px;
  & .storeName {
    margin: 5px;
    font-size: larger;
  }

  & p {
    margin: 5px;
    color: #777;
  }

  & div > .day {
    color: var(--color_navy);
  }

  & .like {
    display: flex;
    margin-left: 5px;
    align-items: center;
  }
`;
