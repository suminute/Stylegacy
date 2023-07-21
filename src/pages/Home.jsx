import styled from 'styled-components';
import React from 'react';
import SearchBar from './../components/shared/SearchBar';

const Home = () => {
  return (
    <StPageContainer>
      <StFormInner>
        <SearchBar size="large" />
        {/* <Button style={{margin:0}} type="submit" size='large' color='navy'>Search</Button> */}
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

const StPageContainer = styled.div`
  background-color: var(--color_pink2);
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
