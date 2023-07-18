import algoliasearch from 'algoliasearch';

const client = algoliasearch(process.env.REACT_APP_ALGOLIA_CLIENT_ID, process.env.REACT_APP_ALGOLIA_API_KEY);
export const stores = client.initIndex('stores');

export const storeSearch = async (searchText, page = 0) => {
  // const results = await stores.search(searchText, { hitsPerPage: 5, page: page });
  // console.log(results);
  // return results.hits;
  return [
    {
      path: 'stores/lGBXdJibgGduq4GDvjS8',
      address: '서울 용산구 한남대로28가길 19',
      name: '토니웩 한남',
      lastmodified: {
        _operation: 'IncrementSet',
        value: 1689585535733
      },
      objectID: 'lGBXdJibgGduq4GDvjS8',
      _highlightResult: {
        address: {
          value: '서울 용산구 한남대로28가길 19',
          matchLevel: 'none',
          matchedWords: []
        },
        name: {
          value: '토니웩 한남',
          matchLevel: 'none',
          matchedWords: []
        }
      }
    },
    {
      path: 'stores/d0N0Kspb7am9e7HbGHCG',
      address: '서울 용산구 한남대로46길 24',
      name: 'RECTO',
      lastmodified: {
        _operation: 'IncrementSet',
        value: 1689585535733
      },
      objectID: 'd0N0Kspb7am9e7HbGHCG',
      _highlightResult: {
        address: {
          value: '서울 용산구 한남대로46길 24',
          matchLevel: 'none',
          matchedWords: []
        },
        name: {
          value: 'RECTO',
          matchLevel: 'none',
          matchedWords: []
        }
      }
    },
    {
      path: 'stores/XgZyJ5FXx5s4Vg1Ghito',
      address: '서울 용산구 대사관로5길 34',
      name: '우니쿠',
      lastmodified: {
        _operation: 'IncrementSet',
        value: 1689585535733
      },
      objectID: 'XgZyJ5FXx5s4Vg1Ghito',
      _highlightResult: {
        address: {
          value: '서울 용산구 대사관로5길 34',
          matchLevel: 'none',
          matchedWords: []
        },
        name: {
          value: '우니쿠',
          matchLevel: 'none',
          matchedWords: []
        }
      }
    },
    {
      path: 'stores/GEkPoAJm3pGVIg0fn07q',
      address: '서울 용산구 이태원로 241 (한남동) 비이커 한남 플래그쉽스토어',
      name: '비이커 한남점',
      lastmodified: {
        _operation: 'IncrementSet',
        value: 1689585535733
      },
      objectID: 'GEkPoAJm3pGVIg0fn07q',
      _highlightResult: {
        address: {
          value: '서울 용산구 이태원로 241 (한남동) 비이커 한남 플래그쉽스토어',
          matchLevel: 'none',
          matchedWords: []
        },
        name: {
          value: '비이커 한남점',
          matchLevel: 'none',
          matchedWords: []
        }
      }
    },
    {
      path: 'stores/8qgRE17qUMB74aN0an9t',
      address: '서울 용산구 이태원로55가길 40 1층',
      name: '포터리 한남',
      lastmodified: 1689586189752,
      objectID: '8qgRE17qUMB74aN0an9t',
      _highlightResult: {
        address: {
          value: '서울 용산구 이태원로55가길 40 1층',
          matchLevel: 'none',
          matchedWords: []
        },
        name: {
          value: '포터리 한남',
          matchLevel: 'none',
          matchedWords: []
        }
      }
    }
  ];
};
