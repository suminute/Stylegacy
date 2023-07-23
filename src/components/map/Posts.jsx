import { getStores } from '../../api/stores';
import { useQuery } from 'react-query';
import PostItem from './postItem/PostItem';
import NotFound from '../shared/NotFound/NotFound';
import SkeletonUi from '../shared/Loading/SkeletonUi/SkeletonUi';

const Posts = () => {
  const { isLoading, isError, data: posts } = useQuery('stores', getStores);

  if (isLoading) return <SkeletonUi />;
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
