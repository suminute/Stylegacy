import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toggleMap } from '../../redux/modules/toggleSlice';

function KakaoCustomInto({ data, index }) {
  const dispatch = useDispatch();
  const toggleCostom = useSelector((state) => state.toggleSlice);
  const [open, setOpen] = useState(toggleCostom);
  const { store, location, time } = data;
  //   const data
  return (
    <>
      {open.state === true && (
        <StCustomInfoBox>
          <StCustomInfoHeader>
            <h4>{store}</h4>

            <button
              onClick={() => {
                dispatch(toggleMap({ state: false, index }));
                setOpen({ state: false, index });
              }}
            >
              X
            </button>
          </StCustomInfoHeader>
          <StCustomInfoContentBox>
            <h3>{location}</h3>
            {/* ... 여기에 쭈르륵 추가하면 됩니당~ */}
            <p>{time}</p>
          </StCustomInfoContentBox>
        </StCustomInfoBox>
      )}
    </>
  );
}

export default React.memo(KakaoCustomInto);

const StCustomInfoBox = styled.div`
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  width: 300px;
  padding: 1rem 1rem 1.6rem 1rem;
  border-radius: 5px;

  &::after {
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    border: 15px solid transparent;
    border-bottom-width: 0;
    border-top-color: #fff;
  }
`;
const StCustomInfoHeader = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  & h4 {
    display: inline-block;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #000;
  }
  & button {
    display: flex;
    justify-content: center;
    align-self: center;
    border: 1px solid #000;
    width: 20px;
    height: 20px;
  }
`;
const StCustomInfoContentBox = styled.section`
  margin-top: 0.6rem;
  font-size: 12px;

  & h3 {
    flex: 1 0 274px;
    opacity: 0.8;
  }
  & p {
    margin-top: 0.3rem;
    opacity: 0.6;
  }
`;
