import React, { useState } from 'react';
import { styled } from 'styled-components';
import Button from '../shared/Button';
import SignUpModal from '../Auth/SignUpModal';
import LogInModal from '../Auth/LogInModal';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
// import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';


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
    navigate('/mypage');
  };

  if (user.userId === null) {
    return (
      <>
        <StDiv>
          <LinkDiv>
            <Link to={'/'} style={{ color: 'var(--color_white)' }}>
              StyLEgacy
            </Link>
          </LinkDiv>
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
          <LinkDiv>
            <Link to={'/'} style={{ color: 'var(--color_white)' }}>
              StyLEgacy
            </Link>
          </LinkDiv>
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
