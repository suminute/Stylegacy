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
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const queryClient = useQueryClient();
  const { 
    isLoading,
    status,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(['searchResult',name], 
  ({pageParam=0}) => searchStores(name,{page:pageParam}),
  {
    onSuccess:(data)=>{console.log('onSuccess',data)},
    getNextPageParam:(lastPage, pages) => {
      return lastPage.page < lastPage.nbPages-1 ? lastPage.page+1 : undefined
    }
  });

  const idArray = data?.pages.map(page=> page.hits.map(hit=>hit.objectID));
  console.log('idArray',idArray)
  const stores = useInfiniteQuery('stores', 
  ({pageParam=0}) => getStoresByIdArray(idArray[pageParam]),
  { 
    onSuccess:(data)=>console.log('stores',data), 
    enabled: !!(idArray?.length>0),
    getNextPageParam:(lastPage, pages) => {
      console.log(lastPage,pages)
      return pages.length < data.pages.length ? pages.length : undefined
    }
  });
  
  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target)
    console.log('entry',entry)
    if (hasNextPage && !isFetching) {
      console.log('fetch next page')
      fetchNextPage()
    }
  })

  useEffect(() => {
    if(isLoading || stores.error) return
    if(!stores.data) {
       console.log('refetch',isLoading,stores.data)
      stores.refetch()
    } else {
      if(data.pages.length > stores.data.pages.length)
      stores.fetchNextPage()
    }
  },[isLoading,stores,data])


  if (status==='loading' ||  stores.status==='loading') return <Loading />;
  if (error || stores.status === 'error') return <NotFound />;
  return (
    <>
    <button onClick={()=>{console.log('invalid');queryClient.invalidateQueries('stores')}}>stores invalid</button>
      {stores?.data?.pages &&
      stores?.data?.pages.map((page, pageIndex)=>{
        return page.map((post,itemIndex) => {
          return <PostItem key={post.id} post={post} />;
        })
      })
      }
      {hasNextPage&& !isFetching && <div ref={ref}>next</div>}
    </>
  );
};

export default Posts;
