import algoliasearch from 'algoliasearch';
import { getStoresByIdArray } from './api/stores';

export const searchStores = async (searchText = '', { hitsPerPage = 5, page = 0 } = {}) => {
  const client = algoliasearch(process.env.REACT_APP_ALGOLIA_CLIENT_ID, process.env.REACT_APP_ALGOLIA_API_KEY);
  const storesIndex = client.initIndex('stores');
  const results = await storesIndex.search(searchText, { hitsPerPage: hitsPerPage, page: page });
  const idsArray = results.hits.map((hit) => hit.objectID);
  const stores = await getStoresByIdArray(idsArray);
  return {
    ...results,
    stores,
    lastPage: results.nbPages - 1 === results.page,
    hasNextPage: results.nbPages - 1 > results.page,
    hasPrevPage: results.page > 0
  };
};
