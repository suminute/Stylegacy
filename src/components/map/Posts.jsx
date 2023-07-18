import React, { useEffect, useState } from 'react';
import { getStores } from '../../api/maps';
import { useQuery } from 'react-query';
import PostItem from './PostItem';

const Posts = () => {
  const { isLoading, isError, data } = useQuery('stores', getStores);
  const [posts, setPosts] = useState(data);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  if (isLoading) {
    return <p>로딩중입니다....!</p>;
  }

  if (isError) {
    return <p>오류가 발생했습니다...!</p>;
  }
  return (
    <div>
      {posts &&
        posts.map((post) => {
          return <PostItem key={post.id} post={post} />;
        })}
    </div>
  );
};

export default Posts;
