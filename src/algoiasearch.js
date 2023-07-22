import algoliasearch from 'algoliasearch';

const client = algoliasearch(process.env.REACT_APP_ALGOLIA_CLIENT_ID, process.env.REACT_APP_ALGOLIA_API_KEY);
export const stores = client.initIndex('stores');

export const searchStores = async (searchText, { hitsPerPage = 5, page = 0 } = {}) => {
  const results = await stores.search(searchText, { hitsPerPage: hitsPerPage, page: page });
  console.log(results);
  return results;
};
