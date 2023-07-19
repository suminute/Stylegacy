import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const Checkbox = ({ day, index, checkHandler, checkedDay, setCheckItems }) => {
  const [ischecked, setischecked] = useState(false);

  const onChangeHandler = (e) => {
    setischecked(!ischecked);
    checkHandler(e.target.value, e.target.checked);
  };

  useEffect(() => {
    if (checkedDay) {
      if (checkedDay.includes(index)) {
        setischecked(true);
      }
    }
  }, []);

  return (
    <StLabel>
      <StCheckbox type="checkbox" value={index} checked={ischecked} onChange={(e) => onChangeHandler(e)} />
      <p>{day}</p>
    </StLabel>
  );
};

export default Checkbox;

const StCheckbox = styled.input`
  appearance: none;
`;

const StLabel = styled.label`
  cursor: pointer;
  /* display: flex; */
  /* align-items: center;*/
  margin: 10px;
  padding: 8px;
  border-radius: 8px;

  background-color: ${(ischecked) => {
    const { checked } = ischecked.children[0].props;
    if (checked) {
      return '#ffffff';
    } else {
      return `var(--color_gray2)`;
    }
  }};
`;
