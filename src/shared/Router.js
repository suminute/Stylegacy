import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Header from '../components/Header';
import Search from '../pages/Search';
import StoreDetail from '../pages/StoreDetail';

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/store/:id" element={<StoreDetail />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
