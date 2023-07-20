import React from 'react';
import { styled, css } from 'styled-components';
import './../color.css';
const Button = ({ onClick, color, full, size, children, ...props }) => {
  return (
    <StButton onClick={onClick} color={color} size={size} full={full ? 'true' : 'false'} {...props}>
      {children}
    </StButton>
  );
};

export default Button;

const StButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 8px;
  padding: 0.1rem;
  white-space: nowrap;
  transition: all 0.3s ease-in-out;
  ${({ color }) =>
    color === 'pink1' &&
    css`
      background-color: var(--color_pink1);
      color: var(--color_black);
    `}

  ${({ color }) =>
    color === 'pink2' &&
    css`
      background-color: var(--color_pink2);
      color: var(--color_black);
    `}

    ${({ color }) =>
    color === 'pink3' &&
    css`
      background-color: var(--color_pink3);
      color: var(--color_black);
    `}

    ${({ color }) =>
    color === 'navy' &&
    css`
      background-color: var(--color_navy);
      color: var(--color_white);
    `}

    ${({ color }) =>
    color === 'gray1' &&
    css`
      background-color: var(--color_gray1);
      color: var(--color_black);
    `}

  ${(props) =>
    props.full === 'true' &&
    css`
      margin: 10px auto;
      width: 90%;
    `}

  ${({ size }) =>
    size === 'small' &&
    css`
      height: 1.75rem;
      font-size: 0.875rem;
      padding: 0 0.4rem;
      margin: 10px auto;
    `}
    ${({ size }) =>
    size === 'medium' &&
    css`
      height: 2.25rem;
      font-size: 1rem;
      padding: 0 0.6rem;
      margin: 10px auto;
    `}
    ${({ size }) =>
    size === 'large' &&
    css`
      height: 3rem;
      font-size: 1.25rem;
      padding: 0 1rem;
      margin: 10px auto;
    `}
    ${({ disabled }) =>
    disabled === true &&
    css`
      background-color: var(--color_gray2);
    `}
`;
// 사용방식

/* <Button color='pink2' size="large" full>
        버튼입니다
      </Button> */
