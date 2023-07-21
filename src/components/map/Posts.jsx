import { getStores } from '../../api/stores';
import { useQuery } from 'react-query';
import PostItem from './PostItem';
import { styled } from 'styled-components';
import Loading from '../shared/Loading/Loading/Loading';
import NotFound from '../shared/NotFound/NotFound';

const Posts = () => {
  const { isLoading, isError, data: posts } = useQuery('stores', getStores);

  if (isLoading) return <Loading />;
  if (isError) return <NotFound />;

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
