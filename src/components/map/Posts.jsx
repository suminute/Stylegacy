import { getStores, getStoresByIdArray } from '../../api/stores';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import PostItem from './postItem/PostItem';
import Loading from '../shared/Loading/Loading/Loading';
import NotFound from '../shared/NotFound/NotFound';
import { useSearchParams } from 'react-router-dom';
import { searchStores } from '../../algoiasearch';
import useIntersect from '../../hooks/useIntersect';
import { useEffect } from 'react';

const Posts = () => {
  const [searchParams,setSearchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const page = searchParams.get('page') || 0;
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: ['stores', +page],
    queryFn: () => searchStores(name,{page: +page}),
    keepPreviousData : true
  })


  const handleChangePage = (page) => {
    setSearchParams({name,page})
  }

  if (isLoading) return <Loading />;
  if (isError) return <NotFound />;
  console.log(data)

  return (
    <>
      {data.hasPrevPage && <button onClick={()=>handleChangePage(+page - 1)}>Prev</button>}
      {data.hasNextPage && <button onClick={()=>handleChangePage(+page + 1)}>Next</button>}
    {data?.stores.map((store,i) => (
      <PostItem key={i} post={store} />
      // <li>{store.location}: {store.store}</li>
    ))}
    </>
  );
};

export default Posts;
