import styled, { css } from "styled-components"

const InputText = ({full, ...props}) => {
  return (
    <StInputText full={full.toString()} {...props}></StInputText>
  )
}

export default InputText


const StInputText = styled.input`
  box-sizing: border-box;
  text-align: center;
  padding: 0.5em;
  border: 5px solid var(--color_pink1);
  background-color: var(--color_pink3);
  border-radius: 20px;
  width: 100%;
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
`