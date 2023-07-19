import React, { useState } from 'react';
import { styled } from 'styled-components';
import Button from './Button';
import SignUpModal from './Auth/SignUpModal';
import LogInModal from './Auth/LogInModal';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const users = useSelector((state) => state.user);
  const { user } = users;

  const navigate = useNavigate();

  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const logOut = async (event) => {
    event.preventDefault();
    await signOut(auth);
    alert('로그아웃되었습니다.');
    window.location.href = '/';
  };

  const goToMyPage = () => {
    navigate('/my');
  };

  if (user.userId === null) {
    return (
      <>
        <StDiv>
          <div></div>
          <ButtonDiv>
            <Button
              color="gray1"
              size="medium"
              onClick={() => {
                setIsLogInOpen((prev) => !prev);
              }}
            >
              로그인
            </Button>
            {isLogInOpen && <LogInModal isOpen={isLogInOpen} setIsOpen={setIsLogInOpen} />}
            <Button
              color="pink1"
              size="medium"
              onClick={() => {
                setIsSignUpOpen((prev) => !prev);
              }}
            >
              회원가입
            </Button>
            {isSignUpOpen && <SignUpModal isOpen={isSignUpOpen} setIsOpen={setIsSignUpOpen} />}
          </ButtonDiv>
        </StDiv>
      </>
    );
  } else {
    return (
      <>
        <StDiv>
          <div></div>
          <ButtonDiv>
            <Button color="gray1" size="medium" onClick={logOut}>
              로그아웃
            </Button>
            <Button color="pink1" size="medium" onClick={goToMyPage}>
              마이페이지
            </Button>
          </ButtonDiv>
        </StDiv>
      </>
    );
  }
};

export default Header;

const StDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 75px;
  background-color: var(--color_navy);
`;

const ButtonDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 30px;
`;
