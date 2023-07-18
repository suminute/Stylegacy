import { IconContext } from '@phosphor-icons/react';
import styled from 'styled-components';

const IconButton = ({ 
  icon,
  color='#000', 
  size='28px', 
  weight='regular', 
  label='button',
  onClick,
  ...props
  }) => {
  return (
    <IconContext.Provider
      value={{
        color,
        size,
        weight,
      }}
    >
      <StButton type='button' aria-label={label} onClick={onClick} {...props}>
        {icon}
      </StButton>
    </IconContext.Provider>
  )
}

export default IconButton

export const StButton = styled.button`
  cursor: pointer;
  display: flex;
  background-color: transparent;
  border: none;
  padding: 8px;
  border-radius: 20px;
  position: relative;
`;