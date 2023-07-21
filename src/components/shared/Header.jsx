import React from 'react';
import { styled } from 'styled-components';
import SignUpModal from '../Auth/SignUpModal';
import LogInModal from '../Auth/LogInModal';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import Button from './Button';
import AlertModal from './AlertModal';
import { clearUser } from '../../redux/modules/userSlice';
import { setAlertMessage, toggleAlertModal, toggleLogInModal, toggleSignUpModal } from '../../redux/modules/modalSlice';

const Header = () => {
  const users = useSelector((state) => state.user);
  const { user } = users;

  const modals = useSelector((state) => state.modals);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = async (event) => {
    event.preventDefault();
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(setAlertMessage('로그아웃되었습니다.'));
      dispatch(toggleAlertModal());
    } catch (error) {
      console.log('error', error);
    }
  };

  const goToMyPage = () => {
    navigate('/mypage');
  };

  return (
    <>
      <AlertModal
        isOpen={modals.isAlertModalOpen}
        setIsOpen={() => dispatch(toggleAlertModal())}
        message={modals.alertMessage}
      />
      <StDiv>
        <LinkDiv>
          <Link to={'/'} style={{ color: 'var(--color_white)' }}>
            StyLEgacy
          </Link>
        </LinkDiv>
        <ButtonDiv>
          {user.userId === null ? (
            <>
              <Button color="gray1" size="medium" onClick={() => dispatch(toggleLogInModal())}>
                로그인
              </Button>
              {modals.isLogInModalOpen && (
                <LogInModal isOpen={modals.isLogInModalOpen} setIsOpen={() => dispatch(toggleLogInModal())} />
              )}
              <Button color="pink1" size="medium" onClick={() => dispatch(toggleSignUpModal())}>
                회원가입
              </Button>
              {modals.isSignUpModalOpen && (
                <SignUpModal isOpen={modals.isSignUpModalOpen} setIsOpen={() => dispatch(toggleSignUpModal())} />
              )}
            </>
          ) : (
            <>
              <Button color="gray1" size="medium" onClick={logOut}>
                로그아웃
              </Button>
              <Button color="pink1" size="medium" onClick={goToMyPage}>
                마이페이지
              </Button>
            </>
          )}
        </ButtonDiv>
      </StDiv>
    </>
  );
};

export default Header;

const StDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: var(--color_navy);
`;

const LinkDiv = styled.div`
  margin-left: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 30px;
`;
