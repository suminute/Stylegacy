import Router from './shared/Router';
import { apiKey } from './firebase';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from './redux/modules/userSlice';

function App() {
  console.log(
    '%c StyLEgacy   ',
    'background: #2B3A55; font-size: 40px; font-weight: bold; color: #E8C4C4; text-shadow: 2px 2px 4px #CE7777;'
  );
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
          userName: isSessionList.displayName,
          userEmail: isSessionList.email
        })
      );
    }
  }, []);

  return <Router />;
}

export default App;
