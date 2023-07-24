import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useCallback, useEffect } from 'react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { clearAlertMessage } from '../../redux/modules/modalSlice';

export const PORTAL_MODAL = 'portal-root';

const ConfirmModal = ({ isOpen, setIsOpen, message, onConfirm }) => {
  const dispatch = useDispatch();

  const closeHandler = useCallback(() => {
    setIsOpen(false);
    dispatch(clearAlertMessage());
  }, [setIsOpen, dispatch]);

  const confirmHandler = useCallback(() => {
    onConfirm();
    closeHandler();
  }, [onConfirm, closeHandler]);

  useEffect(() => {
    const enterKeyHandler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmHandler();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', enterKeyHandler);
    }
    return () => {
      window.removeEventListener('keydown', enterKeyHandler);
    };
  }, [isOpen, confirmHandler]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return isOpen
    ? createPortal(
        <Outer onClick={closeHandler}>
          <Inner onClick={stopPropagation}>
            <StHeader>확인창입니다.</StHeader>
            <StMain>
              <div>{message}</div>
              <StButton color="navy" size="small" onClick={confirmHandler} type="button">
                확인
              </StButton>
              <StButton color="navy" size="small" onClick={closeHandler}>
                취소
              </StButton>
            </StMain>
          </Inner>
        </Outer>,
        document.getElementById(PORTAL_MODAL)
      )
    : null;
};

export default ConfirmModal;

const Outer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

const Inner = styled.div`
  width: 90%;
  max-width: 400px;
  margin-top: 30px;
  background-color: var(--color_gray1);
  border-radius: 5px;
`;

const StHeader = styled.header`
  padding: 10px;
  padding-left: 15px;
  background-color: var(--color_gray2);
  border-radius: 5px;
`;

const StMain = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-top: 1px solid var(--color_gray);
`;

const StButton = styled(Button)`
  margin: 0px;
  padding: 0 0.8rem;
`;
