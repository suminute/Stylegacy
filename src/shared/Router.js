import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Header from '../components/shared/Header';
import Search from '../pages/Search';
import StoreDetail from '../pages/StoreDetail';
import MyPage from '../pages/MyPage';

// NotFound 추가됨
import NotFound from '../components/shared/NotFound/NotFound';
import Loading from '../components/shared/Loading/Loading/Loading';
import SkeletonUi from '../components/shared/Loading/SkeletonUi/SkeletonUi';

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/aa1" element={<Loading />} />
        <Route path="/aa2" element={<SkeletonUi />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
