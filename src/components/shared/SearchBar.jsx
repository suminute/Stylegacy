import React, { useEffect, useMemo, useState } from 'react';
import InputText from './InputText';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import IconButton from '../detailPage/IconButton';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useQueryClient } from 'react-query';

const SearchBar = ({ size, ...props }) => {
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient()
  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.pathname === '/search') {
      setSearchParams({ name: searchText });
    } else {
      navigate(`/search?name=${searchText}`);
    }
    queryClient.invalidateQueries('stores')
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  const iconSize = useMemo(() => (size === 'small' ? '28px' : size === 'medium' ? '34px' : '40px'), [size]);

  useEffect(() => {
    setSearchText(searchParams.get('name') || '');
  }, [setSearchText, searchParams]);

  return (
    <StForm onSubmit={handleSubmit}>
      <InputText
        onLoadFocus
        size={size}
        placeholder="원하는 브랜드를 찾아 보세요!"
        type="text"
        name="name"
        value={searchText}
        onChange={handleChange}
        full
        {...props}
      />
      <ButtonContainer>
        <IconButton type="submit" icon={<MagnifyingGlass />} weight="bold" size={iconSize} />
      </ButtonContainer>
    </StForm>
  );
};

export default SearchBar;

const StForm = styled.form`
  width: 100%;
  position: relative;
`;
const ButtonContainer = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
`;
