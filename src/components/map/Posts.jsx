import { useQuery } from 'react-query';
import PostItem from './postItem/PostItem';
import NotFound from '../shared/NotFound/NotFound';
import { useSearchParams } from 'react-router-dom';
import { searchStores } from '../../algoiasearch';
import SkeletonUi from '../shared/Loading/SkeletonUi/SkeletonUi';
import Button from './../shared/Button';

const Posts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const page = searchParams.get('page') || 0;
  const { isLoading, isError, data } = useQuery({
    queryKey: ['stores', +page],
    queryFn: () => searchStores(name, { page: +page }),
    keepPreviousData: true
  });

  const handleChangePage = (page) => {
    setSearchParams({ name, page });
  };

  if (isLoading) return <SkeletonUi />;
  if (isError) return <NotFound />;

  return (
    <>
      {data.hasPrevPage && (
        <Button color="navy" size="small" onClick={() => handleChangePage(+page - 1)}>
          Prev
        </Button>
      )}
      {data.hasNextPage && (
        <Button color="navy" size="small" onClick={() => handleChangePage(+page + 1)}>
          Next
        </Button>
      )}
      {data?.stores.map((store, i) => (
        <PostItem key={i} post={store} />
      ))}
    </>
  );
};

export default Posts;
