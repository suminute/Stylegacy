import Router from './shared/Router';
import { apiKey } from './firebase';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from './redux/modules/userSlice';

function App() {
  const dispatch = useDispatch();

  // 로그인 세션 유지
  const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const isSession = sessionStorage.getItem(sessionKey) ? true : false;
  const isSessionList = JSON.parse(sessionStorage.getItem(sessionKey));

  useEffect(() => {
    if (isSession) {
      dispatch(
        getUser({
          userId: isSessionList.uid,
          displayName: isSessionList.displayName,
          email: isSessionList.email
        })
      );
    }
  }, []);

  return <Router />;
}

export default App;
