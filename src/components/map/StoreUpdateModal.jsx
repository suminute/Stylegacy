import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import Button from '../Button';
import { useMutation, useQueryClient } from 'react-query';
import { addStore, storageUpload, updateStore } from '../../api/stores';
import useInput from '../../hooks/useInput';
import Checkbox from './Checkbox';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';

export const PORTAL_MODAL = 'portal-root';

const StoreUpdateModal = ({ type, closeModal, id, post }) => {
  const [disabled, setDisabled] = useState(true);
  const [store, storeHandler, setStore] = useInput('');
  const [openTime, openTimeHandler, setOpenTime] = useInput('');
  const [closeTime, closeTimeHandler, setCloseTime] = useInput('');
  const [location, locationHandler, setLocation] = useInput('');
  const [phoneNumber, phoneNumberHandler, setPhoneNumber] = useInput('');
  const [site, siteHandler, setSite] = useInput('');
  const [checkItems, setCheckItems] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const storeModal = useSelector((state) => state.storeAddSlice);
  useEffect(() => {
    if (type === 'add') {
      setStore('');
      setOpenTime('');
      setCloseTime('');
      setLocation('');
    } else if (type === 'update') {
      setStore(post.store);
      setLocation(post.location);
      if (post.time) {
        setOpenTime(post.time.split('-')[0].trim());
        setCloseTime(post.time.split('-')[1].trim());
      } else {
        setOpenTime('');
        setCloseTime('');
      }
      if (post.checkedDay) {
        post.checkedDay.map((day) => {
          checkItems.add(day);
        });
        setCheckItems(checkItems);
      }
      if (post.image) {
        setImageURL(post.image);
      }
    }
  }, []);

  useEffect(() => {
    if (location && store) {
      setDisabled(false);
    } else if (!location) {
      setDisabled(true);
    }
  }, [location, store]);

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  // 쿼리
  const queryClient = useQueryClient();
  const addMutation = useMutation(addStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });
  const updateMutation = useMutation(updateStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });

  // 저장 버튼과 수정 버튼
  const addButtonHandler = (e) => {
    e.preventDefault();
    const newStore = {
      store,
      checkedDay: [...checkItems],
      day: openDay(),
      time: `${openTime} - ${closeTime}`,
      location,
      site: null,
      phoneNumber: null,
      marker: { x: 0, y: 0 },
      image: null,
      likeCount: 0
    };
    addMutation.mutate(newStore);
    closeModal();
  };
  const updateButtonHandler = async (e) => {
    e.preventDefault();
    const modifiedStore = {
      store,
      checkedDay: [...checkItems],
      day: openDay(),
      time: `${openTime} - ${closeTime}`,
      location,
      site,
      phoneNumber,
      marker: { x: 0, y: 0 },
      image: selectedFile ? await storageUpload({ id, selectedFile }) : imageURL
    };
    updateMutation.mutate({ id, modifiedStore });
    closeModal();
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
        }
      });
      return `휴무일 ${closeDay.join().replaceAll(',', '')}`;
    }
  };

  // 이미지 업로드
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return storeModal
    ? createPortal(
        <StBackground>
          <Stdiv>
            <Button color="pink3" size="medium" onClick={closeModal}>
              X
            </Button>
          </Stdiv>
          <form>
            <div>
              <label>가게 이름</label>
              <input value={store} onChange={storeHandler} />
            </div>
            <div>
              <label>영업일</label>
              <StCheckbosDiv>
                {type === 'add' &&
                  days.map((day, index) => {
                    return <Checkbox key={index} day={day} index={index} checkHandler={checkHandler} />;
                  })}
                {type === 'update' &&
                  days.map((day, index) => {
                    return (
                      <Checkbox
                        key={index}
                        day={day}
                        index={index}
                        checkHandler={checkHandler}
                        checkedDay={post.checkedDay}
                        setCheckItems={setCheckItems}
                      />
                    );
                  })}
              </StCheckbosDiv>
              <div>
                <label>영업시간</label>
                <input type="time" value={openTime} onChange={openTimeHandler} />
                <input type="time" value={closeTime} onChange={closeTimeHandler} />
              </div>
            </div>
            <div>
              <label>상세주소</label>
              <input value={location} onChange={locationHandler} />
            </div>
            {type === 'update' && (
              <>
                <div>
                  <label>전화번호</label>
                  <input value={phoneNumber} onChange={phoneNumberHandler} />
                </div>
                <div>
                  <label>웹사이트</label>
                  <input value={site} onChange={siteHandler} />
                </div>
                <div>
                  <label>가게 이미지</label>
                  <input type="file" accept="image/*" onChange={handleFileSelect} />
                  {imageURL && <Button>이미지 삭제</Button>}
                  <StImagePreview>
                    <img src={post.image} alt="이미지 미리보기" style={{ width: '300px' }} />
                  </StImagePreview>
                </div>
              </>
            )}
            <div>
              {type === 'add' && (
                <Button type="submit" color="pink2" size="medium" disabled={disabled} onClick={addButtonHandler}>
                  저장
                </Button>
              )}
              {type === 'update' && (
                <Button type="submit" color="pink2" size="medium" disabled={disabled} onClick={updateButtonHandler}>
                  수정
                </Button>
              )}
            </div>
          </form>
        </StBackground>,
        document.getElementById(PORTAL_MODAL)
      )
    : null;
};

export default StoreUpdateModal;

const Stdiv = styled.div`
  position: absolute;
  right: 1.5rem;
`;

const StBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 50;
  min-width: 450px;
  height: 91vh;
  background-color: var(--color_pink3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const StCheckbosDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const StImagePreview = styled.div`
  width: 100%;
`;
