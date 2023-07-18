import { useSearchParams } from "react-router-dom/dist"
import { storeSearch } from "../algoiasearch";
import SearchBar from "../components/SearchBar";
import { useQuery } from "react-query";

const Search = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name')||'';
  const {isLoading, error, data} = useQuery(['stores',name],() => storeSearch(name))

  if(isLoading) return (<div>Loading...</div>)
  if(error) return (<div>Error...</div>)
  return (
    <div>
      <SearchBar size='small'/>
      <div>{data.length > 0&& data.map((place) => (<li key={place.objectID}>{place.name} : {place.address}</li>))}</div>
    </div>
  )
}

export default Search