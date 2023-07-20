import React, { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';
import Button from '../Button';
import { useMutation, useQueryClient } from 'react-query';
import { addStore, storageUpload, updateStore } from '../../api/stores';
import useInput from '../../hooks/useInput';
import Checkbox from './Checkbox';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { openStoreModal } from '../../redux/modules/storeAddSlice';

export const PORTAL_MODAL = 'portal-root';

const StoreUpdateModal = ({ type, id, post }) => {
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
  const dispatch = useDispatch();
  const basicImgURL =
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220815_97%2F166056034235103u8W_JPEG%2F45553d3b7e8e7d2e2dacfceb2c62a5da.jpg';

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
      image: basicImgURL,
      likeCount: 0
    };
    addMutation.mutate(newStore);
    dispatch(openStoreModal(false));
  };
  const updateButtonHandler = async (e) => {
    e.preventDefault();
    if (imageURL) {
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
      dispatch(openStoreModal(false));
      alert('수정되었습니다!');
    } else {
      const modifiedStore = {
        store,
        checkedDay: [...checkItems],
        day: openDay(),
        time: `${openTime} - ${closeTime}`,
        location,
        site,
        phoneNumber,
        marker: { x: 0, y: 0 },
        image: selectedFile ? await storageUpload({ id, selectedFile }) : basicImgURL
      };
      updateMutation.mutate({ id, modifiedStore });
      dispatch(openStoreModal(false));
      alert('수정되었습니다!');
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
        }
      });
      return `휴무일 ${closeDay.join().replaceAll(',', '')}`;
    }
  };

  // 이미지 업로드
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    handleImgPreviw(event);
  };

  // 이미지 미리보기
  const [imgSrc, setImgSrc] = useState(imageURL);
  const handleImgPreviw = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      setSelectedFile(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImgSrc(e.target.result);
      };
    }
  };

  // 이미지 삭제
  const deleteImgHandler = () => {
    post.image = null;
    setImageURL(null);
    setImgSrc(null);
    setSelectedFile(null);
  };
  const closeModal = () => {
    dispatch(openStoreModal(false));
  };

  return storeModal.state
    ? createPortal(
        <StBackground type={type}>
          <Inner type={type}>
            <StForm>
              <StInputContainer>
                <label>가게 이름</label>
                <input value={store} onChange={storeHandler} />
              </StInputContainer>
              <StInputContainer>
                <label>영업일</label>
                <StCheckboxDiv>
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
                <input value={storeModal.clickLocation || location} onChange={locationHandler} />
              </StInputContainer>
              {type === 'update' && (
                <>
                  <StInputContainer>
                    <label>전화번호</label>
                    <input value={phoneNumber} onChange={phoneNumberHandler} />
                  </StInputContainer>
                  <StInputContainer>
                    <label>웹사이트</label>
                    <input value={site} onChange={siteHandler} />
                  </StInputContainer>
                  <StInputFileContainer>
                    <div>
                      <label className="title">가게 이미지</label>
                      <label className="file" for="file">
                        파일찾기
                      </label>
                    </div>
                    <input id="file" type="file" accept="image/*" onChange={handleFileSelect} />
                    <StImagePreview>
                      {imgSrc ? (
                        <div>
                          <img src={imgSrc} alt="이미지 미리보기" style={{ width: '300px' }} />
                        </div>
                      ) : (
                        <div>
                          <img src={imageURL} alt="이미지 미리보기" style={{ width: '300px' }} />
                        </div>
                      )}
                    </StImagePreview>
                    {imgSrc || imageURL ? <button onClick={deleteImgHandler}>이미지 삭제</button> : null}
                  </StInputFileContainer>
                </>
              )}
              <StButtonContaioner>
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
                <Button type="button" color="white" size="medium" onClick={closeModal}>
                  닫기
                </Button>
              </StButtonContaioner>
            </StForm>
          </Inner>
        </StBackground>,
        document.getElementById(PORTAL_MODAL)
      )
    : null;
};

export default StoreUpdateModal;

const StButtonContaioner = styled.div`
  display: flex;
`;

const StBackground = styled.div`
  ${({ type }) =>
    type === 'add' &&
    css`
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
    `}
  ${({ type }) =>
    type === 'update' &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(2px);
      z-index: 100;
    `}
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

const StInputFileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: scroll;
  margin: 30px;
  & label {
    margin-bottom: 10px;
  }
  & .title {
    font-size: larger;
  }
  & .file {
    font-size: medium;
    font-weight: 400;
    display: inline-block;
    padding: 10px 20px;
    color: #000;
    background-color: var(--color_pink3);
    cursor: pointer;
    border-radius: 8px;
    margin-left: 10px;
    width: 60px;
  }
  & input {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
  }
  & button {
    border: none;
    width: 100px;
    padding: 10px;
    border-radius: 8px;
  }
`;

const StCheckboxDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const StImagePreview = styled.div`
  width: 100%;
  & img {
    border-radius: 8px;
    margin-bottom: 10px;
  }
`;

const Inner = styled.form`
  ${({ type }) =>
    type === 'update' &&
    css`
      display: flex;
      flex-direction: column;
      justify-items: center;
      align-items: center;
      padding: 100px;
      background-color: white;
      border-radius: 10px;
    `}
`;
