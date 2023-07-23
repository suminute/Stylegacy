import styled from 'styled-components';
import React from 'react';
import SearchBar from './../components/shared/SearchBar';

const Home = () => {
  return (
    <StPageContainer>
      <StFormInner>
        <Stdiv>
          <StTitleDiv>Find</StTitleDiv>
          <StTitleDiv>the store you want</StTitleDiv>
          <SearchBar size="large" />
        </Stdiv>
      </StFormInner>
    </StPageContainer>
  );
};

export default Home;

const StFormInner = styled.div`
  display: flex;
  gap: 20px;
  width: 1077px;
`;

const Stdiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: calc(35vh - 75px);
  left: 70px;
  margin-right: 70px;

  & input {
    box-shadow: 0px 0px 9px 5px #0000005b;
  }
  & input:focus {
    outline: none;
  }
`;

const StTitleDiv = styled.div`
  font-size: 100px;
  font-family: 'GmarketSansMedium';
  font-weight: 900;
  color: white;
  margin-bottom: 30px;
`;

const StPageContainer = styled.div`
  background-image: url('https://github.com/suminute/Stylegacy/assets/92218638/19dcf5e8-cbe8-440d-a5c7-b31e23c223d0');
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: calc(100vh - 75px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
