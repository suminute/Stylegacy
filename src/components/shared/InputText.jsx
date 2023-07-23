import { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

const InputText = ({onLoadFocus, full, size, type, name, id, value, onChange, placeholder, ...props }) => {
  const inputRef = useRef('');
  useEffect(() => {
    if(onLoadFocus)
    inputRef.current.focus();
  }, [onLoadFocus]);

  return (
    <StInputText
      full={full ? 'true' : 'false'}
      size={size}
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      ref={inputRef}
      {...props}
    ></StInputText>
  );
};

export default InputText;

const StInputText = styled.input`
  box-sizing: border-box;
  text-align: center;
  padding: 0.5em;
  border: 5px solid var(--color_pink1);
  background-color: white;
  border-radius: 20px;
  ${(props) =>
    props.full === 'true' &&
    css`
      width: 100%;
    `}

  ${({ size }) =>
    size === 'small' &&
    css`
      font-size: 1.25rem;
    `}

  ${({ size }) =>
    size === 'medium' &&
    css`
      font-size: 1.5rem;
    `}

  ${({ size }) =>
    size === 'large' &&
    css`
      font-size: 1.875rem;
    `}
`;
