import { getStores } from '../../api/stores';
import { useQuery } from 'react-query';
import PostItem from './PostItem';
import { styled } from 'styled-components';

const Posts = () => {
  const { isLoading, isError, data: posts } = useQuery('stores', getStores);

  if (isLoading) {
    return <p>로딩중입니다....!</p>;
  }

  if (isError) {
    return <p>오류가 발생했습니다...!</p>;
  }

  return (
    <>
      {posts &&
        posts.map((post) => {
          return <PostItem key={post.id} post={post} />;
        })}
    </>
  );
};

export default Posts;
