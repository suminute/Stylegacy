import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import Button from '../shared/Button';
import { useMutation, useQueryClient } from 'react-query';
import { addStore } from '../../api/stores';
import useInput from '../../hooks/useInput';
import Checkbox from './Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { closeStoreModal } from '../../redux/modules/storeAddSlice';
import AlertModal from '../shared/AlertModal';
import { toggleAlertModal } from '../../redux/modules/modalSlice';

export const PORTAL_MODAL = 'portal-root';

const StoreAddModal = () => {
  const [disabled, setDisabled] = useState(true);
  const [store, storeHandler] = useInput('');
  const [openTime, openTimeHandler] = useInput('');
  const [closeTime, closeTimeHandler] = useInput('');
  const [location, locationHandler, setLocation] = useInput('');
  const [checkItems, setCheckItems] = useState(new Set());

  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const basicImgURL = 'https://github.com/suminute/Stylegacy/assets/92218638/9824667b-e8b9-4a4e-a271-a9d3d8341089';
  const dispatch = useDispatch();

  const { isOpen, type, clickLocation } = useSelector((state) => state.storeAddSlice);
  const closeModal = () => {
    dispatch(closeStoreModal());
    setLocation('');
  };

  const modals = useSelector((state) => state.modals);

  useEffect(() => {
    if ((location || clickLocation) && store) {
      setDisabled(false);
    } else if (!location) {
      setDisabled(true);
    }
  }, [location, store, clickLocation]);

  // 쿼리
  const queryClient = useQueryClient();
  const addMutation = useMutation(addStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });

  // 저장 버튼
  const addButtonHandler = async (e) => {
    e.preventDefault();
    try {
      const latLng = await changeAddress(location || clickLocation);
      const newStore = {
        store,
        checkedDay: [...checkItems],
        day: openDay(),
        time: `${openTime} - ${closeTime}`,
        location: clickLocation || location,
        site: null,
        phoneNumber: null,
        marker: { x: latLng.x, y: latLng.y },
        image: basicImgURL,
        likeCount: 0,
        createdAt: Number(new Date().getTime())
      };

      addMutation.mutate(newStore);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  // 영업일 체크박스
  const checkHandler = (index, isChecked) => {
    if (isChecked) {
      checkItems.add(+index);
      setCheckItems(new Set(checkItems));
    } else if (!isChecked) {
      checkItems.delete(+index);
      setCheckItems(new Set(checkItems));
    }
  };

  // 영업일, 휴무일 구하는 함수
  const openDay = () => {
    const checkedDay = [...checkItems];
    if (checkedDay.length === 7) {
      return '매일';
    } else if (checkedDay.length === 0) {
      return null;
    } else {
      const closeDay = days.map((day, index) => {
        if (!checkedDay.includes(index)) {
          return day;
        } else return false;
      });
      return `휴무일 ${closeDay.join().replaceAll(',', '')}`;
    }
  };

  // => 주소를 받아서 위도 경도 변환후 => setLatLng 으로 담음
  const geocoder = new window.kakao.maps.services.Geocoder();

  const changeAddress = (location) => {
    return new Promise((resolve, reject) => {
      geocoder.addressSearch(location, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(result[0]);
        } else {
          reject('Failed to get address');
        }
      });
    });
  };
  return (
    <>
      {modals.isAlertModalOpen && (
        <AlertModal
          message={modals.alertMessage}
          isOpen={modals.isAlertModalOpen}
          setIsOpen={() => dispatch(toggleAlertModal())}
        />
      )}
      {isOpen
        ? createPortal(
            <StBackground type={type}>
              <div>
                <StForm>
                  <StInputContainer>
                    <label>가게 이름</label>
                    <input value={store} onChange={storeHandler} />
                  </StInputContainer>
                  <StInputContainer>
                    <label>영업일</label>
                    <StCheckboxDiv>
                      {days.map((day, index) => {
                        return <Checkbox key={index} day={day} index={index} checkHandler={checkHandler} />;
                      })}
                    </StCheckboxDiv>
                  </StInputContainer>
                  <StInputContainer>
                    <label>영업시간</label>
                    <input className="time" type="time" value={openTime} onChange={openTimeHandler} />
                    ~
                    <input className="time" type="time" value={closeTime} onChange={closeTimeHandler} />
                  </StInputContainer>
                  <StInputContainer>
                    <label>상세주소</label>
                    <input value={clickLocation || location} onChange={locationHandler} />
                  </StInputContainer>
                  <StButtonContaioner>
                    <Button type="submit" color="pink2" size="medium" disabled={disabled} onClick={addButtonHandler}>
                      저장
                    </Button>
                    <Button type="button" color="white" size="medium" onClick={closeModal}>
                      닫기
                    </Button>
                  </StButtonContaioner>
                </StForm>
              </div>
            </StBackground>,
            document.getElementById(PORTAL_MODAL)
          )
        : null}
    </>
  );
};

export default StoreAddModal;

const StButtonContaioner = styled.div`
  display: flex;
`;

const StBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 50;
  min-width: 600px;
  max-width: 600px;
  height: 94vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StInputContainer = styled.div`
  display: flex;
  font-size: larger;
  margin: 30px;
  align-items: center;
  justify-content: space-between;

  & input {
    margin-left: 20px;
    border: 0;
    border-bottom: 1.5px solid var(--color_pink1);
    outline: none;
    width: 70%;
    font-size: large;
  }
  & .time {
    margin-left: 10px;
    border: 0;
    border-bottom: 1.5px solid var(--color_pink1);
    outline: none;
    width: 120px;
    font-size: large;
  }
`;

const StCheckboxDiv = styled.div`
  display: flex;
  flex-direction: row;
`;
